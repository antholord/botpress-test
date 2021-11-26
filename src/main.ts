import Vue from 'vue'
import App from './App.vue'
import VueElectron from 'vue-electron'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Vue.use(VueElectron as any)
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
