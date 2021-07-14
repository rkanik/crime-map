import DB from '../../firebase/db'
import { createMutations, handle } from '../store.helpers'

const initalState = () => ({
	records: []
})

const state = initalState()
const mutations = createMutations('SET', 'PUSH', 'CONCAT', 'UPDATE', 'DELETE')

const getters = {
	$records: state => state.records,
}

const actions = {
	createRecord: (_, payload) => handle(
		DB.addBuildingRecord(payload)
	),
	// createRecord: ({ commit }, payload) => handle(
	// 	DB.addBuildingRecord(payload), record => {
	// 		commit('PUSH', ['records', {
	// 			...record, ...payload
	// 		}])
	// 	}),
	getRecords: ({ commit }, payload) => handle(
		DB.getBuildingRecords(payload), (records = []) => {
			commit('SET', { records })
		}),
	deleteRecord: async ({ commit }, doc) => {
		await doc.ref.delete()
		commit('DELETE', ['records', doc.id])
	},
	setRecords: ({ commit }, records) => {
		commit('SET', { records })
	},
	pushCrime: ({ commit }, record) => {
		commit('PUSH', ['records', record])
	},
	concatCrimes: ({ commit }, crimes) => {
		commit('CONCAT', ['records', crimes])
	},
	updateCrime: ({ commit }, crime) => {
		commit('UPDATE', ['records', crime])
	},
}

export default {
	state,
	getters,
	actions,
	mutations,
	namespaced: true,
}
