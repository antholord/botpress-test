/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from 'vue'
import App from './App.vue'
import VueElectron from 'vue-electron'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import VueNonreactive from 'vue-nonreactive'

Vue.config.productionTip = false

Vue.use(VueElectron as any)
Vue.use(VueNonreactive as any)
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
