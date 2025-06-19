import { useState } from 'react'
import './App.css'

function App () {
  const [tablero, setTablero] = useState(
    Array(8)
      .fill(null)
      .map(() =>
        Array(8)
          .fill(null)
          .map(() => ({
            esMina: false,
            revelada: false,
            adjacentes: 0
          }))
      )
  )
  const [minas, setMinas] = useState(10)
  const min = 0
  const max = 8

  function colocarMinas (tablero) {
    const newTablero = tablero.map((row) => [...row])

    for (let i = 0; i < minas; i++) {
      const fila = Math.floor(Math.random() * (max - min) + min)
      const col = Math.floor(Math.random() * (max - min) + min)
      if (!newTablero[fila][col].esMina) {
        newTablero[fila][col].esMina = true
      } else {
        i--
      }
    }
    setTablero(newTablero)
    console.log(tablero)
  }

  function handleClick () {
    colocarMinas(tablero)
  }

  function revelarCasilla (fila, col) {
    const newTablero = tablero.map((row) => row.map((c) => ({ ...c })))
    newTablero[fila][col].revelada = true
    setTablero(newTablero)
  }

  return (
    <>
      <header className="header">
        <h1>Buscaminas</h1>
        <p>¡Encuentra todas las minas sin hacerlas explotar!</p>
      </header>
      <button onClick={handleClick}>Iniciar</button>
      <div className="tablero">
        {tablero.map((fila, filaIndex) => (
          <div key={filaIndex} className="fila">
            {fila.map((casilla, casIndex) => (
              <div
                key={casIndex}
                onClick={() => revelarCasilla(filaIndex, casIndex)}
                className={`casilla ${casilla.revelada ? 'mostrar' : 'oculta'}`}
              >
                {casilla.revelada
                  ? casilla.esMina
                    ? '💣'
                    : casilla.adjacentes || ''
                  : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
