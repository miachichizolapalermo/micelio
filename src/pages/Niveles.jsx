import { useEffect, useRef, useState } from "react";

import NivelMapa from "../components/NivelMapa";
import fondoNiveles from "../assets/fondo-niveles.png";

import "../styles/niveles.css";

function estadoNivel(numero, progreso) {
    if (numero <= progreso) {
        return "completado";
    }

    if (numero === progreso + 1) {
        return "disponible";
    }

    return "bloqueado";
}


function Niveles({ nombre, progreso, alJugarNivel }) {

    const areaRef = useRef(null);

    const nivel1Ref = useRef(null);
    const nivel2Ref = useRef(null);
    const nivel3Ref = useRef(null);
    const nivel4Ref = useRef(null);

    const [lineas, setLineas] = useState([]);

    useEffect(() => {

        function calcularLineas() {

            const area = areaRef.current;

            if (!area) return;

            const areaRect = area.getBoundingClientRect();

            function conectar(origen, destino) {

                const inicio = origen.getBoundingClientRect();
                const fin = destino.getBoundingClientRect();

                const origenIzquierdaDeDestino =
                    inicio.left < fin.left;

                let x1;
                let x2;

                if (origenIzquierdaDeDestino) {

                    // BORDE DERECHO DEL PRIMER NIVEL
                    x1 = inicio.right - areaRect.left;

                    // BORDE IZQUIERDO DEL SEGUNDO
                    x2 = fin.left - areaRect.left;

                } else {

                    // BORDE IZQUIERDO DEL PRIMER NIVEL
                    x1 = inicio.left - areaRect.left;

                    // BORDE DERECHO DEL SEGUNDO
                    x2 = fin.right - areaRect.left;
                }

                // CENTRO VERTICAL DE CADA BOTÓN
                const y1 =
                    inicio.top +
                    inicio.height / 2 -
                    areaRect.top;

                const y2 =
                    fin.top +
                    fin.height / 2 -
                    areaRect.top;

                // Punto medio horizontal
                const mitad = (x1 + x2) / 2;

                return `
                    M ${x1} ${y1}
                    C ${mitad} ${y1},
                      ${mitad} ${y2},
                      ${x2} ${y2}
                `;
            }

            setLineas([
                conectar(nivel1Ref.current, nivel2Ref.current),
                conectar(nivel2Ref.current, nivel3Ref.current),
                conectar(nivel3Ref.current, nivel4Ref.current),
            ]);
        }

        calcularLineas();

        window.addEventListener("resize", calcularLineas);

        return () => {
            window.removeEventListener("resize", calcularLineas);
        };

    }, []);


    return (
        <main className="pantalla-niveles">

            <img
                className="fondo-niveles"
                src={fondoNiveles}
                alt=""
            />


            <div className="titulo-recorrido">
                <h1>TU RECORRIDO, {nombre}</h1>
            </div>


            <div
                className="area-recorrido"
                ref={areaRef}
            >

                <svg className="lineas-recorrido">

                    {lineas.map((linea, index) => (
    <g key={index}>

        <path
            className="resguardo-linea"
            d={linea}
        />

        <path
            className="conexion-linea"
            d={linea}
        />

    </g>
))}

                </svg>


                <div className="nivel-posicion nivel-1">
                    <NivelMapa
                        ref={nivel1Ref}
                        numero="1"
                        estado={estadoNivel(1, progreso)}
                        accion={() => alJugarNivel(1)}
                    />
                </div>


                <div className="nivel-posicion nivel-2">
                    <NivelMapa
                        ref={nivel2Ref}
                        numero="2"
                        estado={estadoNivel(2, progreso)}
                        accion={() => alJugarNivel(2)}
                    />
                </div>


                <div className="nivel-posicion nivel-3">
                    <NivelMapa
                        ref={nivel3Ref}
                        numero="3"
                        estado={estadoNivel(3, progreso)}
                        accion={() => alJugarNivel(3)}
                    />
                </div>


                <div className="nivel-posicion nivel-4">
                    <NivelMapa
                        ref={nivel4Ref}
                        numero="4"
                        estado={estadoNivel(4, progreso)}
                        accion={() => alJugarNivel(4)}
                    />
                </div>

            </div>

        </main>
    );
}

export default Niveles;