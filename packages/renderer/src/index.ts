import {createApp} from 'vue';
import App from '/@/App.vue';
import {inscrireExtentions} from '/@/plugins/inscription/électron.js';

const appli = createApp(App);

inscrireExtentions(appli);

appli.mount('#app');
