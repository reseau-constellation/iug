import constellationNavigateur from '../constellation/navigateur';
import {incrireCommuns} from './communs';

// Types
import type {App} from 'vue';

// À faire : https://rubenr.dev/en/pwa-vite/
// Pour apprendre : https://web.dev/learn/pwa/
export function inscrireExtentions(appli: App) {
  appli.use(constellationNavigateur);
  incrireCommuns(appli);
}
