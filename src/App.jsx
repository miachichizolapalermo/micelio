import { useState } from "react";

import Inicio from "./pages/Inicio";
import SeleccionFungi from "./pages/SeleccionFungi";
import Niveles from "./pages/Niveles";
import Juego from "./pages/Juego";
import Resultado from "./pages/Resultado";
import ResultadoFinal from "./pages/ResultadoFinal";
import { TIEMPOS_OBJETIVO } from "./niveles/tiemposObjetivo";

function calcularCrecimientoTotal(mejoresResultados) {
    return Math.min(
        100,
        Object.values(mejoresResultados).reduce(
            (total, resultado) => total + resultado.eficiencia * 0.25,
            0
        )
    );
}

function App() {

    const [pantalla, setPantalla] = useState("inicio");

    const [nombre, setNombre] = useState("");

    const [fungiSeleccionado, setFungiSeleccionado] =
        useState(null);

    const [progreso, setProgreso] = useState(0);

    const [nivelActual, setNivelActual] = useState(null);

    const [mejoresResultados, setMejoresResultados] = useState({});

    const [resultadoActual, setResultadoActual] = useState(null);


    // TERMINA LA SELECCIÓN Y VA AL MAPA
    function comenzarJuego(nombreJugador, fungi) {

        setNombre(nombreJugador);

        setFungiSeleccionado(fungi);

        setProgreso(0);

        setNivelActual(null);

        setMejoresResultados({});

        setResultadoActual(null);

        setPantalla("niveles");
    }


    function jugarNivel(numero) {
        setNivelActual(numero);
        setPantalla("juego");
    }


    function completarNivel(nivel, tiempoReal) {
        const eficienciaReal = Math.min(
            100,
            (TIEMPOS_OBJETIVO[nivel] / Math.max(tiempoReal, 1)) * 100
        );
        const crecimientoNivel = eficienciaReal * 0.25;
        const crecimientoInicial = calcularCrecimientoTotal(mejoresResultados);
        const mejorResultado = mejoresResultados[nivel];
        const superoMejorResultado = !mejorResultado ||
            eficienciaReal > mejorResultado.eficiencia ||
            (eficienciaReal === mejorResultado.eficiencia &&
                tiempoReal < mejorResultado.tiempoReal);

        setMejoresResultados((resultados) => {
            const mejorResultado = resultados[nivel];

            if (
                !mejorResultado ||
                eficienciaReal > mejorResultado.eficiencia ||
                (eficienciaReal === mejorResultado.eficiencia &&
                    tiempoReal < mejorResultado.tiempoReal)
            ) {
                return {
                    ...resultados,
                    [nivel]: { tiempoReal, eficiencia: eficienciaReal },
                };
            }

            return resultados;
        });

        setProgreso((progresoActual) => Math.max(progresoActual, nivel));

        let crecimientoFinal = crecimientoInicial;

        if (superoMejorResultado) {
            const mejoresResultadosActualizados = {
                ...mejoresResultados,
                [nivel]: { tiempoReal, eficiencia: eficienciaReal },
            };
            crecimientoFinal = calcularCrecimientoTotal(mejoresResultadosActualizados);
        }

        setResultadoActual({
            nivel,
            tiempoReal,
            eficiencia: eficienciaReal,
            crecimientoNivel,
            crecimientoInicial,
            crecimientoFinal,
        });

        setPantalla("resultado");
    }

    function verNiveles() {
        setPantalla("niveles");
    }

    function verResultadoFinal() {
        const tieneResultadosCompletos = [1, 2, 3, 4].every(
            (nivel) => mejoresResultados[nivel]
        );

        if (progreso === 4 && tieneResultadosCompletos) {
            setPantalla("resultadoFinal");
        }
    }

    function reiniciarPartida(pantallaDestino) {
        setNombre("");
        setFungiSeleccionado(null);
        setProgreso(0);
        setNivelActual(null);
        setMejoresResultados({});
        setResultadoActual(null);
        setPantalla(pantallaDestino);
    }

    const crecimientoTotal = calcularCrecimientoTotal(mejoresResultados);

    return (
        <>

            {/* PORTADA */}

            {pantalla === "inicio" && (

                <Inicio
                    alEmpezar={() =>
                        setPantalla("seleccion")
                    }
                />

            )}


            {/* SELECCIÓN */}

            {pantalla === "seleccion" && (

                <SeleccionFungi
                    alComenzar={comenzarJuego}
                />

            )}


            {/* MAPA DE NIVELES */}

            {pantalla === "niveles" && (

                <Niveles
                    nombre={nombre}
                    progreso={progreso}
                    alJugarNivel={jugarNivel}
                />

            )}


            {/* JUEGO */}

            {pantalla === "juego" && (

                <Juego
                    nivel={nivelActual}
                    alCompletar={completarNivel}
                />

            )}

            {pantalla === "resultado" && resultadoActual && (

                <Resultado
                    {...resultadoActual}
                    fungiSeleccionado={fungiSeleccionado}
                    crecimientoTotal={resultadoActual.crecimientoFinal}
                    crecimientoInicial={resultadoActual.crecimientoInicial}
                    alReintentar={() => jugarNivel(resultadoActual.nivel)}
                    alVerNiveles={verNiveles}
                    alVerResultadoFinal={verResultadoFinal}
                />

            )}

            {pantalla === "resultadoFinal" &&
                progreso === 4 &&
                [1, 2, 3, 4].every((nivel) => mejoresResultados[nivel]) && (
                    <ResultadoFinal
                        mejoresResultados={mejoresResultados}
                        crecimientoTotal={crecimientoTotal}
                        fungiSeleccionado={fungiSeleccionado}
                        alIntentarDeNuevo={() => reiniciarPartida("seleccion")}
                        alFinalizar={() => reiniciarPartida("inicio")}
                    />
                )}

        </>
    );
}

export default App;
