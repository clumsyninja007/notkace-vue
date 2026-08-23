import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Buefy from 'buefy';

createApp(App).use(router).use(store).use(Buefy).mount('#app');
