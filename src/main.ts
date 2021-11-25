import Vue from 'vue'
import App from './App.vue'
import VueElectron from 'vue-electron'

Vue.config.productionTip = false
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Vue.use(VueElectron as any)
new Vue({
  render: h => h(App)
}).$mount('#app')
