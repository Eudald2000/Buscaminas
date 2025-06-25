function crearTableroVacio (filas, columnas) {
  return Array(filas)
    .fill(null)
    .map(() =>
      Array(columnas)
        .fill(null)
        .map(() => ({
          esMina: false,
          revelada: false,
          adjacentes: 0,
          marcada: false
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

export function inicializarTablero (filas, columnas, minas) {
  let tablero = crearTableroVacio(filas, columnas)
  tablero = colocarMinas(tablero, minas)
  tablero = contarMinasAdyacentes(tablero)
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

export function revelarEnCascada (tablero, fila, col) {
  const filas = tablero.length
  const columnas = tablero[0].length
  const stack = [[fila, col]]

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
  }
}

export function comprobarVictoria (tablero) {
  for (const fila of tablero) {
    for (const casilla of fila) {
      if (!casilla.esMina && !casilla.revelada) {
        return false
      }
    }
  }
  return true
}
