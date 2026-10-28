import { useEffect, useRef, useState } from 'react'
import { desafios } from '../data/desafios.js'

function leerParticipaciones(clave) {
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

function fechaActualISO() {
  return new Date().toISOString()
}

function ChallengesSection({ uid }) {
  const claveGuardado = `veles-norte-gym:desafios:${uid}`
  const carruselRef = useRef(null)
  const [participaciones, setParticipaciones] = useState(() =>
    leerParticipaciones(claveGuardado)
  )
  const [desafioEditando, setDesafioEditando] = useState(null)
  const [notaProgreso, setNotaProgreso] = useState('')
  const [errorGuardado, setErrorGuardado] = useState('')
  const [hayAnterior, setHayAnterior] = useState(false)
  const [haySiguiente, setHaySiguiente] = useState(true)

  function persistirParticipaciones(nuevasParticipaciones) {
    setParticipaciones(nuevasParticipaciones)

    try {
      localStorage.setItem(claveGuardado, JSON.stringify(nuevasParticipaciones))
      setErrorGuardado('')
    } catch {
      setErrorGuardado('El navegador no permitió guardar los desafíos en este dispositivo.')
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

  function sumarse(desafioId) {
    persistirParticipaciones({
      ...participaciones,
      [desafioId]: {
        inscriptoEn: fechaActualISO(),
        avances: [],
      },
    })
  }

  function eliminarDesafio(desafioId) {
    const nuevasParticipaciones = { ...participaciones }
    delete nuevasParticipaciones[desafioId]
    persistirParticipaciones(nuevasParticipaciones)

    if (desafioEditando === desafioId) {
      setDesafioEditando(null)
      setNotaProgreso('')
    }
  }

  function alternarEditor(desafioId) {
    setDesafioEditando((actual) => actual === desafioId ? null : desafioId)
    setNotaProgreso('')
  }

  function guardarProgreso(evento, desafioId) {
    evento.preventDefault()
    const nota = notaProgreso.trim()
    if (!nota) return

    const datosAvance = crearDatosAvance()
    persistirParticipaciones({
      ...participaciones,
      [desafioId]: {
        ...participaciones[desafioId],
        avances: [
          ...(participaciones[desafioId]?.avances || []),
          {
            ...datosAvance,
            nota,
          },
        ],
      },
    })
    setNotaProgreso('')
    setDesafioEditando(null)
  }

  return (
    <section className="home-section challenges-section" aria-labelledby="challenges-title">
      <div className="section-heading challenges-heading">
        <div>
          <p className="eyebrow">PONETE UNA META</p>
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
                disabled={yaInscripto}
              >
                {yaInscripto ? 'Ya estás participando' : 'Sumarme'}
              </button>
            </article>
          )
        })}
      </div>
      <p className="challenge-swipe-hint">Deslizá para explorar todos los desafíos.</p>

      <div className="my-challenges" aria-labelledby="my-challenges-title">
        <div className="my-challenges-heading">
          <div>
            <p className="eyebrow">TUS METAS</p>
            <h3 id="my-challenges-title">Mis desafíos</h3>
          </div>
          {misDesafios.length > 0 && (
            <span>{misDesafios.length} en curso</span>
          )}
        </div>

        {errorGuardado && <p className="challenge-storage-error" role="alert">{errorGuardado}</p>}

        {misDesafios.length === 0 ? (
          <p className="my-challenges-empty">
            Cuando te sumes a un desafío, aparecerá acá para que puedas registrar tus avances.
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
                      >
                        Eliminar
                      </button>
                    </div>
                    <h4>{desafio.titulo}</h4>
                    <p>{desafio.descripcion}</p>
                  </div>

                  <div className="challenge-progress-area">
                    <div className="challenge-progress-heading">
                      <strong>Progreso registrado</strong>
                      <span>{avances.length} {avances.length === 1 ? 'nota' : 'notas'}</span>
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
                        <label htmlFor={`progress-${desafio.id}`}>¿Qué avance querés anotar?</label>
                        <textarea
                          id={`progress-${desafio.id}`}
                          value={notaProgreso}
                          onChange={(evento) => setNotaProgreso(evento.target.value)}
                          placeholder="Escribí tu progreso..."
                          rows="3"
                          required
                        />
                        <div>
                          <button type="submit" disabled={!notaProgreso.trim()}>Guardar avance</button>
                          <button type="button" onClick={() => alternarEditor(desafio.id)}>Cancelar</button>
                        </div>
                      </form>
                    ) : (
                      <button
                        type="button"
                        className="challenge-progress-button"
                        onClick={() => alternarEditor(desafio.id)}
                      >
                        + Anotar progreso
                      </button>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default ChallengesSection
