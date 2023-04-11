import {createApp} from 'vue';
import router from './router'
import '@/assets/style.scss';
import 'bootstrap/dist/js/bootstrap.js'
import App from '@/App.vue';

const app = createApp(App)
app.use(router)
app.mount('#app')
