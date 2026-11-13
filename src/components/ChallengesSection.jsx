import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { desafios } from '../data/desafios.js'
import { db } from '../firebase.js'

function leerParticipacionesLocales(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave) || '{}')
  } catch {
    return {}
  }
}

function crearDatosAvance() {
  const fecha = new Date()
  return {
    id: globalThis.crypto?.randomUUID?.() || String(fecha.getTime()),
    fecha: fecha.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  }
}

function ChallengesSection({ uid }) {
  const claveGuardado = `veles-norte-gym:desafios:${uid}`
  const carruselRef = useRef(null)
  const [participaciones, setParticipaciones] = useState({})
  const [cargando, setCargando] = useState(true)
  const [reintentoCarga, setReintentoCarga] = useState(0)
  const [desafioEditando, setDesafioEditando] = useState(null)
  const [notaProgreso, setNotaProgreso] = useState('')
  const [errorGuardado, setErrorGuardado] = useState('')
  const [errorEsDeCarga, setErrorEsDeCarga] = useState(false)
  const [mensajeEstado, setMensajeEstado] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [hayAnterior, setHayAnterior] = useState(false)
  const [haySiguiente, setHaySiguiente] = useState(true)

  useEffect(() => {
    let cancelado = false

    async function cargarParticipaciones() {
      setCargando(true)
      setErrorGuardado('')
      setErrorEsDeCarga(false)
      setMensajeEstado(null)

      try {
        const referenciaColeccion = collection(db, 'socios', uid, 'desafios')
        let documentos = await getDocs(referenciaColeccion)
        const idsGuardados = new Set(documentos.docs.map((documento) => documento.id))
        const participacionesLocales = leerParticipacionesLocales(claveGuardado)
        const migraciones = Object.entries(participacionesLocales)
          .filter(([desafioId, datos]) =>
            desafios.some((desafio) => desafio.id === desafioId) &&
            !idsGuardados.has(desafioId) &&
            datos && typeof datos === 'object'
          )
          .map(([desafioId, datos]) =>
            setDoc(doc(db, 'socios', uid, 'desafios', desafioId), {
              desafioId,
              inscriptoEn: datos.inscriptoEn || serverTimestamp(),
              avances: Array.isArray(datos.avances) ? datos.avances : [],
              actualizadoEn: serverTimestamp(),
            })
          )

        if (migraciones.length > 0) {
          await Promise.all(migraciones)
          documentos = await getDocs(referenciaColeccion)
        }

        try {
          // Una vez contrastados los datos con Firestore, la copia antigua ya no debe reimportarse.
          localStorage.removeItem(claveGuardado)
        } catch {
          // La carga de Firestore sigue funcionando si el navegador bloquea el almacenamiento local.
        }

        if (cancelado) return

        setParticipaciones(Object.fromEntries(
          documentos.docs.map((documento) => {
            const datos = documento.data()
            return [documento.id, {
              ...datos,
              avances: Array.isArray(datos.avances) ? datos.avances : [],
            }]
          })
        ))
      } catch (error) {
        if (cancelado) return

        setErrorEsDeCarga(true)
        setErrorGuardado(
          error.code === 'permission-denied'
            ? 'Firestore no permite consultar o guardar tus desafíos. Revisá las reglas de acceso.'
            : 'No pudimos cargar tus desafíos. Revisá tu conexión e intentá de nuevo.'
        )
      } finally {
        if (!cancelado) setCargando(false)
      }
    }

    cargarParticipaciones()

    return () => {
      cancelado = true
    }
  }, [uid, claveGuardado, reintentoCarga])

  useEffect(() => {
    if (!mensajeEstado) return

    const temporizador = window.setTimeout(() => setMensajeEstado(null), 3500)
    return () => window.clearTimeout(temporizador)
  }, [mensajeEstado])

  function limpiarMensajes() {
    setErrorGuardado('')
    setErrorEsDeCarga(false)
    setMensajeEstado(null)
  }

  async function sumarse(desafioId) {
    if (guardando || cargando || participaciones[desafioId]) return

    setGuardando(true)
    limpiarMensajes()
    try {
      const participacion = {
        desafioId,
        inscriptoEn: serverTimestamp(),
        avances: [],
        actualizadoEn: serverTimestamp(),
      }
      await setDoc(doc(db, 'socios', uid, 'desafios', desafioId), participacion)
      setParticipaciones((actuales) => ({ ...actuales, [desafioId]: participacion }))
      setMensajeEstado({ tipo: 'agregado', id: Date.now() })
    } catch (error) {
      setErrorGuardado(
        error.code === 'permission-denied'
          ? 'Firestore no permite guardar el desafío. Revisá las reglas de acceso.'
          : 'No pudimos guardar tu participación. Revisá tu conexión e intentá de nuevo.'
      )
    } finally {
      setGuardando(false)
    }
  }

  useEffect(() => {
    const carrusel = carruselRef.current
    if (!carrusel) return

    function actualizarControles() {
      setHayAnterior(carrusel.scrollLeft > 1)
      setHaySiguiente(carrusel.scrollLeft + carrusel.clientWidth < carrusel.scrollWidth - 1)
    }

    carrusel.addEventListener('scroll', actualizarControles, { passive: true })
    window.addEventListener('resize', actualizarControles)
    const frameInicial = window.requestAnimationFrame(actualizarControles)

    return () => {
      carrusel.removeEventListener('scroll', actualizarControles)
      window.removeEventListener('resize', actualizarControles)
      window.cancelAnimationFrame(frameInicial)
    }
  }, [])

  const misDesafios = desafios.filter((desafio) => participaciones[desafio.id])

  function moverCarrusel(direccion) {
    const carrusel = carruselRef.current
    const primeraTarjeta = carrusel?.firstElementChild
    if (!carrusel || !primeraTarjeta) return

    carrusel.scrollBy({
      left: direccion * (primeraTarjeta.getBoundingClientRect().width + 16),
      behavior: 'smooth',
    })
  }

  async function eliminarDesafio(desafioId) {
    if (guardando) return

    setGuardando(true)
    limpiarMensajes()
    try {
      await deleteDoc(doc(db, 'socios', uid, 'desafios', desafioId))
      setParticipaciones((actuales) => {
        const nuevas = { ...actuales }
        delete nuevas[desafioId]
        return nuevas
      })
      setMensajeEstado({ tipo: 'eliminado', id: Date.now() })

      if (desafioEditando === desafioId) {
        setDesafioEditando(null)
        setNotaProgreso('')
      }
    } catch (error) {
      setErrorGuardado(
        error.code === 'permission-denied'
          ? 'Firestore no permite eliminar el desafío. Revisá las reglas de acceso.'
          : 'No pudimos eliminar el desafío. Revisá tu conexión e intentá de nuevo.'
      )
    } finally {
      setGuardando(false)
    }
  }

  function alternarEditor(desafioId) {
    setDesafioEditando((actual) => actual === desafioId ? null : desafioId)
    setNotaProgreso('')
  }

  async function guardarProgreso(evento, desafioId) {
    evento.preventDefault()
    const nota = notaProgreso.trim()
    if (!nota || guardando) return

    const datosAvance = crearDatosAvance()
    const nuevoAvance = { ...datosAvance, nota }
    setGuardando(true)
    limpiarMensajes()

    try {
      await updateDoc(doc(db, 'socios', uid, 'desafios', desafioId), {
        avances: arrayUnion(nuevoAvance),
        actualizadoEn: serverTimestamp(),
      })
      setParticipaciones((actuales) => ({
        ...actuales,
        [desafioId]: {
          ...actuales[desafioId],
          avances: [...(actuales[desafioId]?.avances || []), nuevoAvance],
        },
      }))
      setNotaProgreso('')
      setDesafioEditando(null)
      setMensajeEstado({ tipo: 'avance', id: Date.now() })
    } catch (error) {
      setErrorGuardado(
        error.code === 'permission-denied'
          ? 'Firestore no permite actualizar el desafío. Revisá las reglas de acceso.'
          : 'No pudimos guardar tu avance. Revisá tu conexión e intentá de nuevo.'
      )
    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className="home-section challenges-section" aria-labelledby="challenges-title">
      <div className="section-heading challenges-heading">
        <div>
          <h2 id="challenges-title">Desafíos</h2>
        </div>
        <div className="challenge-carousel-controls" aria-label="Controles del carrusel">
          <button
            type="button"
            aria-label="Ver desafíos anteriores"
            onClick={() => moverCarrusel(-1)}
            disabled={!hayAnterior}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Ver más desafíos"
            onClick={() => moverCarrusel(1)}
            disabled={!haySiguiente}
          >
            →
          </button>
        </div>
      </div>

      <div className="challenge-carousel" ref={carruselRef} aria-label="Catálogo de desafíos">
        {desafios.map((desafio) => {
          const yaInscripto = Boolean(participaciones[desafio.id])

          return (
            <article className="challenge-card" key={desafio.id}>
              <div>
                <div className="challenge-card-meta">
                  <span>{desafio.numero}</span>
                  <span className="eyebrow">{desafio.categoria}</span>
                </div>
                <h3>{desafio.titulo}</h3>
                <p>{desafio.descripcion}</p>
              </div>
              <button
                type="button"
                className="challenge-join-button"
                onClick={() => sumarse(desafio.id)}
                disabled={yaInscripto || cargando || guardando}
              >
                {yaInscripto
                  ? 'Ya estás participando'
                  : guardando
                    ? 'Guardando…'
                    : 'Sumarme'}
              </button>
            </article>
          )
        })}
      </div>
      <div className="my-challenges" aria-labelledby="my-challenges-title">
        <div className="my-challenges-heading">
          <div>
            <h3 id="my-challenges-title">Mis desafíos</h3>
          </div>
          {misDesafios.length > 0 && (
            <span>{misDesafios.length} en curso</span>
          )}
        </div>

        {cargando && (
          <p className="auth-status" role="status">Cargando tus desafíos…</p>
        )}
        {errorGuardado && (
          <div>
            <p className="challenge-storage-error" role="alert">{errorGuardado}</p>
            {!cargando && errorEsDeCarga && (
              <button
                type="button"
                onClick={() => setReintentoCarga((actual) => actual + 1)}
              >
                Reintentar
              </button>
            )}
          </div>
        )}
        {!cargando && !errorGuardado && (
          misDesafios.length === 0 ? (
            <p className="my-challenges-empty">
              Todavía no sumaste ningún desafío.
            </p>
          ) : (
            <div className="my-challenges-list">
              {misDesafios.map((desafio) => {
              const participacion = participaciones[desafio.id]
              const avances = participacion.avances || []

              return (
                <article className="my-challenge-card" key={desafio.id}>
                  <div className="my-challenge-copy">
                    <div className="my-challenge-topline">
                      <p className="eyebrow">{desafio.categoria} · DESAFÍO {desafio.numero}</p>
                      <button
                        type="button"
                        className="challenge-remove-button"
                        aria-label={`Eliminar desafío ${desafio.titulo}`}
                        onClick={() => eliminarDesafio(desafio.id)}
                        disabled={guardando}
                      >
                        {guardando ? 'Guardando…' : 'Eliminar'}
                      </button>
                    </div>
                    <h4>{desafio.titulo}</h4>
                    <p>{desafio.descripcion}</p>
                  </div>

                  <div className="challenge-progress-area">
                    <div className="challenge-progress-heading">
                      <strong>Progreso registrado</strong>
                    </div>
                    {avances.length > 0 && (
                      <ul className="challenge-progress-list">
                        {[...avances].reverse().map((avance) => (
                          <li key={avance.id}>
                            <time>{avance.fecha}</time>
                            <p>{avance.nota}</p>
                          </li>
                        ))}
                      </ul>
                    )}

                    {desafioEditando === desafio.id ? (
                      <form className="challenge-progress-form" onSubmit={(evento) => guardarProgreso(evento, desafio.id)}>
                        <textarea
                          id={`progress-${desafio.id}`}
                          aria-label="Escribí tu avance"
                          value={notaProgreso}
                          onChange={(evento) => setNotaProgreso(evento.target.value)}
                          placeholder="Escribí tu progreso..."
                          rows="3"
                          required
                        />
                        <div>
                          <button type="submit" disabled={!notaProgreso.trim() || guardando}>
                            {guardando ? 'Guardando…' : 'Guardar avance'}
                          </button>
                          <button type="button" onClick={() => alternarEditor(desafio.id)} disabled={guardando}>
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        type="button"
                        className="challenge-progress-button"
                        onClick={() => alternarEditor(desafio.id)}
                        disabled={guardando}
                      >
                        + Anotar progreso
                      </button>
                    )}
                  </div>
                </article>
              )
              })}
            </div>
          )
        )}
      </div>

      {mensajeEstado && (
        createPortal(
          <div className="challenge-toast" role="status" aria-live="polite">
            {mensajeEstado.tipo === 'agregado' && (
              <>Se <strong>agregó</strong> el desafío a tu lista.</>
            )}
            {mensajeEstado.tipo === 'eliminado' && (
              <>Se <strong>eliminó</strong> el desafío de tu lista.</>
            )}
            {mensajeEstado.tipo === 'avance' && 'Tu avance quedó guardado.'}
          </div>,
          document.body
        )
      )}
    </section>
  )
}

export default ChallengesSection
