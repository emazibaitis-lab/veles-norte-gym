import { obtenerInstruccionesEnEspanol } from '../data/contenidoEjerciciosEs.js'

function ExerciseDetailPage({
  ejercicioCatalogo,
  estadoDetalleCatalogo,
  ejercicioRutina,
  estadoProgresoRutinas,
  guardandoProgresoRutinas,
  errorProgresoRutinas,
  onVolverAlCatalogo,
  onVolverARutina,
  onAlternarCompletado,
}) {
  if (ejercicioCatalogo) {
    return (
      <section className="exercise-detail">
        <button type="button" className="back-button" aria-label="Volver al catálogo de ejercicios" onClick={onVolverAlCatalogo}>
          <span aria-hidden="true">←</span>
        </button>
        <p className="eyebrow">EXPLORADOR DE EJERCICIOS</p>
        <h1>{ejercicioCatalogo.nombre}</h1>
        <p className="detail-intro">Información de referencia de ExerciseDB. No forma parte de tu rutina.</p>

        <div className="detail-card catalog-api-card" aria-live="polite">
          {estadoDetalleCatalogo === 'loaded' && ejercicioCatalogo && (
            <>
          <div className="catalog-api-match">
            <span>{ejercicioCatalogo.exerciseDbName ? 'NOMBRE ORIGINAL EN EXERCISEDB' : 'GRUPO MUSCULAR'}</span>
            <strong>{ejercicioCatalogo.exerciseDbName || ejercicioCatalogo.grupos.map(({ subgrupo }) => subgrupo).join(', ')}</strong>
          </div>
          {ejercicioCatalogo.exerciseDbGifUrl ? (
            <img
              className="catalog-api-gif"
              src={ejercicioCatalogo.exerciseDbGifUrl}
              alt={`Demostración animada: ${ejercicioCatalogo.nombre}`}
              loading="lazy"
              onError={(event) => { event.currentTarget.hidden = true }}
            />
          ) : (
            <p className="detail-note">Todavía no hay una demostración animada verificada para este ejercicio.</p>
          )}

          <div className="catalog-api-metadata">
            <div>
              <span>GRUPO MUSCULAR</span>
              <strong>{ejercicioCatalogo.grupos.map(({ subgrupo }) => subgrupo).filter((grupo, index, grupos) => grupos.indexOf(grupo) === index).join(', ')}</strong>
            </div>
          </div>

          <h2>Indicaciones en español</h2>
          <ol className="catalog-api-instructions">
            {obtenerInstruccionesEnEspanol(ejercicioCatalogo).map((indicacion, indice) => (
              <li key={`${indice}-${indicacion}`}>{indicacion}</li>
            ))}
          </ol>
          {ejercicioCatalogo.exerciseDbGifUrl && (
            <p className="detail-note catalog-api-credit">
              Demostración animada: <a href="https://exercisedb.dev/" target="_blank" rel="noreferrer">ExerciseDB / AscendAPI</a>.
            </p>
          )}
            </>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="exercise-detail">
      <button type="button" className="back-button" aria-label="Volver a mi rutina" onClick={onVolverARutina}>
        <span aria-hidden="true">←</span>
      </button>
      <p className="eyebrow">{ejercicioRutina.grupo}</p>
      <h1>{ejercicioRutina.nombre}</h1>
      <p className="detail-intro">Consultá los datos de tu ejercicio antes de empezar.</p>

      <div className="detail-card">
        <div className="exercise-illustration">
          <span>VN</span>
          <span className="illustration-number">{String(ejercicioRutina.id).padStart(2, '0')}</span>
        </div>

        <div className="detail-stats">
          <div><span>SERIES</span><strong>{ejercicioRutina.series}</strong></div>
          <div><span>REPETICIONES</span><strong>{ejercicioRutina.repeticiones}</strong></div>
          <div><span>DESCANSO</span><strong>{ejercicioRutina.descanso}</strong></div>
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
          className={ejercicioRutina.completado ? 'complete-button completed' : 'complete-button'}
          disabled={estadoProgresoRutinas !== 'ready' || guardandoProgresoRutinas}
          onClick={() => onAlternarCompletado(ejercicioRutina.id)}
        >
          {guardandoProgresoRutinas
            ? 'Guardando progreso…'
            : ejercicioRutina.completado
              ? '✓ Ejercicio completado'
              : 'Marcar ejercicio como realizado'}
        </button>
        {errorProgresoRutinas && <p className="auth-error" role="alert">{errorProgresoRutinas}</p>}
      </div>
    </section>
  )
}

export default ExerciseDetailPage
