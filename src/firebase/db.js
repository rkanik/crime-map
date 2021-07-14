import { handle } from '../helpers'
import { Users, Buildings } from './init'

const saveUser = async (id, data) => {
	return handle(Users.doc(id).set(data))
}

const getUser = async id => {
	return handle(Users.doc(id).get(), res => {
		return res.exists
			? { id: res.id, ...res.data() }
			: null
	})
}

const updateUser = async (id, user) => {
	return handle(Users.doc(id).get(), async doc => {
		await doc.ref.update(user)
		let userRes = await getUser(id)
		return userRes.res
	})
}

const addBuildingRecord = record => handle(
	Buildings.add(record), res => {
		return { id: res.id, ref: res }
	}
)

const getBuildingRecords = conditions => {
	let query = conditions
		? Buildings.where(...conditions)
		: Buildings
	return handle(
		query.get(), snapShot => {
			if (snapShot.empty) return
			let records = []
			snapShot.forEach(doc => {
				records.push({
					id: doc.id,
					ref: doc.ref,
					...doc.data()
				})
			})
			return records
		}
	)
}

export default {
	updateUser,
	getUser, saveUser,
	addBuildingRecord,
	getBuildingRecords
}