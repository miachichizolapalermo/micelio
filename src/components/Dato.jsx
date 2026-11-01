function Dato({ nombre, valor }) {
    return (
        <div className="dato">
            <span>{nombre}</span>
            <span>{valor}</span>
        </div>
    );
}

export default Dato;