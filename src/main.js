import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueApexCharts from 'vue-apexcharts'

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
import './registerServiceWorker'

// Plugins
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueApexCharts)
Vue.use(VueGoogleMaps, {
  load: {
    key: _googleMapApiKey,
    libraries: 'places'
  }
})

// Components
Vue.component('apexchart', VueApexCharts)

// Config
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
