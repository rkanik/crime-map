import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import { _isDev } from '../consts';

import createLogger from 'vuex/dist/logger'
import createPersistedState from "vuex-persistedstate";

import { state, getters, mutations, actions } from './global.store'

let plugins = [
  createPersistedState({
    key: "__VUE_BUILDINGS__",
    paths: ['Auth.isAuth']
  })
]
if (_isDev) plugins.push(createLogger())

Vue.use(Vuex)

const store = new Vuex.Store({
  state, getters,
  mutations, actions,
  modules, plugins,
})


export default store