/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from '../vuetify';
import {loadFonts} from '../webfontloader';

import kilimukku from '../kilimukku';
import pinia from '../pinia';
import routeur from '../routeur';

// Types
import type {App} from 'vue';

export function incrireCommuns(app: App) {
  loadFonts();
  app.use(pinia);
  app.use(vuetify);
  app.use(routeur);
  app.use(kilimukku);
}
