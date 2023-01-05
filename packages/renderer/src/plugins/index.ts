/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import {loadFonts} from './webfontloader';
import vuetify from './vuetify';
import constellation from './constellation';
import i18n from './i18n';
import routeur from './routeur';

// Types
import type {App} from 'vue';

export function registerPlugins(app: App) {
  loadFonts();
  app.use(vuetify);
  app.use(i18n);
  app.use(routeur);
  app.use(constellation);
}
