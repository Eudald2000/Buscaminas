export const Modal = ({ titulo, children }) => (
  <div className="modal">
    <h1>{titulo}</h1>
    {children}
  </div>
)
