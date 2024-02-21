import type {App} from 'vue';
import {créerConstellation} from '@constl/ipa';

export const attendreQue = (f: () => boolean): Promise<void> => {
  return new Promise(résoudre => {
    if (f()) résoudre();
    const oublier = setInterval(() => {
      if (f()) {
        clearInterval(oublier);
        résoudre();
      }
    }, 100);
  });
};

export const constellationTest = {
  install: (app: App) => {
    const client = créerConstellation({ dossier: './testConstl' });
    app.config.globalProperties.$constl = client;
    app.provide('constl', client);
  },
};
