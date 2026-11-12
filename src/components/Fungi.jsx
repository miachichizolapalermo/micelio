function Fungi({
    nombre,
    imagen,
    seleccionado,
    alSeleccionar,
    tituloInfo,
    descripcionInfo,
}) {
    return (
        <div
            className={`fungi ${seleccionado ? "seleccionado" : ""}`}
            onClick={alSeleccionar}
        >
            <div className="fungi-info" aria-hidden="true">
                <h2>{tituloInfo}</h2>
                <p>{descripcionInfo}</p>
            </div>
            <img src={imagen} alt={nombre} />
            <p>{nombre}</p>
        </div>
    );
}

export default Fungi;