import {
  envoyerMessageÀConstellation,
  envoyerMessageÀServeurConstellation,
  écouterMessagesDeConstellation,
  écouterMessagesDeServeurConstellation,
} from '#preload';
import {
  GestionnaireServeur,
  générerMandataireÉlectronPrincipal,
} from '@constl/mandataire-electron-rendu';
import type {App} from 'vue';

const enDéveloppement = process.env.NODE_ENV !== 'production';

export default {
  install: (app: App) => {
    const constl = générerMandataireÉlectronPrincipal({
      envoyerMessageÀConstellation,
      écouterMessagesDeConstellation,
      journal: enDéveloppement ? console.log : undefined,
    });

    app.config.globalProperties.$constl = constl;
    app.provide('constl', constl);

    const serveurConstl = new GestionnaireServeur({
      écouterMessagesDeServeurConstellation,
      envoyerMessageÀServeurConstellation,
    });
    app.config.globalProperties.$serveurConstl = serveurConstl;
    app.provide('serveurConstl', serveurConstl);
  },
};
