import constellationNavigateur from '../constellation/navigateur';
import {registerPlugins} from './communs';

// Types
import type {App} from 'vue';

export function inscrireExtentions(appli: App) {
  appli.use(constellationNavigateur);
  registerPlugins(appli);
}
