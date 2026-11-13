import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../../firebaseAuth.js'

export function observarSesion(callback) {
  return onAuthStateChanged(auth, callback)
}

export function autenticarConCorreo(correo, contrasena) {
  return signInWithEmailAndPassword(auth, correo.trim(), contrasena)
}

export function cerrarSesion() {
  return signOut(auth)
}

export function obtenerUsuarioActual() {
  return auth.currentUser
}
