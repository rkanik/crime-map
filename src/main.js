import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Stylesheets
import './assets/css/tailwind.css'
import './assets/scss/main.scss'

// Bootstrap
import {
  IconsPlugin,
  BootstrapVue,
} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Google Map
import { _googleMapApiKey } from './consts'
import * as VueGoogleMaps from 'vue2-google-maps'

// Plugins
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueGoogleMaps, {
  load: {
    key: _googleMapApiKey,
    libraries: 'places'
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
