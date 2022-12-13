import {messageÀConstellation, écouterMessagesDeConstellation} from '#preload';
import {ClientProxifiable, générerProxy} from './proxy';
import type {proxy} from '@constl/ipa';
import type {App} from 'vue';

class ProxyClientÉlectronPrincipal extends ClientProxifiable {
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

export default {
  install: (app: App) => {
    app.provide('constl', générerProxy(new ProxyClientÉlectronPrincipal()));
  },
};
