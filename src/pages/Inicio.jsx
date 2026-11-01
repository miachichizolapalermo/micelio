import "../styles/inicio.css";
import hongosInicio from "../assets/iniciof.png";

function Inicio({ alEmpezar }) {
    return (
        <main className="pantalla-inicio" onClick={alEmpezar}>

            <img
                className="hongos-inicio"
                src={hongosInicio}
                alt=""
            />

            <div className="contenido-inicio">
                <h1>MICELIO</h1>
                <p>HACÉ CLICK PARA EMPEZAR</p>
            </div>

        </main>
    );
}

export default Inicio;