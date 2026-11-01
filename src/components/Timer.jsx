function Timer({ segundos = 0 }) {
    const segundosEnteros = Math.floor(segundos);
    const minutos = Math.floor(segundosEnteros / 60);
    const segundosRestantes = segundosEnteros % 60;

    const tiempoFormateado =
        String(minutos).padStart(2, "0") +
        ":" +
        String(segundosRestantes).padStart(2, "0");

    return (
        <div className="timer">
            {tiempoFormateado}
        </div>
    );
}

export default Timer;