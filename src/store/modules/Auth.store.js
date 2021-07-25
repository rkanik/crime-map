import Auth from '../../firebase/auth'
import DB from '../../firebase/db'
import { createMutations, handle } from '../store.helpers'

const initalState = () => ({
	isAuth: false,
	user: {
		id: null,
		role: null
	}
})

const state = initalState()
const mutations = createMutations('SET', 'RESET')

const getters = {
	$user: ({ user }) => user,
	$isAuth: ({ isAuth }) => isAuth,
	$authRole: state => state.user.role,
	$isSubscribed: state => (
		state.user.role === 'admin' ||
		state.user.isSubscribed === true
	)
}

const actions = {
	signInUser: (_, payload) => Auth.singInUser(payload),
	registerUser: (_, payload) => Auth.registerUser(payload),
	updateProfile: async ({ commit }, [id, user]) => {
		return handle(DB.updateUser(id, user), uUser => {
			commit('SET', { user: uUser })
		})
	},
	signOutUser: async ({ commit }) => {
		return handle(Auth.signOutUser(), () => {
			commit('RESET', initalState())
		})
	},
}

export default {
	state,
	getters,
	actions,
	mutations,
	namespaced: true,
}
