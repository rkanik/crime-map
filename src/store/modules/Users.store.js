import { createMutations } from '../store.helpers'

const initalState = () => ({
	users: [],
})

const state = initalState()
const mutations = createMutations('SET', 'RESET')

const getters = {
	$users: state => state.users
}

const actions = {
	setUsers({ commit }, payload) {
		commit('SET', {
			users: payload
		})
	}
}

export default {
	state,
	getters,
	actions,
	mutations,
	namespaced: true,
}
