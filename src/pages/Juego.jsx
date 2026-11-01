import { useCallback, useEffect, useRef, useState } from "react";

import Nivel from "../components/Nivel";
import Timer from "../components/Timer";
import Laberinto from "../components/Laberinto";

import nivel1 from "../niveles/nivel1";
import nivel2 from "../niveles/nivel2";
import nivel3 from "../niveles/nivel3";
import nivel4 from "../niveles/nivel4";
import { TIEMPOS_OBJETIVO } from "../niveles/tiemposObjetivo";
import fondoJuego from "../assets/fondo-juego.png";

import "../styles/juego.css";

const mapas = {
    1: nivel1,
    2: nivel2,
    3: nivel3,
    4: nivel4,
};

function Juego({ nivel, alCompletar }) {
    const mapa = mapas[nivel];
    const [segundos, setSegundos] = useState(0);
    const [introduccionVisible, setIntroduccionVisible] = useState(true);
    const [enCurso, setEnCurso] = useState(true);
    const inicioRef = useRef(null);

    useEffect(() => {
        const espera = setTimeout(() => {
            inicioRef.current = Date.now();
            setIntroduccionVisible(false);
        }, 3000);

        return () => clearTimeout(espera);
    }, []);

    useEffect(() => {
        if (introduccionVisible || !enCurso) {
            return undefined;
        }

        const intervalo = setInterval(() => {
            setSegundos((Date.now() - inicioRef.current) / 1000);
        }, 250);

        return () => clearInterval(intervalo);
    }, [introduccionVisible, enCurso]);

    const finalizarNivel = useCallback(() => {
        if (
            introduccionVisible ||
            !enCurso ||
            inicioRef.current === null
        ) {
            return;
        }

        const tiempoReal = (Date.now() - inicioRef.current) / 1000;
        setSegundos(tiempoReal);
        setEnCurso(false);
        alCompletar(nivel, tiempoReal);
    }, [alCompletar, enCurso, introduccionVisible, nivel]);

    const tiempoObjetivo = TIEMPOS_OBJETIVO[nivel];
    const tiempoObjetivoFormateado =
        `${String(Math.floor(tiempoObjetivo / 60)).padStart(2, "0")}:` +
        String(tiempoObjetivo % 60).padStart(2, "0");

    return (
        <main className="pantalla-juego">

            <img
                className="fondo-juego"
                src={fondoJuego}
                alt=""
            />

            <div className="hud-juego">
                <Nivel numero={nivel} />
                <Timer segundos={segundos} />
            </div>

            <div className="contenedor-laberinto">
                <Laberinto
                    mapa={mapa}
                    alCompletar={finalizarNivel}
                    movimientoHabilitado={!introduccionVisible && enCurso}
                />
            </div>

            {introduccionVisible && (
                <div className="introduccion-nivel-overlay">
                    <section
                        className="introduccion-nivel"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="introduccion-nivel-titulo"
                    >
                        <h2 id="introduccion-nivel-titulo">TIEMPO OBJETIVO</h2>
                        <p className="introduccion-nivel-tiempo">
                            {tiempoObjetivoFormateado}
                        </p>
                        <p className="introduccion-nivel-descripcion">
                            Completa el laberinto en este tiempo para alcanzar
                            el 100% de eficiencia.
                        </p>
                    </section>
                </div>
            )}

        </main>
    );
}

export default Juego;
