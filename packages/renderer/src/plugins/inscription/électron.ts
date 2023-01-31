import constellationÉlectron from '../constellation/électron';
import {registerPlugins} from './communs';

// Types
import type {App} from 'vue';

export function inscrireExtentions(appli: App) {
  appli.use(constellationÉlectron);
  registerPlugins(appli);
}
