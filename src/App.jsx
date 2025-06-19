import { useState } from 'react'
import './App.css'

const FILAS = 8
const COLUMNAS = 8
const MINAS = 15

function crearTableroVacio (filas, columnas) {
  return Array(filas).fill(null).map(() =>
    Array(columnas).fill(null).map(() => ({
      esMina: false,
      revelada: false,
      adjacentes: 0
    }))
  )
}

function colocarMinas (tablero, minas) {
  const filas = tablero.length
  const columnas = tablero[0].length
  let minasColocadas = 0
  while (minasColocadas < minas) {
    const i = Math.floor(Math.random() * filas)
    const j = Math.floor(Math.random() * columnas)
    if (!tablero[i][j].esMina) {
      tablero[i][j].esMina = true
      minasColocadas++
    }
  }
  return tablero
}

function contarMinasAdyacentes (tablero) {
  const filas = tablero.length
  const columnas = tablero[0].length
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      if (tablero[i][j].esMina) continue
      let contador = 0
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue
          const ni = i + dx
          const nj = j + dy
          if (
            ni >= 0 && ni < filas &&
            nj >= 0 && nj < columnas &&
            tablero[ni][nj].esMina
          ) {
            contador++
          }
        }
      }
      tablero[i][j].adjacentes = contador
    }
  }
  return tablero
}

function inicializarTablero (filas, columnas, minas) {
  let tablero = crearTableroVacio(filas, columnas)
  tablero = colocarMinas(tablero, minas)
  tablero = contarMinasAdyacentes(tablero)
  return tablero
}

function App () {
  const [tablero, setTablero] = useState(() =>
    inicializarTablero(FILAS, COLUMNAS, MINAS)
  )

  function revelarCasilla (fila, col) {
    const nuevoTablero = tablero.map(f =>
      f.map(c => ({ ...c }))
    )
    nuevoTablero[fila][col].revelada = true
    setTablero(nuevoTablero)
  }

  return (
    <>
      <header className="header">
        <h1>Buscaminas</h1>
        <p>¡Encuentra todas las minas sin hacerlas explotar!</p>
      </header>
      <div className='tablero'>
        {tablero.map((fila, filaIndex) => (
          <div className='fila' key={filaIndex}>
            {fila.map((casilla, casIndex) => (
              <div
                key={casIndex}
                onClick={() => revelarCasilla(filaIndex, casIndex)}
                className={`casilla ${casilla.revelada ? 'mostrar' : 'oculta'}`}
                data-minas={casilla.adjacentes || undefined}
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
