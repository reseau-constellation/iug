import type {App} from 'vue';

import { mandataire } from '@constl/ipa';

export default {
    install: (app: App) => {
      const client = mandataire.ipa.générerMandataireProc();
      app.provide('constl', client);
    },
  };