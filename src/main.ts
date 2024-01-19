import { createApp } from 'vue';
import './styles/variable.css';
import './styles/style.css';
import '@bpa-dev/uikit/src/styles/style.css';
import App from './App.vue';
import { router } from './router';
import { pinia } from './pinia';

createApp(App).use(router).use(pinia).mount('#app');
