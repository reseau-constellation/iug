import type {client, proxy, utils} from '@constl/ipa';
import type {BrowserWindow} from 'electron';
import {ipcMain, app} from 'electron';
import {join} from 'path';
import {v4 as uuidv4} from 'uuid';
import {Lock} from 'semaphore-async-await';
import {EventEmitter, once} from 'stream';
import type {
  messageDeServeur,
  messagePourServeur,
  messagePrêtDeServeur,
} from '../../preload/src/constellation';
const enDéveloppement = process.env.NODE_ENV !== 'production';

const promesseIPA = eval("import('@constl/ipa')") as Promise<typeof import('@constl/ipa')>; // eslint-disable-line
const promesseServeur = eval("import('@constl/serveur')") as Promise<
  typeof import('@constl/serveur')
>; // eslint-disable-line

class GestionnaireFenêtres {
  fenêtres: {[key: string]: BrowserWindow};
  clientConstellation: proxy.gestionnaireClient.default | undefined;
  verrouServeur: Lock;
  événements: EventEmitter;
  oublierServeur?: utils.schémaFonctionOublier;
  port?: number;

  constructor() {
    this.fenêtres = {};
    this.verrouServeur = new Lock();
    this.événements = new EventEmitter();
    this.initialiser();
  }

  async initialiser() {
    const {gestionnaireClient} = (await promesseIPA).proxy;
    const opts: client.optsConstellation = {
      orbite: {
        sfip: {
          dossier: join(app.getPath('userData'), enDéveloppement ? join('dév', 'sfip') : 'sfip'),
        },
        dossier: join(app.getPath('userData'), enDéveloppement ? join('dév', 'orbite') : 'orbite'),
      },
    };
    this.clientConstellation = new gestionnaireClient.default(
      (m: proxy.messages.MessageDeTravailleur) => this.envoyerMessageDuClient(m),
      (e: string) => this.envoyerErreur(e),
      opts,
    );
    ipcMain.on('pourServeur', async (_event, message: messagePourServeur) => {
      switch (message.type) {
        case 'init': {
          const port = await this.initialiserServeur(message.port);
          const messagePrêt: messagePrêtDeServeur = {
            type: 'prêt',
            port,
          };
          this.envoyerMessageDuServeur(messagePrêt);
          break;
        }
        case 'fermer':
          this.fermerServeur();
          break;
        default:
          throw new Error('Message inconnu : ' + JSON.stringify(message));
      }
    });
    this.événements.emit('prêt');
  }

  async prêt() {
    if (!this.clientConstellation) await once(this.événements, 'prêt');
  }

  private connecterFenêtre(fenêtre: BrowserWindow, id: string): string {
    this.fenêtres[id] = fenêtre;
    return id;
  }

  private déconnecterFenêtre(idFenêtre: string): void {
    delete this.fenêtres[idFenêtre];
  }

  envoyerMessageDuServeur(m: messageDeServeur) {
    Object.values(this.fenêtres).forEach(f => f.webContents.send('deServeur', m));
  }

  envoyerMessageDuClient(m: proxy.messages.MessageDeTravailleur) {
    if (m.id) {
      const idFenêtre = m.id.split(':')[0];
      m.id = m.id.split(':').slice(1).join(':');

      const fenêtre = this.fenêtres[idFenêtre];
      fenêtre.webContents.send('deClient', m);
    } else {
      Object.values(this.fenêtres).forEach(f => f.webContents.send('deClient', m));
    }
  }

  envoyerMessage(m: proxy.messages.MessageDeTravailleur) {
    if (m.id) {
      const idFenêtre = m.id.split(':')[0];
      m.id = m.id.split(':').slice(1).join(':');
      const fenêtre = this.fenêtres[idFenêtre];
      fenêtre.webContents.send('deClient', m);
    } else {
      Object.values(this.fenêtres).forEach(f => f.webContents.send('deClient', m));
    }
  }

  envoyerErreur(e: string) {
    const messageErreur: proxy.messages.MessageErreurDeTravailleur = {
      type: 'erreur',
      erreur: e,
    };
    Object.values(this.fenêtres).forEach(f => f.webContents.send('deClient', messageErreur));
  }
  connecterFenêtreÀConstellation(fenêtre: BrowserWindow) {
    const id = uuidv4();
    this.connecterFenêtre(fenêtre, id);

    const fSuivreMessagesPourConstellation = async (
      _event: Event,
      message: proxy.messages.MessagePourTravailleur,
    ): Promise<void> => {
      await this.prêt();

      if (!this.clientConstellation) throw new Error("Constellation n'est pas initialisée.");

      if (message.id) message.id = id + ':' + message.id;
      await this.clientConstellation.gérerMessage(message);
    };

    ipcMain.on('pourClient', fSuivreMessagesPourConstellation);

    // Sigaler que la fenêtre est bien attachée
    fenêtre.webContents.send('clientPrêt');

    const déconnecter = () => {
      ipcMain.off('pourClient', fSuivreMessagesPourConstellation);
      this.déconnecterFenêtre(id);
    };
    fenêtre.on('close', déconnecter);
  }

  async initialiserServeur(port?: number): Promise<number> {
    if (!this.clientConstellation) await this.prêt();

    await this.verrouServeur.acquire();

    // Fermer le serveur si on chage de port
    if (port !== undefined && this.port !== undefined && port !== this.port) {
      if (this.oublierServeur) await this.oublierServeur();
      this.port = undefined;
    }

    if (!this.port) {
      const constlServeur = await promesseServeur;
      const {fermerServeur, port: portServeur} = await constlServeur.lancerServeur({
        port,
        optsConstellation: this.clientConstellation!,
      });

      this.oublierServeur = fermerServeur;
      this.port = portServeur;
    }

    this.verrouServeur.release();
    return this.port!;
  }

  async fermerConstellation() {
    await this.fermerServeur();
    if (this.clientConstellation) await this.clientConstellation.fermer();
    this.clientConstellation = undefined;
  }

  async fermerServeur() {
    await this.verrouServeur.acquire();
    if (this.oublierServeur) await this.oublierServeur();
    this.port = undefined;
    this.verrouServeur.release();
  }
}

export const gestionnaireFenêtres = new GestionnaireFenêtres();
