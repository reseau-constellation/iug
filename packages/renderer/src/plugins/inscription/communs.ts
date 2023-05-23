/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import {loadFonts} from '../webfontloader';
import vuetify from '../vuetify';

import i18n from '../i18n';
import routeur from '../routeur';
import kilimukku from '../kilimukku';
import localisation from '../localisation';
import pinia from '../pinia';

// Types
import type {App} from 'vue';

// À faire : https://rubenr.dev/en/pwa-vite/
export function registerPlugins(app: App) {
  loadFonts();
  app.use(pinia);
  app.use(i18n);
  app.use(vuetify);
  app.use(routeur);
  app.use(localisation);
  app.use(kilimukku);
}
