import { useState } from "react";

import Fungi from "../components/Fungi";
import Boton from "../components/Boton";

import melena from "../assets/melena.png";
import reishi from "../assets/reishi.png";
import cordyceps from "../assets/cordyceps.png";

import "../styles/seleccionFungi.css";

function SeleccionFungi({ alComenzar }) {

    const [nombre, setNombre] = useState("");
    const [fungiSeleccionado, setFungiSeleccionado] = useState(null);

    function comenzarJuego() {
    if (nombre.trim() && fungiSeleccionado) {
        alComenzar(nombre.trim(), fungiSeleccionado);
    }
}

    return (
        <main className="pantalla-seleccion">

            <h1>ELEGÍ TU FUNGI</h1>

            <input
                className="input-nombre"
                type="text"
                placeholder="NOMBRE"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />

            <div className="selector-fungis">

                <Fungi
                    nombre="MELENA DE LEÓN"
                    imagen={melena}
                    seleccionado={fungiSeleccionado === "melena"}
                    alSeleccionar={() => setFungiSeleccionado("melena")}
                />

                <Fungi
                    nombre="REISHI"
                    imagen={reishi}
                    seleccionado={fungiSeleccionado === "reishi"}
                    alSeleccionar={() => setFungiSeleccionado("reishi")}
                />

                <Fungi
                    nombre="CORDYCEPS"
                    imagen={cordyceps}
                    seleccionado={fungiSeleccionado === "cordyceps"}
                    alSeleccionar={() => setFungiSeleccionado("cordyceps")}
                />

            </div>

            <Boton
                texto="COMENZAR"
                accion={comenzarJuego}
            />

        </main>
    );
}

export default SeleccionFungi;