import {createApp} from 'vue';
import App from '/@/App.vue';
import Constellation from './plugins/constellation';

const app = createApp(App);

app.use(Constellation);

app.mount('#app');
