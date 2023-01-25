import {createApp} from 'vue';
import App from '/@/App.vue';
import {inscrireExtentions} from '/@/plugins/inscription/électron.js';

const app = createApp(App);

inscrireExtentions(app);

app.mount('#app');
