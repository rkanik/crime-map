import { createMutations } from '../store.helpers'

const initialRadius = 2000
const iLatLng = () => ({ lat: 9.123580, lng: 7.540008 })

const initalState = () => ({
	radius: initialRadius,
	circle: {
		dot: false,
		draggable: false,
		location: iLatLng()
	}
})

const state = initalState()
const mutations = createMutations('SET')

const getters = {
	$radius: state => state.radius,
	$circle: state => state.circle
}

const actions = {
	setRadius({ commit }, payload) {
		commit('SET', { radius: payload })
	},
	setCircle({ commit }, payload) {
		commit('SET', { circle: payload })
	},
	resetRadius({ commit }) {
		commit('SET', { radius: initialRadius })
	}
}

export default {
	state,
	getters,
	actions,
	mutations,
	namespaced: true,
}
