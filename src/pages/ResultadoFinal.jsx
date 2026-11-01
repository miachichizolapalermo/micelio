import Boton from "../components/Boton";
import Crecimiento from "../components/Crecimiento";
import Dato from "../components/Dato";

import melena from "../assets/melena.png";
import reishi from "../assets/reishi.png";
import cordyceps from "../assets/cordyceps.png";

import "../styles/resultadoFinal.css";

const imagenesFungi = {
    melena,
    reishi,
    cordyceps,
};

function formatearPorcentaje(porcentaje) {
    return porcentaje.toLocaleString("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

function obtenerCrecimientosMostrados(mejoresResultados) {
    const crecimientos = [1, 2, 3, 4].map(
        (nivel) => mejoresResultados[nivel].eficiencia * 0.25
    );
    const centesimas = crecimientos.map((crecimiento) =>
        Math.floor(crecimiento * 100 + 1e-9)
    );
    const totalCentesimas = Math.round(
        crecimientos.reduce((total, crecimiento) => total + crecimiento, 0) * 100
    );
    const centesimasRestantes =
        totalCentesimas -
        centesimas.reduce((total, crecimiento) => total + crecimiento, 0);

    const ordenPorResto = crecimientos
        .map((crecimiento, index) => ({
            index,
            resto: crecimiento * 100 - centesimas[index],
        }))
        .sort((a, b) => b.resto - a.resto);

    for (let index = 0; index < centesimasRestantes; index += 1) {
        centesimas[ordenPorResto[index].index] += 1;
    }

    return centesimas.map((crecimiento) => crecimiento / 100);
}

function ResultadoFinal({
    mejoresResultados,
    crecimientoTotal,
    fungiSeleccionado,
    alIntentarDeNuevo,
    alFinalizar,
}) {
    const crecimientos = obtenerCrecimientosMostrados(mejoresResultados);
    const mensajeCierre = crecimientoTotal >= 100
        ? "TU HONGO CRECIÓ POR COMPLETO."
        : crecimientoTotal >= 75
            ? "TU HONGO CRECIÓ CASI POR COMPLETO."
            : "TU HONGO SIGUE CRECIENDO.";

    return (
        <main className="pantalla-resultado-final">
            <h1>RESULTADO FINAL</h1>

            <section className="resultado-final-contenido">
                <div className="resultado-final-resumen">
                    {crecimientos.map((crecimiento, index) => (
                        <Dato
                            key={index}
                            nombre={`Nivel ${index + 1}:`}
                            valor={`+${formatearPorcentaje(crecimiento)}%`}
                        />
                    ))}
                </div>

                <div className="resultado-final-crecimiento">
                    <Crecimiento
                        imagen={imagenesFungi[fungiSeleccionado]}
                        porcentaje={crecimientoTotal}
                        porcentajeInicial={0}
                    />
                    <h2 className="mensaje-cierre">{mensajeCierre}</h2>
                </div>
            </section>

            <nav
                className="resultado-final-botones"
                aria-label="Acciones del resultado final"
            >
                <Boton
                    texto="INTENTAR DE NUEVO"
                    accion={alIntentarDeNuevo}
                />
                <Boton texto="FINALIZAR" accion={alFinalizar} />
            </nav>
        </main>
    );
}

export default ResultadoFinal;
