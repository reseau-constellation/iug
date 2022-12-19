import {
  messageÀConstellation,
  écouterMessagesDeConstellation,
  messageÀServeurConstellation,
  écouterMessagesDeServeurConstellation,
} from '#preload';
import {ClientMandatairifiable, générerMandataire} from '@constl/mandataire';
import type {proxy} from '@constl/ipa';
import type {App} from 'vue';
import type {messageFermerServeur, messageInitServeur} from '../../../../preload/src/constellation';
import {EventEmitter, once} from 'events';

class ProxyClientÉlectronPrincipal extends ClientMandatairifiable {
  constructor() {
    super();

    écouterMessagesDeConstellation((m: proxy.messages.MessageDeTravailleur) => {
      this.événements.emit('message', m);
    });
  }

  envoyerMessage(message: proxy.messages.MessagePourTravailleur): void {
    messageÀConstellation(message);
  }
}

export class GestionnaireServeur {
  événements: EventEmitter;

  constructor() {
    this.événements = new EventEmitter();
    écouterMessagesDeServeurConstellation(message => {
      if (message.type === 'prêt') this.événements.emit('prêt', message.port);
    });
  }
  async initialiser(port?: number): Promise<number> {
    const messageInit: messageInitServeur = {
      type: 'init',
      port,
    };
    const promessePort = once(this.événements, 'prêt') as unknown as Promise<number>;
    messageÀServeurConstellation(messageInit);

    return await promessePort;
  }

  async fermer() {
    const messageFermer: messageFermerServeur = {
      type: 'fermer',
    };
    messageÀServeurConstellation(messageFermer);
  }
}

export default {
  install: (app: App) => {
    app.provide('constl', générerMandataire(new ProxyClientÉlectronPrincipal()));
    app.provide('serveurConstl', new GestionnaireServeur());
  },
};
