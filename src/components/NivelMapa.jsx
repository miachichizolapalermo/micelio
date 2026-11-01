import { forwardRef } from "react";

const NivelMapa = forwardRef(function NivelMapa(
    { numero, estado, accion },
    ref
) {
    function manejarClick() {
        if (estado !== "bloqueado" && accion) {
            accion();
        }
    }

    return (
        <button
            ref={ref}
            className={`nivel-mapa ${estado}`}
            onClick={manejarClick}
            disabled={estado === "bloqueado"}
        >
            Nivel {numero}
        </button>
    );
});

export default NivelMapa;