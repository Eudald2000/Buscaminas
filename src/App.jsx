import { useState, useEffect, useRef } from 'react'
import './App.css'
import { Modal } from './components/Modal'
import { Header } from './components/Header'
import { Tablero } from './components/Tablero'
import { comprobarVictoria, inicializarTablero, revelarEnCascada } from './utils/tablero'

function App () {
  const [tablero, setTablero] = useState(null)
  const [modal, setModal] = useState('inicio')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    filas: 0,
    columnas: 0,
    minas: 0
  })
  const [tiempo, setTiempo] = useState(0)
  const [juegoIniciado, setJuegoIniciado] = useState(false)
  const [juegoTerminado, setJuegoTerminado] = useState(false)
  const intervaloRef = useRef(null)

  useEffect(() => {
    if (juegoIniciado && !juegoTerminado) {
      intervaloRef.current = setInterval(() => {
        setTiempo(t => t + 100)
      }, 100)
    }
    return () => clearInterval(intervaloRef.current)
  }, [juegoIniciado, juegoTerminado])

  function revelarCasilla (fila, col) {
    if (!juegoIniciado) setJuegoIniciado(true)
    const nuevoTablero = tablero.map((f) => f.map((c) => ({ ...c })))
    if (
      nuevoTablero[fila][col].adjacentes === 0 &&
      !nuevoTablero[fila][col].esMina
    ) {
      revelarEnCascada(nuevoTablero, fila, col)
    } else {
      nuevoTablero[fila][col].revelada = true
    }
    setTablero(nuevoTablero)
    if (nuevoTablero[fila][col].esMina === true) {
      setJuegoTerminado(true)
      nuevoTablero.forEach((filaArr) => {
        filaArr.forEach((casilla) => {
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
      setJuegoTerminado(true)
      setModal('victoria')
    }
  }

  function marcarCasilla (fila, col) {
    const nuevoTablero = tablero.map(f => f.map(c => ({ ...c })))
    if (!nuevoTablero[fila][col].revelada) {
      nuevoTablero[fila][col].marcada = !nuevoTablero[fila][col].marcada
      setTablero(nuevoTablero)
    }
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
    setTiempo(0)
    setJuegoIniciado(false)
    setJuegoTerminado(false)
  }
  return (
    <>
      <Header tiempo={tiempo} />
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
            <button onClick={handleSubmit} type="submit">
              Crear tablero
            </button>
          </form>
        </Modal>
      )}
      {
      tablero && (
        <Tablero tablero={tablero} onRevelarCasilla={revelarCasilla} onMarcarBandera={marcarCasilla}/>
      )}
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
