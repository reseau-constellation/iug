import {createApp} from 'vue';
import {inscrireExtentions} from './plugins/inscription/navigateur.js';
import App from '/@/App.vue';

const app = createApp(App);

inscrireExtentions(app);

app.mount('#app');
