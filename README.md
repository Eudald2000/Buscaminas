# Buscaminas (React)

## Descripción
Este proyecto es una versión interactiva del clásico juego Buscaminas, desarrollada con React. El objetivo es descubrir todas las casillas que no contienen minas, evitando detonar alguna. Puedes personalizar el tamaño del tablero y el número de minas antes de empezar cada partida.

---

## ¿Cómo funciona el juego?
- Al iniciar, aparece un formulario donde puedes elegir el número de filas, columnas y minas.
- El tablero se genera aleatoriamente según los parámetros introducidos.
- Haz clic izquierdo en una casilla para revelarla:
  - Si es una mina, pierdes y se muestran todas las minas.
  - Si no es mina y tiene minas adyacentes, se muestra el número de minas cercanas.
  - Si no es mina y no tiene minas adyacentes, se revelan automáticamente todas las casillas vacías conectadas (efecto cascada).
- Ganas la partida si revelas todas las casillas que no son minas.
- El juego muestra un mensaje de victoria o derrota en un modal reutilizable.

---

## Estructura de datos de cada casilla
Cada casilla contiene:
- **isMine**: ¿Es una mina?
- **isRevealed**: ¿Está descubierta?
- **isFlagged**: ¿Está marcada con bandera?
- **adjacentMines**: Número de minas alrededor

---

## Cómo jugar
1. Introduce el número de filas, columnas y minas en el formulario inicial.
2. Haz clic en una casilla para descubrirla.
3. Si descubres una mina, pierdes la partida y se muestran todas las minas.
4. Si descubres todas las casillas que no son minas, ¡ganas!
