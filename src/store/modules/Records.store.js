import DB from '../../firebase/db'
import { createMutations, handle } from '../store.helpers'

const initalState = () => ({
	records: []
})

const state = initalState()
const mutations = createMutations('SET', 'PUSH', 'DELETE')

const getters = {
	$records: state => state.records,
}

const actions = {
	createRecord: ({ commit }, payload) => handle(
		DB.addBuildingRecord(payload), record => {
			commit('PUSH', ['records', {
				...record, ...payload
			}])
		}),
	getRecords: ({ commit }, payload) => handle(
		DB.getBuildingRecords(payload), (records = []) => {
			commit('SET', { records })
		}),
	deleteRecord: async ({ commit }, doc) => {
		await doc.ref.delete()
		commit('DELETE', ['records', doc.id])
	},
}

export default {
	state,
	getters,
	actions,
	mutations,
	namespaced: true,
}
