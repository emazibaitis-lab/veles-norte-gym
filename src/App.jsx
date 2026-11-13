
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import './App.css'
import isotipo from './assets/isotipo.svg';
import userIcon from './assets/user-icon.svg'
import BodyMap from './components/BodyMap.jsx'
import ChallengesSection from './components/ChallengesSection.jsx'
import Login from './components/Login.jsx'
import { zonasMusculares } from './components/zonasMusculares.js'
import { catalogoEjercicios } from './data/catalogoEjercicios.js'
import { obtenerInstruccionesEnEspanol } from './data/contenidoEjerciciosEs.js'
import { auth, db } from './firebase.js'

const rutinasPorDia = {
  1: { nombre: 'ESPALDA', tipo: 'Tren superior' },
  2: { nombre: 'PECHO', tipo: 'Tren superior' },
  3: { nombre: 'PIERNAS', tipo: 'Tren inferior' },
  4: { nombre: 'HOMBROS', tipo: 'Tren superior' },
  5: { nombre: 'BRAZOS', tipo: 'Tren superior' },
  6: { nombre: 'FULL BODY', tipo: 'Cuerpo completo' },
  0: { nombre: 'DESCANSO', tipo: 'Día libre' },
}

const diasDeLaSemana = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
]

const rutinasSemanales = [
  { id: 'empuje', nombre: 'Empuje', grupo: 'Pecho, hombros y tríceps', dia: 1 },
  { id: 'tiron', nombre: 'Tirón', grupo: 'Espalda y bíceps', dia: 3 },
  { id: 'piernas', nombre: 'Piernas', grupo: 'Tren inferior', dia: 5 },
]

const ejerciciosIniciales = [
  {
    id: 1,
    catalogoId: 'press-de-banca-con-barra',
    rutinaId: 'empuje',
    zonasMusculares: ['pecho'],
    nombre: 'Press de banca',
    grupo: 'PECHO',
    series: 3,
    repeticiones: 10,
    descanso: '90 s',
  },
  {
    id: 2,
    catalogoId: 'jalon-al-pecho',
    rutinaId: 'tiron',
    zonasMusculares: ['espalda'],
    nombre: 'Jalón al pecho',
    grupo: 'ESPALDA',
    orden: 1,
    series: 3,
    repeticiones: '10–12',
    descanso: '75 s',
  },
  {
    id: 3,
    rutinaId: 'empuje',
    zonasMusculares: ['hombros'],
    nombre: 'Press de hombros',
    grupo: 'HOMBROS',
    series: 3,
    repeticiones: 10,
    descanso: '75 s',
  },
  {
    id: 4,
    rutinaId: 'tiron',
    zonasMusculares: ['brazos'],
    nombre: 'Curl de bíceps con mancuernas',
    grupo: 'BÍCEPS',
    orden: 4,
    series: 3,
    repeticiones: '10–12',
    descanso: '60 s',
  },
  {
    id: 10,
    rutinaId: 'tiron',
    zonasMusculares: ['espalda'],
    nombre: 'Remo sentado en polea',
    grupo: 'ESPALDA',
    orden: 2,
    series: 3,
    repeticiones: '10–12',
    descanso: '75 s',
  },
  {
    id: 11,
    rutinaId: 'tiron',
    zonasMusculares: ['espalda'],
    nombre: 'Remo con mancuernas con pecho apoyado',
    grupo: 'ESPALDA',
    orden: 3,
    series: 3,
    repeticiones: '10–12',
    descanso: '75 s',
  },
  {
    id: 12,
    rutinaId: 'tiron',
    zonasMusculares: ['brazos'],
    nombre: 'Curl martillo',
    grupo: 'BRAQUIAL Y BRAQUIORRADIAL',
    orden: 5,
    series: '2–3',
    repeticiones: '10–12',
    descanso: '60 s',
  },
  {
    id: 5,
    rutinaId: 'empuje',
    zonasMusculares: ['brazos'],
    nombre: 'Extensión de tríceps',
    grupo: 'TRÍCEPS',
    series: 3,
    repeticiones: 12,
    descanso: '60 s',
  },
  {
    id: 6,
    catalogoId: 'elevaciones-laterales',
    rutinaId: 'empuje',
    zonasMusculares: ['hombros'],
    nombre: 'Elevaciones laterales',
    grupo: 'HOMBROS',
    series: 3,
    repeticiones: 15,
    descanso: '60 s',
  },
  {
    id: 7,
    catalogoId: 'sentadilla-goblet',
    rutinaId: 'piernas',
    zonasMusculares: ['piernas', 'gluteos'],
    nombre: 'Sentadilla goblet',
    grupo: 'CUÁDRICEPS Y GLÚTEOS',
    orden: 1,
    series: 3,
    repeticiones: 12,
    descanso: '90 s',
  },
  {
    id: 8,
    catalogoId: 'peso-muerto-rumano',
    rutinaId: 'piernas',
    zonasMusculares: ['piernas', 'gluteos'],
    nombre: 'Peso muerto rumano',
    grupo: 'ISQUIOTIBIALES Y GLÚTEOS',
    orden: 2,
    series: 3,
    repeticiones: 10,
    descanso: '90 s',
  },
  {
    id: 9,
    catalogoId: 'elevaciones-de-talones-de-pie',
    rutinaId: 'piernas',
    zonasMusculares: ['piernas'],
    nombre: 'Elevación de talones',
    grupo: 'PANTORRILLAS',
    orden: 6,
    series: 3,
    repeticiones: 15,
    descanso: '60 s',
  },
  {
    id: 13,
    rutinaId: 'piernas',
    zonasMusculares: ['piernas'],
    nombre: 'Extensión de cuádriceps en máquina',
    grupo: 'CUÁDRICEPS',
    orden: 3,
    series: 3,
    repeticiones: '12–15',
    descanso: '60 s',
  },
  {
    id: 14,
    rutinaId: 'piernas',
    zonasMusculares: ['piernas'],
    nombre: 'Curl femoral sentado',
    grupo: 'ISQUIOTIBIALES',
    orden: 4,
    series: 3,
    repeticiones: 12,
    descanso: '60–75 s',
  },
  {
    id: 15,
    rutinaId: 'piernas',
    zonasMusculares: ['gluteos'],
    nombre: 'Hip thrust',
    grupo: 'GLÚTEOS',
    orden: 5,
    series: 3,
    repeticiones: '10–12',
    descanso: '90 s',
  },
]


const consejos = [
  {
    id: 1,
    categoria: 'Entrenamiento',
    titulo: 'La técnica va primero',
    texto:
      'Un movimiento controlado y una buena ejecución son más importantes que levantar mucho peso sacrificando la técnica.',
    aplicacion:
      'Probá: hacé las repeticiones sin apurarte y pedí ayuda al entrenador si tenés dudas.'
  },
  {
    id: 2,
    categoria: 'Entrenamiento',
    titulo: 'Registrá tus avances',
    texto:
      'Anotar las cargas y las repeticiones te permite comparar tus sesiones y reconocer tu progreso.',
    aplicacion:
      'Probá: registrá el peso y las repeticiones de cada ejercicio después de tu serie.'
  },
  {
    id: 3,
    categoria: 'Recuperación',
    titulo: 'Respetá los descansos',
    texto:
      'Recuperarte entre series ayuda a mantener la calidad de las repeticiones y el rendimiento.',
    aplicacion:
      'Probá: usá el descanso indicado en tu rutina como referencia y ajustalo con tu entrenador.'
  },
  {
    id: 4,
    categoria: 'Alimentación',
    titulo: 'No entrenes sin energía',
    texto:
      'Llegar al entrenamiento habiendo comido suficiente durante el día puede ayudarte a sostener el esfuerzo.',
    aplicacion:
      'Probá: organizá tus comidas según tus horarios, tus preferencias y cómo te sentís al entrenar.'
  },
  {
    id: 5,
    categoria: 'Alimentación',
    titulo: 'Dale importancia a las proteínas',
    texto:
      'Las proteínas contribuyen a la reparación y al mantenimiento de los músculos. Podés incorporarlas a través de distintos alimentos.',
    aplicacion:
      'Probá: incluí opciones como huevos, yogur, legumbres, pescado, carnes o tofu según tus preferencias.'
  },
  {
    id: 6,
    categoria: 'Alimentación',
    titulo: 'Mantenete hidratado',
    texto:
      'La hidratación acompaña el rendimiento y la regulación de la temperatura corporal durante el ejercicio.',
    aplicacion:
      'Probá: tomá agua a lo largo del día y tenela disponible durante el entrenamiento.'
  }
]


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
  const [menuMobileAbierto, setMenuMobileAbierto] = useState(false)
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false)
  const hoy = new Date()
  const numeroDia = hoy.getDay()
  const nombreDia = diasDeLaSemana[numeroDia]
  const rutinaDeHoy = rutinasPorDia[numeroDia]
  const rutinaSemanalDeHoy = rutinasSemanales.find(
    (rutina) => rutina.dia === numeroDia
  )
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null)
  const [ejercicioCatalogoSeleccionado, setEjercicioCatalogoSeleccionado] = useState(null)
  const [detalleCatalogoApi, setDetalleCatalogoApi] = useState(null)
  const [estadoDetalleCatalogo, setEstadoDetalleCatalogo] = useState('idle')
  const [entrenamientoIniciado, setEntrenamientoIniciado] = useState(false)
  const [pagina, setPagina] = useState('inicio')
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null)
  const [vistaMapa, setVistaMapa] = useState('FRONT')
  const indiceMuscularRef = useRef(null)
  const ejerciciosMuscularesRef = useRef(null)
  const topbarRef = useRef(null)
  const menuUsuarioRef = useRef(null)
  const guardandoProgresoRef = useRef(false)
  const usuarioUid = estadoAcceso.estado === 'activo'
    ? estadoAcceso.usuario.uid
    : null

  useEffect(() => {
    if (!mensajeRutina) return

    const temporizador = window.setTimeout(() => setMensajeRutina(null), 3500)
    return () => window.clearTimeout(temporizador)
  }, [mensajeRutina])

  useEffect(() => {
    if (!menuUsuarioAbierto && !menuMobileAbierto) return

    function cerrarMenuAlTocarAfuera(evento) {
      if (!topbarRef.current?.contains(evento.target)) {
        setMenuMobileAbierto(false)
        setMenuUsuarioAbierto(false)
      } else if (!menuUsuarioRef.current?.contains(evento.target)) {
        setMenuUsuarioAbierto(false)
      }
    }

    function cerrarMenuConEscape(evento) {
      if (evento.key === 'Escape') {
        setMenuMobileAbierto(false)
        setMenuUsuarioAbierto(false)
      }
    }

    document.addEventListener('pointerdown', cerrarMenuAlTocarAfuera)
    document.addEventListener('keydown', cerrarMenuConEscape)

    return () => {
      document.removeEventListener('pointerdown', cerrarMenuAlTocarAfuera)
      document.removeEventListener('keydown', cerrarMenuConEscape)
    }
  }, [menuMobileAbierto, menuUsuarioAbierto])

  const gruposCatalogo = zonaSeleccionada
    ? catalogoEjercicios
        .flatMap((ejercicio) =>
          ejercicio.grupos
            .filter((grupo) =>
              grupo.zona === zonaSeleccionada &&
              (grupo.vista === vistaMapa || grupo.vista === 'BOTH')
            )
            .map((grupo) => ({ ejercicio, subgrupo: grupo.subgrupo }))
        )
        .reduce((grupos, item) => {
          const grupoExistente = grupos.find((grupo) => grupo.nombre === item.subgrupo)
          if (grupoExistente) {
            grupoExistente.ejercicios.push(item.ejercicio)
          } else {
            grupos.push({ nombre: item.subgrupo, ejercicios: [item.ejercicio] })
          }
          return grupos
        }, [])
    : []

  useEffect(() => {
    let verificacionActual = 0

    const dejarDeObservar = onAuthStateChanged(auth, async (usuario) => {
      const verificacion = ++verificacionActual

      if (!usuario) {
        setEstadoAcceso({ estado: 'sesion-cerrada' })
        return
      }

      setEstadoAcceso({ estado: 'consultando-perfil' })

      try {
        const referenciaSocio = doc(db, 'socios', usuario.uid)
        const documentoSocio = await getDoc(referenciaSocio)

        if (verificacion !== verificacionActual) return

        if (!documentoSocio.exists()) {
          setEstadoAcceso({ estado: 'sin-perfil' })
          return
        }

        const perfil = documentoSocio.data()
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
      setEjercicios((actuales) => actuales.map((ejercicio) => ({
        ...ejercicio,
        completado: false,
      })))
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
        const documentos = await Promise.all(
          rutinasSemanales.map((rutina) =>
            getDoc(doc(db, 'socios', usuarioUid, 'progresoRutinas', rutina.id))
          )
        )

        if (cancelado) return

        const completadosPorRutina = new Map(
          documentos.map((documento, indice) => {
            const datos = documento.exists() ? documento.data() : {}
            const ids = Array.isArray(datos.ejerciciosCompletados)
              ? datos.ejerciciosCompletados.filter(Number.isInteger)
              : []
            return [rutinasSemanales[indice].id, new Set(ids)]
          })
        )

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

    return () => {
      cancelado = true
    }
  }, [usuarioUid, intentoCargaProgreso])

  useEffect(() => {
    if (!zonaSeleccionada) return

    function deseleccionarAlTocarAfuera(evento) {
      if (!indiceMuscularRef.current?.contains(evento.target)) {
        setZonaSeleccionada(null)
      }
    }

    document.addEventListener('pointerdown', deseleccionarAlTocarAfuera)
    return () => {
      document.removeEventListener('pointerdown', deseleccionarAlTocarAfuera)
    }
  }, [zonaSeleccionada])


  async function alternarCompletado(id) {
    if (
      estadoProgresoRutinas !== 'ready' ||
      guardandoProgresoRef.current ||
      !usuarioUid
    ) return

    const ejercicioActual = ejercicios.find((ejercicio) => ejercicio.id === id)
    if (!ejercicioActual) return

    const nuevoEstado = !ejercicioActual.completado
    const idsCompletados = ejercicios
      .filter((ejercicio) => ejercicio.rutinaId === ejercicioActual.rutinaId)
      .flatMap((ejercicio) => {
        const quedaCompletado = ejercicio.id === id
          ? nuevoEstado
          : ejercicio.completado
        return quedaCompletado ? [ejercicio.id] : []
      })

    guardandoProgresoRef.current = true
    setGuardandoProgresoRutinas(true)
    setErrorProgresoRutinas('')

    try {
      await setDoc(
        doc(db, 'socios', usuarioUid, 'progresoRutinas', ejercicioActual.rutinaId),
        {
          ejerciciosCompletados: idsCompletados,
          actualizadoEn: serverTimestamp(),
        },
        { merge: true }
      )

      if (auth.currentUser?.uid !== usuarioUid) return

      setEjercicios((actuales) => actuales.map((ejercicio) =>
        ejercicio.id === id
          ? { ...ejercicio, completado: nuevoEstado }
          : ejercicio
      ))
      setEjercicioSeleccionado((actual) =>
        actual?.id === id
          ? { ...actual, completado: nuevoEstado }
          : actual
      )

      const totalEjerciciosRutina = ejercicios.filter(
        (ejercicio) => ejercicio.rutinaId === ejercicioActual.rutinaId
      ).length
      if (nuevoEstado && idsCompletados.length === totalEjerciciosRutina) {
        const rutina = rutinasSemanales.find(
          (item) => item.id === ejercicioActual.rutinaId
        )
        setMensajeRutina({
          id: Date.now(),
          texto: `Completaste la rutina ${rutina?.nombre ?? ''}.`,
        })
      }
    } catch (error) {
      if (auth.currentUser?.uid !== usuarioUid) return

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

  async function abrirDetalleCatalogo(ejercicioCatalogo) {
    setEjercicioSeleccionado(null)
    setEjercicioCatalogoSeleccionado(ejercicioCatalogo)
    setDetalleCatalogoApi(ejercicioCatalogo)
    setEstadoDetalleCatalogo('loaded')
  }

  function mostrarEjerciciosMusculares() {
    const bloqueEjercicios = ejerciciosMuscularesRef.current
    if (!bloqueEjercicios) return

    bloqueEjercicios.open = true
    const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    requestAnimationFrame(() => {
      bloqueEjercicios.scrollIntoView({
        behavior: movimientoReducido ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }

  async function cerrarSesion() {
    setErrorCierreSesion('')
    setCerrandoSesion(true)

    try {
      await signOut(auth)
    } catch {
      setErrorCierreSesion('No se pudo cerrar la sesión. Intentá de nuevo.')
    } finally {
      setCerrandoSesion(false)
    }
  }

  if (estadoAcceso.estado === 'cargando-sesion' || estadoAcceso.estado === 'consultando-perfil') {
    return (
      <main className="app auth-page">
        <p className="auth-status" role="status">
          {estadoAcceso.estado === 'cargando-sesion'
            ? 'Verificando tu sesión…'
            : 'Consultando tu perfil…'}
        </p>
      </main>
    )
  }

  if (estadoAcceso.estado === 'sesion-cerrada') {
    return <Login />
  }

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
          <button
            className="auth-submit"
            type="button"
            onClick={cerrarSesion}
            disabled={cerrandoSesion}
          >
            {cerrandoSesion ? 'Cerrando sesión…' : 'Cerrar sesión'}
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className={`app ${pagina === 'rutina' ? 'app-routine' : ''}`}>
      <header className="topbar" ref={topbarRef}>
        <a
          className="brand"
          href="#inicio"
          onClick={(event) => {
            event.preventDefault()
            setPagina('inicio')
            setEjercicioSeleccionado(null)
            setEjercicioCatalogoSeleccionado(null)
            setDetalleCatalogoApi(null)
            setEstadoDetalleCatalogo('idle')
            setEntrenamientoIniciado(false)
            setMenuMobileAbierto(false)
            setMenuUsuarioAbierto(false)
          }}
        >
          <img
            src={isotipo}
            alt=""
            className="brand-icon"
          />
          <span className="brand-name">VELES NORTE</span>
        </a>

        <button
          type="button"
          className={`mobile-menu-toggle ${menuMobileAbierto ? 'is-open' : ''}`}
          aria-label={menuMobileAbierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          aria-controls="topbar-menu"
          aria-expanded={menuMobileAbierto}
          onClick={() => {
            setMenuMobileAbierto((abierto) => !abierto)
            setMenuUsuarioAbierto(false)
          }}
        >
          <span className="mobile-menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>

        <div
          id="topbar-menu"
          className={`topbar-navigation-panel ${menuMobileAbierto ? 'is-open' : ''}`}
        >
          <nav className="navigation" aria-label="Navegación principal">
            <a
              href="#inicio"
              className={pagina === 'inicio' ? 'active' : ''}
              onClick={(event) => {
                event.preventDefault()
                setPagina('inicio')
                setEjercicioSeleccionado(null)
                setEjercicioCatalogoSeleccionado(null)
                setDetalleCatalogoApi(null)
                setEstadoDetalleCatalogo('idle')
                setMenuMobileAbierto(false)
                setMenuUsuarioAbierto(false)
              }}
            >
              Inicio
            </a>

            <a
              href="#rutina"
              className={pagina === 'rutina' ? 'active' : ''}
              onClick={(event) => {
                event.preventDefault()
                setPagina('rutina')
                setEjercicioSeleccionado(null)
                setEjercicioCatalogoSeleccionado(null)
                setDetalleCatalogoApi(null)
                setEstadoDetalleCatalogo('idle')
                setMenuMobileAbierto(false)
                setMenuUsuarioAbierto(false)
              }}
            >
              Mi rutina
            </a>
          </nav>

          <div
            className={`member-session account-menu ${menuUsuarioAbierto ? 'is-open' : ''}`}
            ref={menuUsuarioRef}
          >
            <button
              type="button"
              className="account-menu-trigger"
              aria-label={menuUsuarioAbierto ? 'Cerrar opciones de usuario' : 'Mostrar opciones de usuario'}
              aria-controls="account-dropdown"
              aria-expanded={menuUsuarioAbierto}
              onClick={() => setMenuUsuarioAbierto((abierto) => !abierto)}
            >
              <img src={userIcon} alt="" />
              <span className="account-menu-label">Usuario</span>
            </button>
            <div id="account-dropdown" className="account-dropdown" role="group" aria-label="Opciones de cuenta">
              <span className="account-name">{estadoAcceso.nombre}</span>
              <button
                type="button"
                className="account-logout"
                onClick={cerrarSesion}
                disabled={cerrandoSesion}
              >
                {cerrandoSesion ? 'Cerrando sesión…' : 'Cerrar sesión'}
              </button>
              {errorCierreSesion && <span className="session-error" role="alert">{errorCierreSesion}</span>}
            </div>
          </div>
        </div>
      </header>


      <div className="page-content" id="inicio">
        {ejercicioCatalogoSeleccionado ? (
          <section className="exercise-detail">
            <button
              type="button"
              className="back-button"
              aria-label="Volver al catálogo de ejercicios"
              onClick={() => {
                setEjercicioCatalogoSeleccionado(null)
                setDetalleCatalogoApi(null)
                setEstadoDetalleCatalogo('idle')
              }}
            >
              <span aria-hidden="true">←</span>
            </button>

            <p className="eyebrow">EXPLORADOR DE EJERCICIOS</p>
            <h1>{ejercicioCatalogoSeleccionado.nombre}</h1>
            <p className="detail-intro">
              Información de referencia de ExerciseDB. No forma parte de tu rutina.
            </p>

            <div className="detail-card catalog-api-card" aria-live="polite">
              {estadoDetalleCatalogo === 'loaded' && detalleCatalogoApi && (
                <>
                  <div className="catalog-api-match">
                    <span>{detalleCatalogoApi.exerciseDbName ? 'NOMBRE ORIGINAL EN EXERCISEDB' : 'GRUPO MUSCULAR'}</span>
                    <strong>{detalleCatalogoApi.exerciseDbName || detalleCatalogoApi.grupos.map(({ subgrupo }) => subgrupo).join(', ')}</strong>
                  </div>
                  {detalleCatalogoApi.exerciseDbGifUrl ? (
                    <img
                      className="catalog-api-gif"
                      src={detalleCatalogoApi.exerciseDbGifUrl}
                      alt={`Demostración animada: ${ejercicioCatalogoSeleccionado.nombre}`}
                      loading="lazy"
                      onError={(event) => { event.currentTarget.hidden = true }}
                    />
                  ) : (
                    <p className="detail-note">Todavía no hay una demostración animada verificada para este ejercicio.</p>
                  )}

                  <div className="catalog-api-metadata">
                    <div>
                      <span>GRUPO MUSCULAR</span>
                      <strong>{detalleCatalogoApi.grupos.map(({ subgrupo }) => subgrupo).filter((grupo, index, grupos) => grupos.indexOf(grupo) === index).join(', ')}</strong>
                    </div>
                  </div>

                  <h2>Indicaciones en español</h2>
                  <ol className="catalog-api-instructions">
                    {obtenerInstruccionesEnEspanol(ejercicioCatalogoSeleccionado).map((indicacion, indice) => (
                      <li key={`${indice}-${indicacion}`}>{indicacion}</li>
                    ))}
                  </ol>
                  {detalleCatalogoApi.exerciseDbGifUrl && (
                    <p className="detail-note catalog-api-credit">
                      Demostración animada: <a href="https://exercisedb.dev/" target="_blank" rel="noreferrer">ExerciseDB / AscendAPI</a>.
                    </p>
                  )}
                </>
              )}
            </div>
          </section>
        ) : ejercicioSeleccionado ? (
          <section className="exercise-detail">
            <button
              type="button"
              className="back-button"
              aria-label="Volver a mi rutina"
              onClick={() => setEjercicioSeleccionado(null)}
            >
              <span aria-hidden="true">←</span>
            </button>

            <p className="eyebrow">{ejercicioSeleccionado.grupo}</p>
            <h1>{ejercicioSeleccionado.nombre}</h1>
            <p className="detail-intro">
              Consultá los datos de tu ejercicio antes de empezar.
            </p>

            <div className="detail-card">
              <div className="exercise-illustration">
                <span>VN</span>
                <span className="illustration-number">
                  {String(ejercicioSeleccionado.id).padStart(2, '0')}
                </span>
              </div>

              <div className="detail-stats">
                <div>
                  <span>SERIES</span>
                  <strong>{ejercicioSeleccionado.series}</strong>
                </div>
                <div>
                  <span>REPETICIONES</span>
                  <strong>{ejercicioSeleccionado.repeticiones}</strong>
                </div>
                <div>
                  <span>DESCANSO</span>
                  <strong>{ejercicioSeleccionado.descanso}</strong>
                </div>
              </div>

              <h2>Indicaciones</h2>
              <p>
                Seguí la técnica que te indicó tu entrenador. Realizá el movimiento
                de forma controlada y utilizá una carga adecuada.
              </p>
              <p className="detail-note">
                La explicación y el material visual específico se podrán completar
                para cada ejercicio en una próxima etapa.
              </p>

              <button
                className={
                  ejercicioSeleccionado.completado
                    ? 'complete-button completed'
                    : 'complete-button'
                }
                disabled={estadoProgresoRutinas !== 'ready' || guardandoProgresoRutinas}
                onClick={() => alternarCompletado(ejercicioSeleccionado.id)}
              >
                {guardandoProgresoRutinas
                  ? 'Guardando progreso…'
                  : ejercicioSeleccionado.completado
                  ? '✓ Ejercicio completado'
                  : 'Marcar ejercicio como realizado'}
              </button>
              {errorProgresoRutinas && (
                <p className="auth-error" role="alert">{errorProgresoRutinas}</p>
              )}
            </div>
          </section>
        ) : pagina === 'rutina' ? (
          <section className="exercise-section">
            <button
              type="button"
              className="back-button"
              aria-label="Volver al inicio"
              onClick={() => setPagina('inicio')}
            >
              <span aria-hidden="true">←</span>
            </button>

            <p className="eyebrow">RUTINAS ASIGNADAS · 3 DÍAS</p>
            <h1>Mi rutina</h1>

            <div className="weekly-routines">
              {estadoProgresoRutinas === 'loading' && (
                <p className="auth-status" role="status">Cargando tu progreso…</p>
              )}
              {estadoProgresoRutinas === 'error' && (
                <div>
                  <p className="auth-error" role="alert">{errorProgresoRutinas}</p>
                  <button
                    type="button"
                    onClick={() => setIntentoCargaProgreso((intento) => intento + 1)}
                  >
                    Reintentar
                  </button>
                </div>
              )}
              {estadoProgresoRutinas === 'ready' && guardandoProgresoRutinas && (
                <p className="auth-status" role="status">Guardando progreso…</p>
              )}
              {estadoProgresoRutinas === 'ready' && errorProgresoRutinas && (
                <p className="auth-error" role="alert">{errorProgresoRutinas}</p>
              )}
              {!rutinaSemanalDeHoy && (
                <p className="rest-day-message">
                  Hoy, {nombreDia}, no tenés entrenamiento asignado.
                </p>
              )}
              {[...rutinasSemanales]
                .sort((a, b) => {
                  if (a.id === rutinaSemanalDeHoy?.id) return -1
                  if (b.id === rutinaSemanalDeHoy?.id) return 1
                  return a.dia - b.dia
                })
                .map((rutina) => {
                  const ejerciciosRutina = ejercicios.filter(
                    (ejercicio) => ejercicio.rutinaId === rutina.id
                  ).sort((a, b) => (a.orden ?? a.id) - (b.orden ?? b.id))
                  const completadosRutina = ejerciciosRutina.filter(
                    (ejercicio) => ejercicio.completado
                  ).length
                  const esRutinaCompletada = ejerciciosRutina.length > 0 &&
                    completadosRutina === ejerciciosRutina.length
                  const esRutinaDeHoy = rutina.id === rutinaSemanalDeHoy?.id
                  const diaRutina = diasDeLaSemana[rutina.dia]

                  return (
                    <details
                      className={`routine-accordion ${esRutinaDeHoy ? 'is-today' : ''}`}
                      key={rutina.id}
                    >
                      <summary className="routine-summary">
                        <span className="routine-summary-copy">
                          <span className="eyebrow">
                            {esRutinaDeHoy ? 'HOY' : diaRutina.toUpperCase()}
                          </span>
                          <strong>{rutina.nombre}</strong>
                          <span className="routine-summary-meta">
                            {ejerciciosRutina.length} ejercicios · {completadosRutina}/{ejerciciosRutina.length} completados
                          </span>
                          {esRutinaCompletada && (
                            <span className="routine-completed-badge">Rutina completada</span>
                          )}
                        </span>
                        <span className="routine-chevron" aria-hidden="true">+</span>
                      </summary>

                      <div className="routine-accordion-content">
                        <div className="progress-section">
                          <div className="progress-labels">
                            <span>PROGRESO DE LA RUTINA</span>
                            <strong>{completadosRutina}/{ejerciciosRutina.length}</strong>
                          </div>
                          <div
                            className="progress-track"
                            role="progressbar"
                            aria-label={`Progreso de ${rutina.nombre}`}
                            aria-valuenow={completadosRutina}
                            aria-valuemin={0}
                            aria-valuemax={ejerciciosRutina.length}
                          >
                            <div
                              className="progress-fill"
                              style={{ width: `${(completadosRutina / ejerciciosRutina.length) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="exercise-list">
                          {ejerciciosRutina.map((ejercicio, indiceEjercicio) => (
                            <article
                              className={`exercise-row ${ejercicio.completado ? 'is-completed' : ''}`}
                              key={ejercicio.id}
                            >
                              <button
                                className="exercise-main"
                                onClick={() => setEjercicioSeleccionado(ejercicio)}
                              >
                                <span className="exercise-number">
                                  {String(indiceEjercicio + 1).padStart(2, '0')}
                                </span>
                                <span className="exercise-info">
                                  <span className="exercise-group">{ejercicio.grupo}</span>
                                  <strong>{ejercicio.nombre}</strong>
                                  <span className="exercise-meta">
                                    {ejercicio.series} series × {ejercicio.repeticiones} reps · descanso {ejercicio.descanso}
                                  </span>
                                </span>
                                <span className="exercise-arrow">↗</span>
                              </button>

                              <button
                                className={`check-button ${ejercicio.completado ? 'checked' : ''}`}
                                disabled={estadoProgresoRutinas !== 'ready' || guardandoProgresoRutinas}
                                aria-label={ejercicio.completado
                                  ? `Desmarcar ${ejercicio.nombre}`
                                  : `Completar ${ejercicio.nombre}`}
                                onClick={() => alternarCompletado(ejercicio.id)}
                              >
                                {ejercicio.completado ? '✓' : ''}
                              </button>
                            </article>
                          ))}
                        </div>
                      </div>
                    </details>
                  )
                })}
            </div>

            <div ref={indiceMuscularRef} style={{ display: 'contents' }}>
              <BodyMap
                zonaSeleccionada={zonaSeleccionada}
                vista={vistaMapa}
                onSeleccionarZona={setZonaSeleccionada}
                onVerEjercicios={mostrarEjerciciosMusculares}
                onCambiarVista={(nuevaVista) => {
                  setVistaMapa(nuevaVista)
                  setZonaSeleccionada(null)
                }}
              />

              {zonaSeleccionada && (
              <details
                className="muscle-exercise-results"
                key={zonaSeleccionada}
                ref={ejerciciosMuscularesRef}
              >
                <summary className="muscle-index-summary">
                  <span className="muscle-index-title">
                    <strong>{zonasMusculares[zonaSeleccionada].nombre}</strong>
                  </span>
                  <span className="muscle-index-action" aria-hidden="true">
                    <span className="muscle-index-closed">+</span>
                    <span className="muscle-index-open">−</span>
                  </span>
                </summary>
                <div className="muscle-index-content" aria-live="polite">
                {gruposCatalogo.length > 0 ? (
                  <div className="muscle-catalog-groups">
                    {gruposCatalogo.map((grupo) => (
                      <section className="muscle-catalog-group" key={grupo.nombre}>
                        {gruposCatalogo.length > 1 && <h3>{grupo.nombre}</h3>}
                        <ul className="muscle-exercise-list">
                          {grupo.ejercicios.map((ejercicioCatalogo) => {
                            const ejercicioAsignado = ejercicios.find(
                              (ejercicio) => ejercicio.catalogoId === ejercicioCatalogo.id
                            )
                            const rutinaAsignada = rutinasSemanales.find(
                              (rutina) => rutina.id === ejercicioAsignado?.rutinaId
                            )

                            return (
                              <li className="muscle-exercise-item" key={ejercicioCatalogo.id}>
                                <div className="muscle-exercise-link">
                                  <span className="muscle-exercise-name">
                                    <strong>{ejercicioCatalogo.nombre}</strong>
                                  </span>
                                  <button
                                    type="button"
                                    className="catalog-detail-button"
                                    onClick={() => abrirDetalleCatalogo(ejercicioCatalogo)}
                                  >
                                    Ver detalles
                                  </button>
                                  <span className={`muscle-routine-label ${ejercicioAsignado ? 'is-assigned' : ''}`}>
                                    {ejercicioAsignado
                                      ? `En tu rutina · ${rutinaAsignada?.nombre ?? ''}`
                                      : 'Alternativa del catálogo'}
                                    {ejercicioAsignado?.completado ? ' · Completado' : ''}
                                  </span>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      </section>
                    ))}
                  </div>
                ) : (
                  <p className="muscle-empty-state">
                    Todavía no hay ejercicios de esta zona en el catálogo.
                  </p>
                )}
                </div>
              </details>
              )}
            </div>
          </section>
        ) : (
          <>
            <section className="welcome">
              <div>
                <h1>Vamos a <span>entrenar.</span></h1>
              </div>

              <div className="date-stamp">
                <span>SESIÓN</span>
                <strong>01</strong>
              </div>
            </section>

            <section className="routine-card">
              <div className="routine-heading">
                <div>
                  <p className="eyebrow lime-text">
                    HOY ES {nombreDia.toUpperCase()} DE
                  </p>
                  <h2>{rutinaDeHoy.nombre}</h2>
                  <p className="routine-description">
                    Fuerza · {ejercicios.length} ejercicios
                  </p>
                </div>
              </div>

              <button
                className="start-button"
                onClick={() => {
                  setEntrenamientoIniciado(true)
                  setPagina('rutina')
                  setEjercicioSeleccionado(null)
                }}
              >
                Comenzar entrenamiento <span>↗</span>
              </button>
            </section>

            <ChallengesSection
              key={estadoAcceso.usuario.uid}
              uid={estadoAcceso.usuario.uid}
            />

            <section className="home-section tips-section">
              <div className="section-heading">
                <div>
                  <h2>Consejos para progresar</h2>
                </div>
              </div>

              <div className="tips-filters" aria-label="Filtrar consejos">
                <button
                  type="button"
                  className={categoriaActiva === 'Todos' ? 'active' : ''}
                  onClick={() => setCategoriaActiva('Todos')}
                >
                  Todos
                </button>
                <button
                  type="button"
                  className={categoriaActiva === 'Entrenamiento' ? 'active' : ''}
                  onClick={() => setCategoriaActiva('Entrenamiento')}
                >
                  Entrenamiento
                </button>
                <button
                  type="button"
                  className={categoriaActiva === 'Recuperación' ? 'active' : ''}
                  onClick={() => setCategoriaActiva('Recuperación')}
                >
                  Recuperación
                </button>
                <button
                  type="button"
                  className={categoriaActiva === 'Alimentación' ? 'active' : ''}
                  onClick={() => setCategoriaActiva('Alimentación')}
                >
                  Alimentación
                </button>
              </div>

              <div className="tips-list">
                {consejos
                  .filter((consejo) =>
                    categoriaActiva === 'Todos' ||
                    consejo.categoria === categoriaActiva
                  )
                  .map((consejo, index) => (
                    <details className="tip-item" key={consejo.id}>
                      <svg
                        className="tip-outline"
                        aria-hidden="true"
                        focusable="false"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <path d="M0 0 H100 V100 H0 Z" />
                      </svg>
                      <summary>
                        <span className="tip-number">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="tip-title-group">
                          <strong>{consejo.titulo}</strong>
                        </span>
                        <span className="tip-toggle" aria-hidden="true" />
                      </summary>
                      <div className="tip-content">
                        <p>{consejo.texto}</p>
                        <p className="tip-action">
                          {consejo.aplicacion}
                        </p>
                      </div>
                    </details>
                  ))}
              </div>

            </section>

            <section className="home-section">
              <div className="section-heading">
                <div>
                  <h2>Tu cuota</h2>
                </div>
              </div>

              <div className="home-info-card">
                <p className="eyebrow">TU PRÓXIMO PAGO</p>
                <h3>15 de noviembre</h3>
                <p>Pagá tu cuota de manera presencial</p>
              </div>
            </section>

          </>
        )}
      </div>


      <footer className="footer">
        <div className="footer-brand">
          <strong>VELES NORTE GYM</strong>
          <span>ENTRENÁ A TU RITMO.</span>
        </div>
        <div className="footer-contact-group">
          <address>
            Barrio Floresta<br />
            Av. Carrasco 121<br />
            C1407 CABA
          </address>
        </div>
        <div className="footer-contact-group">
          <span className="footer-label">CONTACTO</span>
          <a href="tel:+541168564264">011 6856-4264</a>
        </div>
        <a
          className="footer-instagram"
          href="https://www.instagram.com/velezsarsfieldnorte/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram de Vélez Sarsfield Norte (abre en una pestaña nueva)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle className="instagram-dot" cx="17.5" cy="6.8" r="1" />
          </svg>
        </a>
      </footer>

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
