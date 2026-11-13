import { useEffect, useRef, useState } from 'react'
import isotipo from '../assets/isotipo.svg'
import userIcon from '../assets/user-icon.svg'

function AppHeader({ pagina, nombreUsuario, cerrandoSesion, errorCierreSesion, onIrInicio, onIrRutina, onCerrarSesion }) {
  const [menuMobileAbierto, setMenuMobileAbierto] = useState(false)
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false)
  const topbarRef = useRef(null)
  const menuUsuarioRef = useRef(null)

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

  function navegar(callback) {
    callback()
    setMenuMobileAbierto(false)
    setMenuUsuarioAbierto(false)
  }

  return (
    <header className="topbar" ref={topbarRef}>
      <a
        className="brand"
        href="#inicio"
        onClick={(evento) => {
          evento.preventDefault()
          navegar(onIrInicio)
        }}
      >
        <img src={isotipo} alt="" className="brand-icon" />
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
            onClick={(evento) => {
              evento.preventDefault()
              navegar(onIrInicio)
            }}
          >
            Inicio
          </a>
          <a
            href="#rutina"
            className={pagina === 'rutina' ? 'active' : ''}
            onClick={(evento) => {
              evento.preventDefault()
              navegar(onIrRutina)
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
            <span className="account-name">{nombreUsuario}</span>
            <button
              type="button"
              className="account-logout"
              onClick={onCerrarSesion}
              disabled={cerrandoSesion}
            >
              {cerrandoSesion ? 'Cerrando sesión…' : 'Cerrar sesión'}
            </button>
            {errorCierreSesion && <span className="session-error" role="alert">{errorCierreSesion}</span>}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
