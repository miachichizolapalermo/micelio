function Boton({ texto, accion, disabled = false }) {
    return (
        <button className="boton" onClick={accion} disabled={disabled}>
            {texto}
        </button>
    );
}

export default Boton;