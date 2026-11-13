import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase.js'

export async function obtenerPerfilSocio(uid) {
  const documento = await getDoc(doc(db, 'socios', uid))
  return documento.exists() ? documento.data() : null
}
