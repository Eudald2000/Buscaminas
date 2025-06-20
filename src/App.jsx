import { useState } from 'react'
import './App.css'
import { Modal } from './components/Modal'

function crearTableroVacio (filas, columnas) {
  return Array(filas)
    .fill(null)
    .map(() =>
      Array(columnas)
        .fill(null)
        .map(() => ({
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
            ni >= 0 &&
            ni < filas &&
            nj >= 0 &&
            nj < columnas &&
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
  const [tablero, setTablero] = useState(null)
  const [modal, setModal] = useState('inicio')
  const [form, setForm] = useState({
    filas: 0,
    columnas: 0,
    minas: 0
  })

  function revelarCasilla (fila, col) {
    const nuevoTablero = tablero.map((f) => f.map((c) => ({ ...c })))
    nuevoTablero[fila][col].revelada = true
    setTablero(nuevoTablero)
    if (nuevoTablero[fila][col].esMina === true) {
      setModal('derrota')
    }
    if (comprobarVictoria(nuevoTablero)) {
      setModal('victoria')
    }
  }

  function comprobarVictoria (tablero) {
    for (const fila of tablero) {
      for (const casilla of fila) {
        if (!casilla.esMina && !casilla.revelada) {
          return false
        }
      }
    }
    return true
  }

  function handleSubmit (e) {
    e.preventDefault()
    setTablero(inicializarTablero(form.filas, form.columnas, form.minas))
    setModal(null)
  }

  function restartGame () {
    setTablero(null)
    setModal('inicio')
    setForm({
      filas: 0,
      columnas: 0,
      minas: 0
    })
  }
  return (
    <>
      <header className="header">
        <h1>Buscaminas</h1>
        <p>¡Encuentra todas las minas sin hacerlas explotar!</p>
      </header>
      {modal === 'inicio' && (
        <Modal titulo={'INTRODUCE LOS DATOS'}>
          <form>
            <input
              onChange={(e) =>
                setForm({ ...form, filas: Number(e.target.value) })
              }
              placeholder="Introduce las filas"
              type="number"
            />
            <input
              onChange={(e) =>
                setForm({ ...form, columnas: Number(e.target.value) })
              }
              placeholder="Introduce las columnas"
              type="number"
            />
            <input
              onChange={(e) =>
                setForm({ ...form, minas: Number(e.target.value) })
              }
              placeholder="Introduce el numero de minas"
              type="number"
            />
            <button onClick={handleSubmit} type='submit'>
              Crear tablero
            </button>
          </form>
        </Modal>
      )}
      <div className="tablero">
        {
        tablero && (
          tablero.map((fila, filaIndex) => (
          <div className="fila" key={filaIndex}>
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
          )))
      }
      </div>
      {modal === 'victoria' && (
        <Modal titulo="¡Victoria!">
          <h2>Has ganado</h2>
          <button onClick={restartGame}>Jugar de nuevo</button>
        </Modal>
      )}
      {modal === 'derrota' && (
        <Modal titulo={'¡Derrota!'}>
          <h2>Has explotado</h2>
          <button onClick={restartGame}>Intentar de nuevo</button>
        </Modal>
      )}
    </>
  )
}

export default App
