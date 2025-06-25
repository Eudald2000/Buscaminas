import { Casilla } from './Casilla'

export const Fila = ({ fila, filaIndex, onRevelarCasilla, onMarcarBandera }) => {
  return (
    <div className="fila" key={filaIndex}>
      {fila.map((casilla, casIndex) => (
        <Casilla
        key={casIndex}
          casilla={casilla}
          filaIndex={filaIndex}
          casIndex={casIndex}
          onRevelarCasilla={onRevelarCasilla}
          onMarcarBandera={onMarcarBandera}
        />
      ))}
    </div>
  )
}
