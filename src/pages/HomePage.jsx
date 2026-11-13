import { useState } from 'react'
import ChallengesSection from '../components/ChallengesSection.jsx'
import { consejos } from '../data/consejos.js'

function HomePage({ nombreDia, rutinaDeHoy, totalEjercicios, uid, onComenzarEntrenamiento }) {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')

  return (
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
            <p className="eyebrow lime-text">HOY ES {nombreDia.toUpperCase()} DE</p>
            <h2>{rutinaDeHoy.nombre}</h2>
            <p className="routine-description">Fuerza · {totalEjercicios} ejercicios</p>
          </div>
        </div>
        <button className="start-button" onClick={onComenzarEntrenamiento}>
          Comenzar entrenamiento <span>↗</span>
        </button>
      </section>

      <ChallengesSection key={uid} uid={uid} />

      <section className="home-section tips-section">
        <div className="section-heading">
          <div>
            <h2>Consejos para progresar</h2>
          </div>
        </div>

        <div className="tips-filters" aria-label="Filtrar consejos">
          {['Todos', 'Entrenamiento', 'Recuperación', 'Alimentación'].map((categoria) => (
            <button
              key={categoria}
              type="button"
              className={categoriaActiva === categoria ? 'active' : ''}
              onClick={() => setCategoriaActiva(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>

        <div className="tips-list">
          {consejos
            .filter((consejo) =>
              categoriaActiva === 'Todos' || consejo.categoria === categoriaActiva
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
                  <span className="tip-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="tip-title-group">
                    <strong>{consejo.titulo}</strong>
                  </span>
                  <span className="tip-toggle" aria-hidden="true" />
                </summary>
                <div className="tip-content">
                  <p>{consejo.texto}</p>
                  <p className="tip-action">{consejo.aplicacion}</p>
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
  )
}

export default HomePage
