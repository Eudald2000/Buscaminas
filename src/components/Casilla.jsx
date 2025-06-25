export const Casilla = ({
  casilla,
  filaIndex,
  casIndex,
  onRevelarCasilla,
  marcada,
  onMarcarBandera
}) => {
  return (
    <div
      key={casIndex}
      onContextMenu={(e) => {
        e.preventDefault()
        onMarcarBandera(filaIndex, casIndex)
      }}
      onClick={() => onRevelarCasilla(filaIndex, casIndex)}
      className={`casilla ${casilla.revelada ? 'mostrar' : 'oculta'}`}
      marcada={marcada}
      data-minas={undefined}
    >
      {!casilla.revelada && casilla.marcada && '🚩'}
      {casilla.revelada
        ? casilla.esMina
          ? '💣'
          : casilla.adjacentes || ''
        : ''}
    </div>
  )
}
