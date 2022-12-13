import {v4 as uuidv4} from 'uuid';
import {EventEmitter, once} from 'events';

import type {utils, proxy, client} from '@constl/ipa';

interface Tâche {
  id: string;
  fSuivre: utils.schémaFonctionSuivi<unknown>;
  fRetour: (fonction: string, args?: unknown[]) => Promise<void>;
}

class Callable extends Function {
  // Code obtenu de https://hackernoon.com/creating-callable-objects-in-javascript-d21l3te1
  //@ts-expect-error On ne peut pas appeller super() d'une fonction dans un contexte navigateur sécuritaire
  constructor() {
    const closure = function () {
      // Rien faire. Je ne comprends pas tout ça mais ça fonctionne.
    };
    return Object.setPrototypeOf(closure, new.target.prototype);
  }
}

export abstract class ClientProxifiable extends Callable {
  événements: EventEmitter;
  tâches: {[key: string]: Tâche};
  erreurs: {erreur: string; id?: string}[];

  constructor() {
    super();

    this.événements = new EventEmitter();

    this.tâches = {};
    this.erreurs = [];

    this.événements.on('message', (m: proxy.messages.MessageDeTravailleur) => {
      const {type} = m;
      switch (type) {
        case 'suivre': {
          const {id, données} = m as proxy.messages.MessageSuivreDeTravailleur;
          if (!this.tâches[id]) return;
          const {fSuivre} = this.tâches[id];
          fSuivre(données);
          break;
        }
        case 'suivrePrêt': {
          const {id, fonctions} = m as proxy.messages.MessageSuivrePrêtDeTravailleur;
          this.événements.emit(id, {fonctions});
          break;
        }
        case 'action': {
          const {id, résultat} = m as proxy.messages.MessageActionDeTravailleur;
          this.événements.emit(id, {résultat});
          break;
        }
        case 'erreur': {
          const {erreur, id} = m as proxy.messages.MessageErreurDeTravailleur;
          if (id) this.événements.emit(id, {erreur});
          else this.erreur({erreur, id});
          break;
        }
        default: {
          this.erreur({
            erreur: `Type inconnu ${type} dans message ${m}.`,
            id: m.id,
          });
        }
      }
    });
  }

  __call__(fonction: string[], args: {[key: string]: unknown} = {}): Promise<unknown> {
    if (typeof args !== 'object')
      throw new Error(`La fonction ${fonction.join('.')} fut appelée avec arguments ${args}. 
      Toute fonction proxy Constellation doit être appelée avec un seul argument en format d'objet (dictionnaire).`);
    const id = uuidv4();
    const nomArgFonction = Object.entries(args).find(x => typeof x[1] === 'function')?.[0];

    if (nomArgFonction) {
      return this.appelerFonctionSuivre(id, fonction, args, nomArgFonction);
    } else {
      return this.appelerFonctionAction(id, fonction, args);
    }
  }

  async appelerFonctionSuivre(
    id: string,
    fonction: string[],
    args: {[key: string]: unknown},
    nomArgFonction: string,
  ): Promise<utils.schémaFonctionOublier | {[key: string]: (...args: unknown[]) => void}> {
    const f = args[nomArgFonction] as utils.schémaFonctionSuivi<unknown>;
    const argsSansF = Object.fromEntries(
      Object.entries(args).filter(x => typeof x[1] !== 'function'),
    );
    if (f === undefined) {
      this.erreur({
        erreur:
          'Aucun argument de nom ' + nomArgFonction + " n'a été donnée pour " + fonction.join('.'),
      });
    }
    if (Object.keys(args).length !== Object.keys(argsSansF).length + 1) {
      this.erreur({
        erreur:
          "Plus d'un argument pour " +
          fonction.join('.') +
          ' est une fonction : ' +
          JSON.stringify(args),
        id,
      });
      return new Promise((_résoudre, rejeter) => rejeter());
    }

    const message: proxy.messages.MessageSuivrePourTravailleur = {
      type: 'suivre',
      id,
      fonction,
      args: argsSansF,
      nomArgFonction,
    };

    const fRetour = async (fonction: string, args?: unknown[]) => {
      const messageRetour: proxy.messages.MessageRetourPourTravailleur = {
        type: 'retour',
        id,
        fonction,
        args,
      };
      this.envoyerMessage(messageRetour);
    };

    const tâche: Tâche = {
      id,
      fSuivre: f,
      fRetour,
    };
    this.tâches[id] = tâche;

    const fOublierTâche = async () => {
      await this.oublierTâche(id);
    };

    this.envoyerMessage(message);

    const {fonctions, erreur} = (await once(this.événements, id))[0] as {
      fonctions?: string[];
      erreur?: string;
    };
    if (erreur) {
      this.erreur({erreur, id});
      throw new Error(erreur);
    }

    if (fonctions && fonctions[0]) {
      const retour: {[key: string]: (...args: unknown[]) => Promise<void>} = {
        fOublier: fOublierTâche,
      };
      for (const f of fonctions) {
        retour[f] = async (...args: unknown[]) => {
          await this.tâches[id]?.fRetour(f, args);
        };
      }
      return retour;
    } else {
      return fOublierTâche;
    }
  }

  async appelerFonctionAction<T>(
    id: string,
    fonction: string[],
    args: {[key: string]: unknown},
  ): Promise<T> {
    const message: proxy.messages.MessageActionPourTravailleur = {
      type: 'action',
      id,
      fonction,
      args: args,
    };

    const promesse = new Promise<T>((résoudre, rejeter) => {
      once(this.événements, id).then(données => {
        const {résultat, erreur} = données[0];
        if (erreur) rejeter(new Error(erreur));
        else résoudre(résultat);
      });
    });

    this.envoyerMessage(message);

    return promesse;
  }

  erreur({erreur, id}: {erreur: string; id?: string}): void {
    const infoErreur = {erreur, id};
    this.événements.emit('erreur', {
      nouvelle: infoErreur,
      toutes: this.erreurs,
    });
    throw new Error(JSON.stringify(infoErreur));
  }

  async oublierTâche(id: string): Promise<void> {
    const tâche = this.tâches[id];
    if (tâche) await tâche.fRetour('fOublier');
    delete this.tâches[id];
  }

  abstract envoyerMessage(message: proxy.messages.MessagePourTravailleur): void;
}

class Handler {
  listeAtributs: string[];

  constructor(listeAtributs?: string[]) {
    this.listeAtributs = listeAtributs || [];
  }

  get(obj: ClientProxifiable, prop: string): unknown {
    const directes = ['événements', 'erreurs'];
    if (directes.includes(prop)) {
      return obj[prop as keyof ClientProxifiable];
    } else {
      const listeAtributs = [...this.listeAtributs, prop];
      const h = new Handler(listeAtributs);
      return new Proxy(obj, h);
    }
  }

  apply(target: ClientProxifiable, _thisArg: Handler, args: [{[key: string]: unknown}]) {
    return target.__call__(this.listeAtributs, args[0]);
  }
}

export type ProxyClientConstellation = client.default & ClientProxifiable;

export const générerProxy = (proxyClient: ClientProxifiable): ProxyClientConstellation => {
  const handler = new Handler();
  return new Proxy<ClientProxifiable>(proxyClient, handler) as ProxyClientConstellation;
};
