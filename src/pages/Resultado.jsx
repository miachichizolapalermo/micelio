import Boton from "../components/Boton";
import Crecimiento from "../components/Crecimiento";
import Dato from "../components/Dato";

import melena from "../assets/melena.png";
import reishi from "../assets/reishi.png";
import cordyceps from "../assets/cordyceps.png";

import "../styles/resultado.css";

const imagenesFungi = {
    melena,
    reishi,
    cordyceps,
};

function formatearPorcentaje(porcentaje) {
    return `${porcentaje.toLocaleString("es-AR", {
        maximumFractionDigits: 2,
    })}%`;
}

function formatearTiempo(segundos) {
    const tiempo = segundos.toLocaleString("es-AR", {
        maximumFractionDigits: 2,
    });
    return `${tiempo} ${segundos === 1 ? "segundo" : "segundos"}`;
}

function Resultado({
    nivel,
    tiempoReal,
    eficiencia,
    crecimientoNivel,
    crecimientoTotal,
    crecimientoInicial,
    fungiSeleccionado,
    alReintentar,
    alVerNiveles,
    alVerResultadoFinal,
}) {
    return (
        <main className="pantalla-resultado">
            <h1>NIVEL {nivel} COMPLETADO</h1>

            <section className="resultado-contenido">
                <div className="resultado-datos">
                    <Dato nombre="Tiempo" valor={formatearTiempo(tiempoReal)} />
                    <Dato nombre="Eficiencia" valor={`${Math.round(eficiencia)}%`} />
                    <Dato
                        nombre="Crecimiento"
                        valor={`+${formatearPorcentaje(crecimientoNivel)}`}
                    />
                </div>

                <div className="resultado-crecimiento">
                    <Crecimiento
                        imagen={imagenesFungi[fungiSeleccionado]}
                        porcentaje={crecimientoTotal}
                        porcentajeInicial={crecimientoInicial}
                    />
                </div>
            </section>

            <nav className="resultado-botones" aria-label="Acciones de resultado">
                <Boton texto="INTENTAR DE NUEVO" accion={alReintentar} />
                <Boton
                    texto={nivel === 4 ? "VER RESULTADO FINAL" : "VER NIVELES"}
                    accion={nivel === 4 ? alVerResultadoFinal : alVerNiveles}
                />
            </nav>
        </main>
    );
}

export default Resultado;
