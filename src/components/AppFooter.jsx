function AppFooter() {
  return (
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
  )
}

export default AppFooter
