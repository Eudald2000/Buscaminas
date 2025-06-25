export const Casilla = ({ casilla, filaIndex, casIndex, onRevelarCasilla }) => {
  return (
    <div
      key={casIndex}
      onClick={() => onRevelarCasilla(filaIndex, casIndex)}
      className={`casilla ${casilla.revelada ? 'mostrar' : 'oculta'}`}
      data-minas={casilla.adjacentes || undefined}
    >
      {casilla.revelada
        ? casilla.esMina
          ? '💣'
          : casilla.adjacentes || ''
        : ''}
    </div>
  )
}
