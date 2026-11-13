import { getFirestore } from 'firebase/firestore'
import { app } from './firebaseApp.js'

export const db = getFirestore(app)
