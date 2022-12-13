import type {client, proxy} from '@constl/ipa';
import type {BrowserWindow} from 'electron';
import {ipcMain, app} from 'electron';
import {join} from 'path';
import {v4 as uuidv4} from 'uuid';
import {Lock} from 'semaphore-async-await';
import {EventEmitter, once} from 'stream';

const enDéveloppement = process.env.NODE_ENV !== 'production';

const promesseIPA = eval("import('@constl/ipa')") as Promise<typeof import('@constl/ipa')>; // eslint-disable-line

class GestionnaireFenêtres {
  fenêtres: {[key: string]: BrowserWindow};
  clientConstellation: proxy.gestionnaireClient.default | undefined;
  verrou: Lock;
  événements: EventEmitter;

  constructor() {
    this.fenêtres = {};
    this.verrou = new Lock();
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
      (m: proxy.messages.MessageDeTravailleur) => this.envoyerMessage(m),
      (e: string) => this.envoyerErreur(e),
      opts,
    );
    this.événements.emit('prêt');
  }

  private connecterFenêtre(fenêtre: BrowserWindow, id: string): string {
    this.fenêtres[id] = fenêtre;
    return id;
  }

  private déconnecterFenêtre(idFenêtre: string): void {
    delete this.fenêtres[idFenêtre];
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

  async fermerConstellation() {
    if (this.clientConstellation) await this.clientConstellation.fermer();
    this.clientConstellation = undefined;
  }

  connecterFenêtreÀConstellation(fenêtre: BrowserWindow) {
    const id = uuidv4();
    this.connecterFenêtre(fenêtre, id);

    const fSuivreMessagesPourConstellation = async (
      _event: Event,
      message: proxy.messages.MessagePourTravailleur,
    ): Promise<void> => {
      if (!this.clientConstellation) await once(this.événements, 'prêt');

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
}

export const gestionnaireFenêtres = new GestionnaireFenêtres();
