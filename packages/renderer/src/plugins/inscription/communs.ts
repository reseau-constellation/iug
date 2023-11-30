/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import {loadFonts} from '../webfontloader';
import vuetify from '../vuetify';

import routeur from '../routeur';
import kilimukku from '../kilimukku';
import pinia from '../pinia';
import hljsVuePlugin from '../hljs';

// Types
import type {App} from 'vue';

export function incrireCommuns(app: App) {
  loadFonts();
  app.use(pinia);
  app.use(vuetify);
  app.use(routeur);
  app.use(kilimukku);
  app.use(hljsVuePlugin);
}
