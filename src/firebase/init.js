import firebase from 'firebase/app'
import { _firebaseConfig } from '../consts';

import 'firebase/auth'
import 'firebase/firestore'

const firebaseApp = firebase.initializeApp(_firebaseConfig)

const Auth = firebase.auth()
const Users = firebaseApp.firestore().collection('users')
const Buildings = firebaseApp.firestore().collection('buildings')

export { Auth, Users, Buildings };
export default { Auth, Users, Buildings }