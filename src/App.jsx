
import { useState } from 'react'
import './App.css'
import isotipo from './assets/isotipo.svg';

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

const ejerciciosIniciales = [
  {
    id: 1,
    nombre: 'Press de banca',
    grupo: 'PECHO',
    series: 3,
    repeticiones: 10,
    descanso: '90 s',
  },
  {
    id: 2,
    nombre: 'Jalón al pecho',
    grupo: 'ESPALDA',
    series: 3,
    repeticiones: 12,
    descanso: '75 s',
  },
  {
    id: 3,
    nombre: 'Press de hombros',
    grupo: 'HOMBROS',
    series: 3,
    repeticiones: 10,
    descanso: '75 s',
  },
  {
    id: 4,
    nombre: 'Curl de bíceps',
    grupo: 'BÍCEPS',
    series: 3,
    repeticiones: 12,
    descanso: '60 s',
  },
  {
    id: 5,
    nombre: 'Extensión de tríceps',
    grupo: 'TRÍCEPS',
    series: 3,
    repeticiones: 12,
    descanso: '60 s',
  },
  {
    id: 6,
    nombre: 'Elevaciones laterales',
    grupo: 'HOMBROS',
    series: 3,
    repeticiones: 15,
    descanso: '60 s',
  },
]

function App() {
  const [ejercicios, setEjercicios] = useState(ejerciciosIniciales)
  const hoy = new Date()
  const numeroDia = hoy.getDay()
  const nombreDia = diasDeLaSemana[numeroDia]
  const rutinaDeHoy = rutinasPorDia[numeroDia]
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(null)
  const [entrenamientoIniciado, setEntrenamientoIniciado] = useState(false)
  const [pagina, setPagina] = useState('inicio')
  const completados = ejercicios.filter(
    (ejercicio) => ejercicio.completado
  ).length

  const progreso = (completados / ejercicios.length) * 100

  function alternarCompletado(id) {
    setEjercicios((actuales) =>
      actuales.map((ejercicio) =>
        ejercicio.id === id
          ? { ...ejercicio, completado: !ejercicio.completado }
          : ejercicio
      )
    )
  }

  return (
    <main className="app">
      <header className="topbar">
        <a
          className="brand"
          href="#inicio"
          onClick={() => {
            setEjercicioSeleccionado(null)
            setEntrenamientoIniciado(false)
          }}
        >
          <img
            src={isotipo}
            alt="Veles Norte Gym"
            className="brand-icon"
          />
        
        </a>

        <nav className="navigation" aria-label="Navegación principal">
          <a
            href="#inicio"
            className={pagina === 'inicio' ? 'active' : ''}
            onClick={(event) => {
              event.preventDefault()
              setPagina('inicio')
              setEjercicioSeleccionado(null)
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
            }}
          >
            Mi rutina
          </a>
        </nav>

        <div className="profile">
          <span className="profile-dot" />
          <span>MI ESPACIO</span>
        </div>
      </header>


      <div className="page-content" id="inicio">
        {ejercicioSeleccionado ? (
          <section className="exercise-detail">
            <button
              className="back-button"
              onClick={() => setEjercicioSeleccionado(null)}
            >
              ← Volver a mi rutina
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
                onClick={() => alternarCompletado(ejercicioSeleccionado.id)}
              >
                {ejercicioSeleccionado.completado
                  ? '✓ Ejercicio completado'
                  : 'Marcar ejercicio como realizado'}
              </button>
            </div>
          </section>
        ) : pagina === 'rutina' ? (
          <section className="exercise-section">
            <button className="back-button" onClick={() => setPagina('inicio')}>
              ← Volver al inicio
            </button>

            <p className="eyebrow">
              HOY ES {nombreDia.toUpperCase()} DE
            </p>
            <h1>{rutinaDeHoy.nombre}</h1>
            <p className="detail-intro">
              {ejercicios.length} ejercicios · Marcá cada ejercicio cuando lo termines.
            </p>

            <div className="progress-section">
              <div className="progress-labels">
                <span>PROGRESO DE LA SESIÓN</span>
                <strong>{completados}/{ejercicios.length}</strong>
              </div>
              <div
                className="progress-track"
                role="progressbar"
                aria-label="Progreso del entrenamiento"
                aria-valuenow={completados}
                aria-valuemin={0}
                aria-valuemax={ejercicios.length}
              >
                <div
                  className="progress-fill"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>

            <div className="exercise-list">
              {ejercicios.map((ejercicio) => (
                <article
                  className={`exercise-row ${ejercicio.completado ? 'is-completed' : ''
                    }`}
                  key={ejercicio.id}
                >
                  <button
                    className="exercise-main"
                    onClick={() => setEjercicioSeleccionado(ejercicio)}
                  >
                    <span className="exercise-number">
                      {String(ejercicio.id).padStart(2, '0')}
                    </span>
                    <span className="exercise-info">
                      <span className="exercise-group">{ejercicio.grupo}</span>
                      <strong>{ejercicio.nombre}</strong>
                      <span className="exercise-meta">
                        {ejercicio.series} series × {ejercicio.repeticiones} reps
                      </span>
                    </span>
                    <span className="exercise-arrow">↗</span>
                  </button>

                  <button
                    className={`check-button ${ejercicio.completado ? 'checked' : ''
                      }`}
                    aria-label={
                      ejercicio.completado
                        ? `Desmarcar ${ejercicio.nombre}`
                        : `Completar ${ejercicio.nombre}`
                    }
                    onClick={() => alternarCompletado(ejercicio.id)}
                  >
                    {ejercicio.completado ? '✓' : ''}
                  </button>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <>
            <section className="welcome">
              <div>
                <p className="eyebrow">TU ESPACIO · TU PROGRESO</p>
                <h1>Vamos a <span>entrenar.</span></h1>
              </div>

              <div className="date-stamp">
                <span>SESIÓN</span>
                <strong>01</strong>
                <span>ENTRENAMIENTO</span>
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

            <section className="home-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">MEMBRESÍA</p>
                  <h2>Tu cuota</h2>
                </div>
                <span>PRÓXIMO VENCIMIENTO</span>
              </div>

              <div className="home-info-card">
                <p className="eyebrow">TU PRÓXIMO PAGO</p>
                <h3>15 de noviembre</h3>
                <p>Revisá la fecha de vencimiento de tu cuota mensual.</p>
              </div>
            </section>

            <section className="home-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">UN CONSEJO PARA VOS</p>
                  <h2>Tips de entrenamiento</h2>
                </div>
                <span>01 / 01</span>
              </div>

              <article className="home-info-card tip-card">
                <p className="eyebrow">TÉCNICA · ENTRENAMIENTO</p>
                <h3>La técnica va primero.</h3>
                <p>
                  Priorizá un movimiento controlado antes de aumentar el peso.
                  La calidad de cada repetición importa.
                </p>
              </article>
            </section>
          </>
        )}
      </div>


      <footer className="footer">
        <span>VELES NORTE GYM</span>
        <span>ENTRENÁ A TU RITMO.</span>
      </footer>
    </main>
  )
}

export default App
