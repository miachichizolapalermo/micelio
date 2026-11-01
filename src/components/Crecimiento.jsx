import { useEffect, useState } from "react";

function limitarPorcentaje(porcentaje) {
    return Math.min(Math.max(porcentaje, 0), 100);
}

function Crecimiento({ imagen, porcentaje, porcentajeInicial = 0 }) {

    const porcentajeSeguro = limitarPorcentaje(porcentaje);
    const porcentajeInicialSeguro = limitarPorcentaje(porcentajeInicial);
    const [porcentajeVisual, setPorcentajeVisual] = useState(porcentajeInicialSeguro);

    useEffect(() => {
        const duracion = 2000;
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        let fotograma;

        if (mediaQuery.matches || porcentajeInicialSeguro === porcentajeSeguro) {
            fotograma = window.requestAnimationFrame(() => {
                setPorcentajeVisual(porcentajeSeguro);
            });
            return () => {
                window.cancelAnimationFrame(fotograma);
            };
        }

        let iniciado = false;
        let tiempoInicial;

        function animar(tiempo) {
            if (!iniciado) {
                tiempoInicial = tiempo;
                iniciado = true;
            }

            const progreso = Math.min((tiempo - tiempoInicial) / duracion, 1);
            const suavizado = 1 - Math.pow(1 - progreso, 3);
            const siguientePorcentaje = progreso >= 1
                ? porcentajeSeguro
                : porcentajeInicialSeguro +
                    (porcentajeSeguro - porcentajeInicialSeguro) * suavizado;

            setPorcentajeVisual(siguientePorcentaje);

            if (progreso < 1) {
                fotograma = window.requestAnimationFrame(animar);
            }
        }

        fotograma = window.requestAnimationFrame(animar);

        return () => {
            window.cancelAnimationFrame(fotograma);
        };
    }, [porcentajeInicialSeguro, porcentajeSeguro]);

    const porcentajeFormateado = porcentajeVisual.toLocaleString("es-AR", {
        maximumFractionDigits: 2,
    });

    return (
        <div className="crecimiento">

            <div className="crecimiento-imagen">

                {/* Hongo completo con baja opacidad */}
                <img
                    className="crecimiento-fondo"
                    src={imagen}
                    alt="Crecimiento del fungi"
                />

                {/* Parte que ya creció */}
                <div
                    className="crecimiento-progreso"
                    style={{
                        clipPath: `inset(${100 - porcentajeVisual}% 0 0)`,
                    }}
                >
                    <img
                        className="crecimiento-activo"
                        src={imagen}
                        alt=""
                    />
                </div>

                {/* Línea indicadora */}
                <div
                    className="crecimiento-linea"
                    style={{ bottom: `${porcentajeVisual}%` }}
                >
                    <span>{porcentajeFormateado}%</span>
                </div>

            </div>

        </div>
    );
}

export default Crecimiento;