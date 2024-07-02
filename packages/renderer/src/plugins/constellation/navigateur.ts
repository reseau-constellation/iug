import type {App} from 'vue';

import {créerConstellation} from '@constl/ipa';

export default {
  install: (app: App) => {
    const client = créerConstellation();
    app.config.globalProperties.$constl = client;
    app.provide('constl', client);
  },
};
