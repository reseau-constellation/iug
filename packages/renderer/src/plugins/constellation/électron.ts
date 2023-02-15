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
