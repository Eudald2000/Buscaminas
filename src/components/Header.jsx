// Header.jsx
export const Header = ({ tiempo }) => (
  <header className="header">
    <h1>Buscaminas</h1>
    <div className="header-row">
      <p>¡Encuentra todas las minas sin hacerlas explotar!</p>
      <span className="tiempo">{(tiempo / 1000).toFixed(1)}s</span>
    </div>
  </header>
)
