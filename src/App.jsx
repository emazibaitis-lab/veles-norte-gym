import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './App.css'
import AppFooter from './components/AppFooter.jsx'
import AppHeader from './components/AppHeader.jsx'
import Login from './components/Login.jsx'
import { ejerciciosIniciales, rutinasPorDia, rutinasSemanales, diasDeLaSemana } from './data/rutinas.js'
import {
  cerrarSesion as cerrarSesionFirebase,
  observarSesion,
  obtenerUsuarioActual,
} from './services/firebase/autenticacion.js'

const ExerciseDetailPage = lazy(() => import('./pages/ExerciseDetailPage.jsx'))
const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const RoutinePage = lazy(() => import('./pages/RoutinePage.jsx'))

function App() {
  const [ejercicios, setEjercicios] = useState(ejerciciosIniciales)
  const [estadoProgresoRutinas, setEstadoProgresoRutinas] = useState('idle')
  const [errorProgresoRutinas, setErrorProgresoRutinas] = useState('')
  const [guardandoProgresoRutinas, setGuardandoProgresoRutinas] = useState(false)
  const [intentoCargaProgreso, setIntentoCargaProgreso] = useState(0)
  const [mensajeRutina, setMensajeRutina] = useState(null)
  const [estadoAcceso, setEstadoAcceso] = useState({ estado: 'cargando-sesion' })
  const [errorCierreSesion, setErrorCierreSesion] = useState('')
  const [cerrandoSesion, setCerrandoSesion] = useState(false)
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null)
  const [ejercicioCatalogoSeleccionado, setEjercicioCatalogoSeleccionado] = useState(null)
  const [detalleCatalogoApi, setDetalleCatalogoApi] = useState(null)
  const [estadoDetalleCatalogo, setEstadoDetalleCatalogo] = useState('idle')
  const [pagina, setPagina] = useState('inicio')
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null)
  const [vistaMapa, setVistaMapa] = useState('FRONT')
  const guardandoProgresoRef = useRef(false)
  const usuarioUid = estadoAcceso.estado === 'activo'
    ? estadoAcceso.usuario.uid
    : null

  const hoy = new Date()
  const numeroDia = hoy.getDay()
  const nombreDia = diasDeLaSemana[numeroDia]
  const rutinaDeHoy = rutinasPorDia[numeroDia]
  const rutinaSemanalDeHoy = rutinasSemanales.find((rutina) => rutina.dia === numeroDia)

  useEffect(() => {
    if (!mensajeRutina) return

    const temporizador = window.setTimeout(() => setMensajeRutina(null), 3500)
    return () => window.clearTimeout(temporizador)
  }, [mensajeRutina])

  useEffect(() => {
    let verificacionActual = 0

    const dejarDeObservar = observarSesion(async (usuario) => {
      const verificacion = ++verificacionActual

      if (!usuario) {
        setEstadoAcceso({ estado: 'sesion-cerrada' })
        return
      }

      setEstadoAcceso({ estado: 'consultando-perfil' })

      try {
        const { obtenerPerfilSocio } = await import('./services/firebase/socios.js')
        const perfil = await obtenerPerfilSocio(usuario.uid)
        if (verificacion !== verificacionActual) return

        if (!perfil) {
          setEstadoAcceso({ estado: 'sin-perfil' })
          return
        }
        if (perfil.activo !== true) {
          setEstadoAcceso({ estado: 'inactivo' })
          return
        }

        setEstadoAcceso({
          estado: 'activo',
          usuario,
          nombre: typeof perfil.nombre === 'string' && perfil.nombre.trim()
            ? perfil.nombre
            : 'Socio',
        })
      } catch (error) {
        if (verificacion !== verificacionActual) return
        setEstadoAcceso({
          estado: 'error-perfil',
          mensaje: error.code === 'permission-denied'
            ? 'Tu sesión se inició, pero Firestore no permite consultar tu perfil. Revisá las reglas de acceso.'
            : 'No pudimos consultar tu perfil. Revisá tu conexión e intentá de nuevo.',
        })
      }
    })

    return () => {
      verificacionActual += 1
      dejarDeObservar()
    }
  }, [])

  useEffect(() => {
    if (!usuarioUid) {
      setEjercicios((actuales) => actuales.map((ejercicio) => ({ ...ejercicio, completado: false })))
      setEjercicioSeleccionado(null)
      setEstadoProgresoRutinas('idle')
      setErrorProgresoRutinas('')
      return
    }

    let cancelado = false
    setEstadoProgresoRutinas('loading')
    setErrorProgresoRutinas('')

    async function cargarProgresoRutinas() {
      try {
        const { cargarProgresoRutinas } = await import('./services/firebase/progresoRutinas.js')
        const completadosPorRutina = await cargarProgresoRutinas(usuarioUid, rutinasSemanales)
        if (cancelado) return

        setEjercicios((actuales) => actuales.map((ejercicio) => ({
          ...ejercicio,
          completado: completadosPorRutina.get(ejercicio.rutinaId)?.has(ejercicio.id) ?? false,
        })))
        setEstadoProgresoRutinas('ready')
      } catch (error) {
        if (cancelado) return
        setErrorProgresoRutinas(
          error.code === 'permission-denied'
            ? 'Firestore no permite leer el progreso. Revisá las reglas de acceso propuestas.'
            : 'No pudimos cargar el progreso de tus rutinas. Revisá tu conexión e intentá de nuevo.'
        )
        setEstadoProgresoRutinas('error')
      }
    }

    cargarProgresoRutinas()
    return () => { cancelado = true }
  }, [usuarioUid, intentoCargaProgreso])

  async function alternarCompletado(id) {
    if (estadoProgresoRutinas !== 'ready' || guardandoProgresoRef.current || !usuarioUid) return

    const ejercicioActual = ejercicios.find((ejercicio) => ejercicio.id === id)
    if (!ejercicioActual) return

    const nuevoEstado = !ejercicioActual.completado
    const idsCompletados = ejercicios
      .filter((ejercicio) => ejercicio.rutinaId === ejercicioActual.rutinaId)
      .flatMap((ejercicio) => {
        const quedaCompletado = ejercicio.id === id ? nuevoEstado : ejercicio.completado
        return quedaCompletado ? [ejercicio.id] : []
      })

    guardandoProgresoRef.current = true
    setGuardandoProgresoRutinas(true)
    setErrorProgresoRutinas('')

    try {
      const { guardarProgresoRutina } = await import('./services/firebase/progresoRutinas.js')
      await guardarProgresoRutina(usuarioUid, ejercicioActual.rutinaId, idsCompletados)
      if (obtenerUsuarioActual()?.uid !== usuarioUid) return

      setEjercicios((actuales) => actuales.map((ejercicio) =>
        ejercicio.id === id ? { ...ejercicio, completado: nuevoEstado } : ejercicio
      ))
      setEjercicioSeleccionado((actual) =>
        actual?.id === id ? { ...actual, completado: nuevoEstado } : actual
      )

      const totalEjerciciosRutina = ejercicios.filter(
        (ejercicio) => ejercicio.rutinaId === ejercicioActual.rutinaId
      ).length
      if (nuevoEstado && idsCompletados.length === totalEjerciciosRutina) {
        const rutina = rutinasSemanales.find((item) => item.id === ejercicioActual.rutinaId)
        setMensajeRutina({ id: Date.now(), texto: `Completaste la rutina ${rutina?.nombre ?? ''}.` })
      }
    } catch (error) {
      if (obtenerUsuarioActual()?.uid !== usuarioUid) return
      setErrorProgresoRutinas(
        error.code === 'permission-denied'
          ? 'Firestore no permite guardar el progreso. Revisá las reglas de acceso propuestas.'
          : 'No pudimos guardar el cambio. Revisá tu conexión e intentá de nuevo.'
      )
    } finally {
      guardandoProgresoRef.current = false
      setGuardandoProgresoRutinas(false)
    }
  }

  function abrirDetalleCatalogo(ejercicioCatalogo) {
    setEjercicioSeleccionado(null)
    setEjercicioCatalogoSeleccionado(ejercicioCatalogo)
    setDetalleCatalogoApi(ejercicioCatalogo)
    setEstadoDetalleCatalogo('loaded')
  }

  async function cerrarSesion() {
    setErrorCierreSesion('')
    setCerrandoSesion(true)
    try {
      await cerrarSesionFirebase()
    } catch {
      setErrorCierreSesion('No se pudo cerrar la sesión. Intentá de nuevo.')
    } finally {
      setCerrandoSesion(false)
    }
  }

  function irAInicio() {
    setPagina('inicio')
    setEjercicioSeleccionado(null)
    setEjercicioCatalogoSeleccionado(null)
    setDetalleCatalogoApi(null)
    setEstadoDetalleCatalogo('idle')
  }

  function irARutina() {
    setPagina('rutina')
    setEjercicioSeleccionado(null)
    setEjercicioCatalogoSeleccionado(null)
    setDetalleCatalogoApi(null)
    setEstadoDetalleCatalogo('idle')
  }

  if (estadoAcceso.estado === 'cargando-sesion' || estadoAcceso.estado === 'consultando-perfil') {
    return (
      <main className="app auth-page">
        <p className="auth-status" role="status">
          {estadoAcceso.estado === 'cargando-sesion' ? 'Verificando tu sesión…' : 'Consultando tu perfil…'}
        </p>
      </main>
    )
  }

  if (estadoAcceso.estado === 'sesion-cerrada') return <Login />

  if (estadoAcceso.estado !== 'activo') {
    const mensajeAcceso = {
      'sin-perfil': 'Tu cuenta no tiene un perfil de socio asociado. Contactá al gimnasio para habilitar el acceso.',
      inactivo: 'Tu perfil de socio está inactivo. Contactá al gimnasio para recuperar el acceso.',
      'error-perfil': estadoAcceso.mensaje,
    }[estadoAcceso.estado]

    return (
      <main className="app auth-page">
        <section className="auth-panel auth-blocked" aria-labelledby="access-title">
          <p className="eyebrow">VELES NORTE GYM</p>
          <h1 id="access-title">No podemos habilitar el acceso</h1>
          <p className="auth-intro">{mensajeAcceso}</p>
          {errorCierreSesion && <p className="auth-error" role="alert">{errorCierreSesion}</p>}
          <button className="auth-submit" type="button" onClick={cerrarSesion} disabled={cerrandoSesion}>
            {cerrandoSesion ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className={`app ${pagina === 'rutina' ? 'app-routine' : ''}`}>
      <AppHeader
        pagina={pagina}
        nombreUsuario={estadoAcceso.nombre}
        cerrandoSesion={cerrandoSesion}
        errorCierreSesion={errorCierreSesion}
        onIrInicio={irAInicio}
        onIrRutina={irARutina}
        onCerrarSesion={cerrarSesion}
      />

      <div className="page-content" id="inicio">
        <Suspense fallback={<p className="auth-status" role="status">Cargando la vista…</p>}>
          {ejercicioCatalogoSeleccionado || ejercicioSeleccionado ? (
            <ExerciseDetailPage
              ejercicioCatalogo={ejercicioCatalogoSeleccionado ? detalleCatalogoApi : null}
              estadoDetalleCatalogo={estadoDetalleCatalogo}
              ejercicioRutina={ejercicioSeleccionado}
              estadoProgresoRutinas={estadoProgresoRutinas}
              guardandoProgresoRutinas={guardandoProgresoRutinas}
              errorProgresoRutinas={errorProgresoRutinas}
              onVolverAlCatalogo={() => {
                setEjercicioCatalogoSeleccionado(null)
                setDetalleCatalogoApi(null)
                setEstadoDetalleCatalogo('idle')
              }}
              onVolverARutina={() => setEjercicioSeleccionado(null)}
              onAlternarCompletado={alternarCompletado}
            />
          ) : pagina === 'rutina' ? (
            <RoutinePage
              nombreDia={nombreDia}
              rutinaSemanalDeHoy={rutinaSemanalDeHoy}
              onVolverInicio={() => setPagina('inicio')}
              ejercicios={ejercicios}
              estadoProgresoRutinas={estadoProgresoRutinas}
              errorProgresoRutinas={errorProgresoRutinas}
              guardandoProgresoRutinas={guardandoProgresoRutinas}
              onReintentarCarga={() => setIntentoCargaProgreso((intento) => intento + 1)}
              onSeleccionarEjercicio={setEjercicioSeleccionado}
              onAlternarCompletado={alternarCompletado}
              onAbrirDetalleCatalogo={abrirDetalleCatalogo}
              zonaSeleccionada={zonaSeleccionada}
              setZonaSeleccionada={setZonaSeleccionada}
              vistaMapa={vistaMapa}
              setVistaMapa={setVistaMapa}
            />
          ) : (
            <HomePage
              nombreDia={nombreDia}
              rutinaDeHoy={rutinaDeHoy}
              totalEjercicios={ejercicios.length}
              uid={estadoAcceso.usuario.uid}
              onComenzarEntrenamiento={() => {
                setPagina('rutina')
                setEjercicioSeleccionado(null)
              }}
            />
          )}
        </Suspense>
      </div>

      <AppFooter />

      {mensajeRutina && createPortal(
        <div className="challenge-toast" role="status" aria-live="polite">
          {mensajeRutina.texto}
        </div>,
        document.body
      )}
    </main>
  )
}

export default App
