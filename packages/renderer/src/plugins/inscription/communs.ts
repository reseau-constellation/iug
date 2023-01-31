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

// Types
import type {App} from 'vue';

// À faire : https://rubenr.dev/en/pwa-vite/
export function registerPlugins(app: App) {
  loadFonts();
  app.use(vuetify);
  app.use(i18n);
  app.use(routeur);
  app.use(kilimukku);
}
