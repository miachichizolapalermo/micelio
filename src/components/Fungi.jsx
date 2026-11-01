function Fungi({ nombre, imagen, seleccionado, alSeleccionar }) {
    return (
        <div
            className={`fungi ${seleccionado ? "seleccionado" : ""}`}
            onClick={alSeleccionar}
        >
            <img src={imagen} alt={nombre} />
            <p>{nombre}</p>
        </div>
    );
}

export default Fungi;