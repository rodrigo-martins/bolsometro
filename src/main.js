import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

import App from './App.vue'

Vue.use(Vuetify)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App)
})
