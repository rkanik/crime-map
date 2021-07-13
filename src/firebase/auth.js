import DB from './db'
import { Auth } from './init'
import { handle } from '../helpers';

const signOutUser = () => { return Auth.signOut(), {} }

const singInUser = async ({ email, password }) => {
	return handle(
		Auth.signInWithEmailAndPassword(
			email, password
		)
	)
}

const registerUser = ({ email, password, ...data }) => {
	return handle(
		Auth.createUserWithEmailAndPassword(email, password), async res => {
			let user = await DB.saveUser(res.user.uid, {
				email, password, ...data
			})
			return { res: user }
		}
	)
}

const onStateChanged = cb => {
	Auth.onAuthStateChanged(async user => {
		if (user) {
			let { res } = await DB.getUser(user.uid)
			if (res) return cb(res)
			else return cb()
		}
		else return cb()
	})
}

export default {
	singInUser,
	signOutUser,
	registerUser,
	onStateChanged
}