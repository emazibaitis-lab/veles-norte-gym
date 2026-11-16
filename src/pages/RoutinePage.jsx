import { useEffect, useRef } from 'react'
import BodyMap from '../components/BodyMap.jsx'
import { zonasMusculares } from '../components/zonasMusculares.js'
import { catalogoEjercicios } from '../data/catalogoEjercicios.js'
import { diasDeLaSemana, rutinasSemanales } from '../data/rutinas.js'

function RoutinePage({
  nombreDia,
  rutinaSemanalDeHoy,
  onVolverInicio,
  ejercicios,
  estadoProgresoRutinas,
  errorProgresoRutinas,
  guardandoProgresoRutinas,
  onReintentarCarga,
  onAlternarCompletado,
  onAbrirDetalleCatalogo,
  zonaSeleccionada,
  setZonaSeleccionada,
  vistaMapa,
  setVistaMapa,
}) {
  const indiceMuscularRef = useRef(null)
  const ejerciciosMuscularesRef = useRef(null)

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
    if (!zonaSeleccionada) return

    function deseleccionarAlTocarAfuera(evento) {
      if (!indiceMuscularRef.current?.contains(evento.target)) {
        setZonaSeleccionada(null)
      }
    }

    document.addEventListener('pointerdown', deseleccionarAlTocarAfuera)
    return () => document.removeEventListener('pointerdown', deseleccionarAlTocarAfuera)
  }, [zonaSeleccionada, setZonaSeleccionada])

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

  return (
    <section className="exercise-section">
      <button
        type="button"
        className="back-button"
        aria-label="Volver al inicio"
        onClick={onVolverInicio}
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
            <button type="button" onClick={onReintentarCarga}>Reintentar</button>
          </div>
        )}
        {estadoProgresoRutinas === 'ready' && guardandoProgresoRutinas && (
          <p className="auth-status" role="status">Guardando progreso…</p>
        )}
        {estadoProgresoRutinas === 'ready' && errorProgresoRutinas && (
          <p className="auth-error" role="alert">{errorProgresoRutinas}</p>
        )}
        {!rutinaSemanalDeHoy && (
          <p className="rest-day-message">Hoy, {nombreDia}, no tenés entrenamiento asignado.</p>
        )}
        {[...rutinasSemanales]
          .sort((a, b) => {
            if (a.id === rutinaSemanalDeHoy?.id) return -1
            if (b.id === rutinaSemanalDeHoy?.id) return 1
            return a.dia - b.dia
          })
          .map((rutina) => {
            const ejerciciosRutina = ejercicios
              .filter((ejercicio) => ejercicio.rutinaId === rutina.id)
              .sort((a, b) => (a.orden ?? a.id) - (b.orden ?? b.id))
            const completadosRutina = ejerciciosRutina.filter((ejercicio) => ejercicio.completado).length
            const esRutinaCompletada = ejerciciosRutina.length > 0 && completadosRutina === ejerciciosRutina.length
            const esRutinaDeHoy = rutina.id === rutinaSemanalDeHoy?.id
            const diaRutina = diasDeLaSemana[rutina.dia]

            return (
              <details className={`routine-accordion ${esRutinaDeHoy ? 'is-today' : ''}`} key={rutina.id}>
                <summary className="routine-summary">
                  <span className="routine-summary-copy">
                    <span className="eyebrow">{esRutinaDeHoy ? 'HOY' : diaRutina.toUpperCase()}</span>
                    <strong>{rutina.nombre}</strong>
                    <span className="routine-summary-meta">
                      {ejerciciosRutina.length} ejercicios · {completadosRutina}/{ejerciciosRutina.length} completados
                    </span>
                    {esRutinaCompletada && <span className="routine-completed-badge">Rutina completada</span>}
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
                      <div className="progress-fill" style={{ width: `${(completadosRutina / ejerciciosRutina.length) * 100}%` }} />
                    </div>
                  </div>

                  <div className="exercise-list">
                    {ejerciciosRutina.map((ejercicio, indiceEjercicio) => (
                      <article className={`exercise-row ${ejercicio.completado ? 'is-completed' : ''}`} key={ejercicio.id}>
                        <div className="exercise-main">
                          <span className="exercise-number">{String(indiceEjercicio + 1).padStart(2, '0')}</span>
                          <span className="exercise-info">
                            <span className="exercise-group">{ejercicio.grupo}</span>
                            <strong>{ejercicio.nombre}</strong>
                            <span className="exercise-meta">
                              {ejercicio.series} series × {ejercicio.repeticiones} reps · descanso {ejercicio.descanso}
                            </span>
                          </span>
                        </div>
                        <button
                          className={`check-button ${ejercicio.completado ? 'checked' : ''}`}
                          disabled={estadoProgresoRutinas !== 'ready' || guardandoProgresoRutinas}
                          aria-label={ejercicio.completado ? `Desmarcar ${ejercicio.nombre}` : `Completar ${ejercicio.nombre}`}
                          onClick={() => onAlternarCompletado(ejercicio.id)}
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
          <details className="muscle-exercise-results" key={zonaSeleccionada} ref={ejerciciosMuscularesRef}>
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
                          const ejercicioAsignado = ejercicios.find((ejercicio) => ejercicio.catalogoId === ejercicioCatalogo.id)
                          const rutinaAsignada = rutinasSemanales.find((rutina) => rutina.id === ejercicioAsignado?.rutinaId)

                          return (
                            <li className="muscle-exercise-item" key={ejercicioCatalogo.id}>
                              <div className="muscle-exercise-link">
                                <span className="muscle-exercise-name"><strong>{ejercicioCatalogo.nombre}</strong></span>
                                <button type="button" className="catalog-detail-button" onClick={() => onAbrirDetalleCatalogo(ejercicioCatalogo)}>
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
                <p className="muscle-empty-state">Todavía no hay ejercicios de esta zona en el catálogo.</p>
              )}
            </div>
          </details>
        )}
      </div>
    </section>
  )
}

export default RoutinePage
