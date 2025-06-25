import { Fila } from './Fila'

export const Tablero = ({ tablero, onRevelarCasilla }) => {
  return (
    <div className="tablero">
      {tablero.map((fila, filaIndex) => (
        <Fila
        key={filaIndex}
        fila={fila}
        filaIndex={filaIndex}
        onRevelarCasilla={onRevelarCasilla}
        />
      ))}
    </div>
  )
}
