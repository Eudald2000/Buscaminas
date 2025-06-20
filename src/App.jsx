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
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    filas: 0,
    columnas: 0,
    minas: 0
  })

  function revelarCasilla (fila, col) {
    const nuevoTablero = tablero.map((f) => f.map((c) => ({ ...c })))
    if (nuevoTablero[fila][col].adjacentes === 0 && !nuevoTablero[fila][col].esMina) {
      revelarEnCascada(nuevoTablero, fila, col)
    } else {
      nuevoTablero[fila][col].revelada = true
    }
    setTablero(nuevoTablero)
    if (nuevoTablero[fila][col].esMina === true) {
      nuevoTablero.forEach(filaArr => {
        filaArr.forEach(casilla => {
          if (casilla.esMina) {
            casilla.revelada = true
          }
        })
      })
      setTablero(nuevoTablero)
      setModal('derrota')
      return
    }
    if (comprobarVictoria(nuevoTablero)) {
      setModal('victoria')
    }
  }

  function revelarEnCascada (tablero, fila, col) {
    const filas = tablero.length
    const columnas = tablero[0].length
    const stack = [[fila, col]] // inicialmente solo la casilla pulsada

    while (stack.length) {
      const [i, j] = stack.pop()

      // 1. Fuera del tablero
      if (i < 0 || i >= filas || j < 0 || j >= columnas) continue

      // 2. Mina
      if (tablero[i][j].revelada || tablero[i][j].esMina) continue

      tablero[i][j].revelada = true

      // 4. Si es vacía, añadimos sus 8 vecinas a la pila
      if (tablero[i][j].adjacentes === 0) {
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx !== 0 || dy !== 0) {
              stack.push([i + dx, j + dy])
            }
          }
        }
      }
    // Si tiene número, la revelamos pero no expandimos más
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
    if (form.filas * form.columnas <= form.minas) {
      setError('¡Debe haber más casillas que minas!')
      return
    }
    if (form.filas > 50) {
      setError('El numero de filas ha de ser inferior a 50')
      return
    }
    if (form.columnas > 50) {
      setError('El numero de filas ha de ser inferior a 50')
      return
    }
    setTablero(inicializarTablero(form.filas, form.columnas, form.minas))
    setError(null)
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
          {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
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
