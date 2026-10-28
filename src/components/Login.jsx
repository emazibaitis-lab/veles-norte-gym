import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase.js'

function mensajeDeError(error) {
  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-email':
      return 'No pudimos iniciar sesión. Revisá el correo y la contraseña.'
    case 'auth/too-many-requests':
      return 'Hubo demasiados intentos. Esperá un momento y volvé a probar.'
    case 'auth/network-request-failed':
      return 'No hay conexión con el servicio. Revisá internet e intentá de nuevo.'
    case 'auth/operation-not-allowed':
      return 'El acceso por correo y contraseña no está habilitado en este proyecto.'
    default:
      return 'No se pudo iniciar sesión. Intentá de nuevo.'
  }
}

function Login() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  async function iniciarSesion(evento) {
    evento.preventDefault()
    setCargando(true)
    setError('')

    try {
      await signInWithEmailAndPassword(auth, correo.trim(), contrasena)
      setContrasena('')
    } catch (errorDeAcceso) {
      setError(mensajeDeError(errorDeAcceso))
    } finally {
      setCargando(false)
    }
  }

  return (
    <main className="app auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <p className="eyebrow">VELES NORTE GYM</p>
        <h1 id="login-title">Iniciar sesión</h1>
        <p className="auth-intro">Ingresá con el correo y la contraseña de tu cuenta.</p>

        <form className="auth-form" onSubmit={iniciarSesion}>
          <label htmlFor="login-email">Correo electrónico</label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
            required
            disabled={cargando}
          />

          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={contrasena}
            onChange={(evento) => setContrasena(evento.target.value)}
            required
            disabled={cargando}
          />

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="auth-submit" type="submit" disabled={cargando}>
            {cargando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default Login
