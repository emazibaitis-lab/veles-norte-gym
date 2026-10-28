import { useLayoutEffect, useRef, useState } from 'react'
import { MUSCLE_MAP, MUSCLE_METADATA } from '@emmorts/body-muscles/data'
import { zonasMusculares } from './zonasMusculares.js'

const zonaPorGrupo = {
  Chest: 'pecho',
  Back: 'espalda',
  Shoulders: 'hombros',
  Arms: 'brazos',
  Abdominals: 'abdomen',
  Legs: 'piernas',
}

function obtenerZonaMuscular(region) {
  if (region.id.startsWith('gluteus-')) return 'gluteos'
  return zonaPorGrupo[MUSCLE_METADATA[region.id]?.group] ?? null
}

const regionesPorZona = Object.keys(zonasMusculares).reduce((zonas, zonaId) => {
  zonas[zonaId] = MUSCLE_MAP.filter((region) => obtenerZonaMuscular(region) === zonaId)
  return zonas
}, {})

const regionesDeContexto = MUSCLE_MAP.filter((region) => !obtenerZonaMuscular(region))

function BodyMap({ zonaSeleccionada, vista, onSeleccionarZona, onCambiarVista, onVerEjercicios }) {
  const mapaSvgRef = useRef(null)
  const regionSeleccionadaRef = useRef(null)
  const [puntoAnotacion, setPuntoAnotacion] = useState(null)

  useLayoutEffect(() => {
    const svg = mapaSvgRef.current
    if (!svg) return

    const destino = {
      x: vista === 'FRONT' ? 0 : 37,
      y: 0,
      width: zonaSeleccionada ? 65 : 35,
      height: 93,
    }
    const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (movimientoReducido) {
      svg.setAttribute('viewBox', `${destino.x} ${destino.y} ${destino.width} ${destino.height}`)
      return
    }

    const inicio = {
      x: svg.viewBox.baseVal.x,
      y: svg.viewBox.baseVal.y,
      width: svg.viewBox.baseVal.width,
      height: svg.viewBox.baseVal.height,
    }
    const duracion = 480
    let tiempoInicial
    let frameId

    function animar(tiempoActual) {
      tiempoInicial ??= tiempoActual
      const progreso = Math.min((tiempoActual - tiempoInicial) / duracion, 1)
      const avance = 1 - (1 - progreso) ** 3
      const interpolar = (propiedad) =>
        inicio[propiedad] + (destino[propiedad] - inicio[propiedad]) * avance

      svg.setAttribute(
        'viewBox',
        `${interpolar('x')} ${interpolar('y')} ${interpolar('width')} ${interpolar('height')}`
      )

      if (progreso < 1) frameId = requestAnimationFrame(animar)
    }

    frameId = requestAnimationFrame(animar)
    return () => cancelAnimationFrame(frameId)
  }, [vista, zonaSeleccionada])

  useLayoutEffect(() => {
    const region = regionSeleccionadaRef.current
    if (!zonaSeleccionada || !region) {
      setPuntoAnotacion(null)
      return
    }

    const limites = region.getBBox()
    const inicioCuerpo = vista === 'FRONT' ? 0 : 37
    const derechaCuerpo = inicioCuerpo + 35

    setPuntoAnotacion({
      x: Math.min(limites.x + limites.width * 0.82, derechaCuerpo - 0.5),
      y: limites.y + limites.height / 2,
      quiebreY: Math.max(8, limites.y + limites.height / 2 - 8),
    })
  }, [zonaSeleccionada, vista])

  function cambiarVista(nuevaVista) {
    if (nuevaVista === vista) return
    onCambiarVista(nuevaVista)
  }

  function manejarTeclado(event, zonaId) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSeleccionarZona(zonaSeleccionada === zonaId ? null : zonaId)
    }
  }

  return (
    <section className="body-map-section" aria-labelledby="body-map-title">
      <div className="body-map-heading">
        <div>
          <h2 id="body-map-title">Mapa corporal</h2>
        </div>
        <div className="body-map-view-switch" role="group" aria-label="Lado del cuerpo">
          <button
            type="button"
            className={vista === 'FRONT' ? 'active' : ''}
            aria-pressed={vista === 'FRONT'}
            onClick={() => cambiarVista('FRONT')}
          >
            Frente
          </button>
          <button
            type="button"
            className={vista === 'BACK' ? 'active' : ''}
            aria-pressed={vista === 'BACK'}
            onClick={() => cambiarVista('BACK')}
          >
            Espalda
          </button>
        </div>
      </div>

      <div
        className={`body-map-chart ${zonaSeleccionada ? 'is-selected' : ''}`}
        key={vista}
      >
        <svg
          ref={mapaSvgRef}
          viewBox={vista === 'FRONT' ? '0 0 35 93' : '37 0 35 93'}
          role="group"
          aria-label={`Mapa corporal interactivo, vista ${vista === 'FRONT' ? 'frontal' : 'posterior'}`}
        >
          <g className="body-map-context" aria-hidden="true">
            {regionesDeContexto
              .filter((region) => region.view === vista)
              .map((region) => (
                <path d={region.path} key={region.id} />
              ))}
          </g>
          {Object.entries(regionesPorZona).map(([zonaId, regiones]) => {
            const regionesDeLaVista = regiones.filter((region) => region.view === vista)
            if (regionesDeLaVista.length === 0) return null

            return (
              <g
                className={`body-map-zone ${zonaSeleccionada === zonaId ? 'selected' : ''}`}
                key={zonaId}
                ref={zonaSeleccionada === zonaId ? regionSeleccionadaRef : null}
                role="button"
                tabIndex="0"
                aria-label={`${zonasMusculares[zonaId].nombre}, vista ${vista === 'FRONT' ? 'frontal' : 'posterior'}`}
                aria-pressed={zonaSeleccionada === zonaId}
                onClick={() => onSeleccionarZona(zonaSeleccionada === zonaId ? null : zonaId)}
                onKeyDown={(event) => manejarTeclado(event, zonaId)}
              >
                {regionesDeLaVista.map((region) => (
                  <path d={region.path} key={region.id} />
                ))}
              </g>
            )
          })}
          {zonaSeleccionada && puntoAnotacion && (
            <g
              className="body-map-callout"
              key={`${vista}-${zonaSeleccionada}`}
            >
              <path
                pathLength="1"
                d={`M ${puntoAnotacion.x} ${puntoAnotacion.y} L ${vista === 'FRONT' ? 38 : 75} ${puntoAnotacion.quiebreY} L ${vista === 'FRONT' ? 64 : 101} ${puntoAnotacion.quiebreY}`}
                aria-hidden="true"
              />
              <text
                x={vista === 'FRONT' ? 51 : 88}
                y={puntoAnotacion.quiebreY - 2.8}
                textAnchor="middle"
                role="button"
                tabIndex="0"
                aria-label={`Ver ejercicios de ${zonasMusculares[zonaSeleccionada].nombre}`}
                onClick={onVerEjercicios}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onVerEjercicios()
                  }
                }}
              >
                {zonasMusculares[zonaSeleccionada].nombre}
                <tspan className="body-map-callout-info"> ⓘ</tspan>
              </text>
            </g>
          )}
        </svg>
      </div>
      <p className="body-map-hint">
        Seleccioná una zona general para ver los ejercicios relacionados.
      </p>
    </section>
  )
}

export default BodyMap
