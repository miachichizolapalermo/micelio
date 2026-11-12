import { useEffect, useRef, useState } from "react";

const VELOCIDAD_MOVIMIENTO = 90;
const DURACION_TRANSICION_VISUAL = 83;


// BUSCA AUTOMÁTICAMENTE DÓNDE ESTÁ EL 2
function encontrarInicio(mapa) {
    for (let fila = 0; fila < mapa.length; fila++) {
        for (let columna = 0; columna < mapa[fila].length; columna++) {
            if (mapa[fila][columna] === 2) {
                return { fila, columna };
            }
        }
    }

    return { fila: 0, columna: 0 };
}

function generarTrazadosParedes(mapa) {
    const trazados = [];

    mapa.forEach((fila, numeroFila) => {
        fila.forEach((celda, numeroColumna) => {
            if (celda !== 1) {
                return;
            }

            const centroX = numeroColumna + 0.5;
            const centroY = numeroFila + 0.5;

            if (fila[numeroColumna + 1] === 1) {
                trazados.push(
                    `M ${centroX} ${centroY} H ${centroX + 1}`
                );
            }

            if (mapa[numeroFila + 1]?.[numeroColumna] === 1) {
                trazados.push(
                    `M ${centroX} ${centroY} V ${centroY + 1}`
                );
            }
        });
    });

    return trazados;
}


function Laberinto({ mapa, alCompletar, movimientoHabilitado = true }) {

    const inicio = encontrarInicio(mapa);
    const trazadosParedes = generarTrazadosParedes(mapa);


    // POSICIÓN ACTUAL DEL JUGADOR
    const jugadorActual = useRef(inicio);
    const [jugadorVisual, setJugadorVisual] = useState(inicio);
    const jugadorVisualActual = useRef(inicio);
    const [retrocediendoVisual, setRetrocediendoVisual] = useState(false);
    const animacionVisual = useRef(null);


    // RECORRIDO DEL JUGADOR
    const [recorrido, setRecorrido] = useState([inicio]);
    const recorridoActual = useRef([inicio]);

    const yaCompleto = useRef(false);

    const posicionesIguales = (primera, segunda) =>
        Math.abs(primera.fila - segunda.fila) < 0.001 &&
        Math.abs(primera.columna - segunda.columna) < 0.001;

    const destinoLogicoActual = recorrido[recorrido.length - 1];
    const seEstaRetrocediendoVisualmente = retrocediendoVisual;

    let puntosRecorridoVisual;

    if (seEstaRetrocediendoVisualmente) {
        puntosRecorridoVisual = [...recorrido];
        if (!posicionesIguales(destinoLogicoActual, jugadorVisual)) {
            puntosRecorridoVisual.push(jugadorVisual);
        }
    } else if (recorrido.length === 1) {
        puntosRecorridoVisual = [jugadorVisual];
    } else {
        puntosRecorridoVisual = recorrido.slice(0, -1);
        puntosRecorridoVisual.push(jugadorVisual);
    }


    useEffect(() => {
        const teclasPresionadas = [];
        let intervaloMovimiento = null;
        let temporizadorMeta = null;

        function desplazarJugadorVisual(destino, retrocediendo = false) {
            if (animacionVisual.current !== null) {
                window.cancelAnimationFrame(animacionVisual.current);
            }

            const origen = { ...jugadorVisualActual.current };
            setRetrocediendoVisual(retrocediendo);
            let tiempoInicial = null;

            function animar(tiempo) {
                if (tiempoInicial === null) {
                    tiempoInicial = tiempo;
                }

                const progreso = Math.min(
                    (tiempo - tiempoInicial) / DURACION_TRANSICION_VISUAL,
                    1
                );
                const siguientePosicion = {
                    fila: origen.fila + (destino.fila - origen.fila) * progreso,
                    columna: origen.columna + (destino.columna - origen.columna) * progreso,
                };

                jugadorVisualActual.current = siguientePosicion;
                setJugadorVisual(siguientePosicion);

                if (progreso < 1) {
                    animacionVisual.current = window.requestAnimationFrame(animar);
                } else {
                    jugadorVisualActual.current = destino;
                    setJugadorVisual(destino);
                    animacionVisual.current = null;
                }
            }

            animacionVisual.current = window.requestAnimationFrame(animar);
        }

        function obtenerDireccionActual() {
            return teclasPresionadas[teclasPresionadas.length - 1];
        }

        function detenerMovimiento() {
            if (intervaloMovimiento !== null) {
                window.clearInterval(intervaloMovimiento);
                intervaloMovimiento = null;
            }
        }

        function moverJugador(direccion) {
            if (!direccion || !movimientoHabilitado || yaCompleto.current) return;

            let nuevaFila = jugadorActual.current.fila;
            let nuevaColumna = jugadorActual.current.columna;

            if (direccion === "ArrowUp") nuevaFila -= 1;
            else if (direccion === "ArrowDown") nuevaFila += 1;
            else if (direccion === "ArrowLeft") nuevaColumna -= 1;
            else if (direccion === "ArrowRight") nuevaColumna += 1;

            const nuevaCelda = mapa[nuevaFila]?.[nuevaColumna];
            if (nuevaCelda !== 0 && nuevaCelda !== 2 && nuevaCelda !== 3) return;

            const nuevaPosicion = { fila: nuevaFila, columna: nuevaColumna };
            const posicionAnterior = recorridoActual.current[recorridoActual.current.length - 2];
            const estaRetrocediendo = posicionAnterior &&
                posicionAnterior.fila === nuevaFila &&
                posicionAnterior.columna === nuevaColumna;

            jugadorActual.current = nuevaPosicion;
            desplazarJugadorVisual(nuevaPosicion, Boolean(estaRetrocediendo));

            setRecorrido((recorridoActualEstado) => {
                const posicionAnteriorEstado = recorridoActualEstado[recorridoActualEstado.length - 2];
                const estaRetrocediendoEstado = posicionAnteriorEstado &&
                    posicionAnteriorEstado.fila === nuevaFila &&
                    posicionAnteriorEstado.columna === nuevaColumna;

                const nuevoRecorrido = estaRetrocediendoEstado
                    ? recorridoActualEstado.slice(0, -1)
                    : [...recorridoActualEstado, nuevaPosicion];

                recorridoActual.current = nuevoRecorrido;
                return nuevoRecorrido;
            });

            if (nuevaCelda === 3 && !yaCompleto.current) {
                yaCompleto.current = true;
                detenerMovimiento();
                teclasPresionadas.length = 0;
                temporizadorMeta = window.setTimeout(() => {
                    if (alCompletar) alCompletar();
                }, DURACION_TRANSICION_VISUAL);
            }
        }

        function iniciarMovimientoContinuo() {
            detenerMovimiento();
            intervaloMovimiento = window.setInterval(() => {
                moverJugador(obtenerDireccionActual());
            }, VELOCIDAD_MOVIMIENTO);
        }

        function manejarKeyDown(evento) {
            const flechas = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
            if (!flechas.includes(evento.key)) return;
            evento.preventDefault();
            if (!movimientoHabilitado || yaCompleto.current) return;

            if (!teclasPresionadas.includes(evento.key)) {
                teclasPresionadas.push(evento.key);
                moverJugador(evento.key);
                iniciarMovimientoContinuo();
            }
        }

        function manejarKeyUp(evento) {
            const indice = teclasPresionadas.indexOf(evento.key);
            if (indice !== -1) teclasPresionadas.splice(indice, 1);

            if (teclasPresionadas.length === 0) detenerMovimiento();
            else iniciarMovimientoContinuo();
        }

        window.addEventListener("keydown", manejarKeyDown);
        window.addEventListener("keyup", manejarKeyUp);

        return () => {
            detenerMovimiento();
            window.removeEventListener("keydown", manejarKeyDown);
            window.removeEventListener("keyup", manejarKeyUp);
            window.clearTimeout(temporizadorMeta);
            if (animacionVisual.current !== null) {
                window.cancelAnimationFrame(animacionVisual.current);
                animacionVisual.current = null;
            }
        };
    }, [mapa, alCompletar, movimientoHabilitado]);


    return (

        <div
            className="laberinto"

            style={{
                gridTemplateColumns:
                    `repeat(${mapa[0].length}, 1fr)`,

                gridTemplateRows:
                    `repeat(${mapa.length}, 1fr)`,
            }}
        >

            <svg
                className="paredes-laberinto"
                viewBox={`0 0 ${mapa[0].length} ${mapa.length}`}
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                {trazadosParedes.map((trazado, index) => (
                    <path key={index} d={trazado} />
                ))}
            </svg>

            {/* RASTRO MORADO */}

            <svg
                className="rastro-laberinto"

                viewBox={
                    `0 0 ${mapa[0].length} ${mapa.length}`
                }

                preserveAspectRatio="none"
            >

                <polyline

                    points={puntosRecorridoVisual
                        .map((posicion) =>
                            `${posicion.columna + 0.5},${posicion.fila + 0.5}`
                        )
                        .join(" ")}

                />

            </svg>

            {/* JUGADOR */}
            <div
                className="jugador"
                style={{
                    left: `${((jugadorVisual.columna + 0.5) / mapa[0].length) * 100}%`,
                    top: `${((jugadorVisual.fila + 0.5) / mapa.length) * 100}%`,
                }}
            />


            {/* GRILLA */}

            {mapa.map(
                (fila, numeroFila) =>

                    fila.map(
                        (celda, numeroColumna) => (

                            <div

                                key={
                                    `${numeroFila}-${numeroColumna}`
                                }

                                className={
                                    celda === 1
                                        ? "celda pared"
                                        : "celda camino"
                                }

                            >


                                {/* INICIO */}

                                {celda === 2 && (

                                    <div className="inicio-laberinto">
                                        
                                    </div>

                                )}



                                {/* FIN */}

                                {celda === 3 && (

                                    <div className="fin-laberinto">
                                        
                                    </div>

                                )}



                            </div>

                        )
                    )

            )}

        </div>
    );
}


export default Laberinto;