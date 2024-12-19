import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from 'pinia';
// import flowbite style
import '../node_modules/flowbite-vue/dist/index.css'

// toast notification
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
const pinia = createPinia();
const app = createApp(App)
app.use(Vue3Toastify)
app.use(pinia)
app.use(router)

app.mount('#app')
