import {
  envoyerMessageÀConstellation,
  écouterMessagesDeConstellation,
  envoyerMessageÀServeurConstellation,
  écouterMessagesDeServeurConstellation,
} from '#preload';
import type {App} from 'vue';
import {
  générerMandataireÉlectronPrincipal,
  GestionnaireServeur,
} from '@constl/mandataire-electron-rendu';

export default {
  install: (app: App) => {
    app.provide('constl', générerMandataireÉlectronPrincipal({
      envoyerMessageÀConstellation,
      écouterMessagesDeConstellation,
    }));
    app.provide('serveurConstl', new GestionnaireServeur({
      écouterMessagesDeServeurConstellation,
      envoyerMessageÀServeurConstellation,
    }));
  },
};
