import constellationÉlectron from '../constellation/électron';
import {incrireCommuns} from './communs';

// Types
import type {App} from 'vue';

export function inscrireExtentions(appli: App) {
  appli.use(constellationÉlectron);
  incrireCommuns(appli);
}
