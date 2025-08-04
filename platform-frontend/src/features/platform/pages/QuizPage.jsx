import { useEffect, useState } from "react";
import lectura1 from "../components/quiz/lectura";
import lectura2 from "../components/quiz/lectura2";
import lectura3 from "../components/quiz/lectura3";

import preguntas1 from "../components/quiz/preguntas";
import preguntas2 from "../components/quiz/preguntas2";
import preguntas3 from "../components/quiz/preguntas3";

const lecturas = [lectura1, lectura2, lectura3];
const preguntasSet = [preguntas1, preguntas2, preguntas3];

function QuizPage() {
  const [cuentoActual, setCuentoActual] = useState(0);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [puntuacion, setPuntuacion] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(10);
  const [areDisabled, setAreDisabled] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [answersShown, setAnswersShown] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const preguntas = preguntasSet[cuentoActual];
  const lectura = lecturas[cuentoActual];

  function handleAnswerSubmit(isCorrect, e) {
    if (!hasStarted) setHasStarted(true);
    if (areDisabled) return;

    if (isCorrect) setPuntuacion((prev) => prev + 1);
    e.target.classList.add(isCorrect ? "correct" : "incorrect");

    setAreDisabled(true);
    setShowContinueButton(false);

    setTimeout(() => {
      if (preguntaActual === preguntas.length - 1) {
        setIsFinished(true);
      } else {
        setPreguntaActual((prev) => prev + 1);
        setTiempoRestante(10);
        setAreDisabled(false);
        setShowContinueButton(false);
      }
    }, 1500);
  }

  useEffect(() => {
    if (!hasStarted) return;
    if (areDisabled) return;

    if (tiempoRestante === 0) {
      setAreDisabled(true);
      setShowContinueButton(true);
      return;
    }

    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalo);
  }, [hasStarted, tiempoRestante, areDisabled]);

  function cambiarCuento(nuevoIndice) {
    setCuentoActual(nuevoIndice);
    setPreguntaActual(0);
    setPuntuacion(0);
    setIsFinished(false);
    setTiempoRestante(10);
    setAreDisabled(false);
    setShowContinueButton(false);
    setAnswersShown(false);
    setHasStarted(false);
  }

  function renderPaginacion() {
    return (
      <>
        <button
          disabled={cuentoActual === 0}
          onClick={() => cambiarCuento(cuentoActual - 1)}
          className="btn-paginacion"
        >
          Anterior
        </button>

        {[0, 1, 2].map((num) => (
          <button
            key={num}
            onClick={() => cambiarCuento(num)}
            className={`btn-paginacion ${cuentoActual === num ? "activo" : ""}`}
          >
            {num + 1}
          </button>
        ))}

        <button
          disabled={cuentoActual === 2}
          onClick={() => cambiarCuento(cuentoActual + 1)}
          className="btn-paginacion"
        >
          Siguiente
        </button>
      </>
    );
  }

  if (isFinished)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 900,
          margin: "2rem auto",
          gap: "1.5rem",
        }}
      >
        <main className="app" style={{ width: "100%" }}>
          <div className="juego-terminado">
            <span className="resultado-texto titulo-separador">
              Obtuviste {puntuacion} de {preguntas.length}
            </span>
            <button onClick={() => cambiarCuento(cuentoActual)} className="btn-juego">
              Volver a jugar
            </button>
            <button
              onClick={() => {
                setIsFinished(false);
                setAnswersShown(true);
                setPreguntaActual(0);
              }}
              className="btn-juego"
            >
              Ver respuestas
            </button>
          </div>
        </main>
        <nav className="paginacion" style={{ width: "100%" }}>
          {renderPaginacion()}
        </nav>
      </div>
    );

  if (answersShown)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: 900,
          margin: "2rem auto",
          gap: "1.5rem",
        }}
      >
        <main className="app" style={{ width: "100%" }}>
          <div style={{ maxWidth: "900px", width: "100%" }}>
            <div className="numero-pregunta" style={{ marginBottom: "0.5rem" }}>
              <span>
                Pregunta {preguntaActual + 1} de {preguntas.length}
              </span>
            </div>
            <div className="titulo-pregunta" style={{ marginBottom: "1rem" }}>
              {preguntas[preguntaActual].titulo}
            </div>
            <div style={{ marginBottom: "1.5rem", fontWeight: "bold" }}>
              {preguntas[preguntaActual].opciones.find((opcion) => opcion.isCorrect).textoRespuesta}
            </div>
            <button
              onClick={() => {
                if (preguntaActual === preguntas.length - 1) {
                  cambiarCuento(cuentoActual);
                } else {
                  setPreguntaActual((prev) => prev + 1);
                }
              }}
              className="btn-juego"
            >
              {preguntaActual === preguntas.length - 1 ? "Volver a jugar" : "Siguiente"}
            </button>
          </div>
        </main>
        <nav className="paginacion" style={{ width: "100%" }}>
          {renderPaginacion()}
        </nav>
      </div>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 900,
        margin: "2rem auto",
        gap: "1.5rem",
      }}
    >
      <main className="app" style={{ width: "100%" }}>
        {/* Lectura */}
        <section className="lectura">
          <h1>{lectura.titulo}</h1>
          {lectura.contenido
            .trim()
            .split("\n\n")
            .map((p, i) => (
              <p key={i}>{p.trim()}</p>
            ))}
        </section>

        {/* Título separador */}
        <h2 className="titulo-separador">Hora de responder las preguntas</h2>

        {/* Quiz */}
        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "1.5rem" }}>
          {/* Parte pregunta + temporizador */}
          <div className="lado-izquierdo" style={{ width: "100%" }}>
            <div className="numero-pregunta titulo-separador2" style={{ marginBottom: "0.5rem" }}>
              <span className="text-xl">
                Pregunta {preguntaActual + 1} de
              </span >{" "}
              {preguntas.length}
            </div>
            <div className="titulo-pregunta" style={{ marginBottom: "1rem" }}>
              {preguntas[preguntaActual].titulo}
            </div>
            <div>
              {!areDisabled ? (
                hasStarted && <span className="tiempo-restante text-xl">Tiempo restante: {tiempoRestante}</span>
              ) : showContinueButton && preguntaActual !== preguntas.length - 1 ? (
                <button
                  onClick={() => {
                    setTiempoRestante(10);
                    setAreDisabled(false);
                    setShowContinueButton(false);
                    setPreguntaActual((prev) => prev + 1);
                  }}
                  className="btn-juego"
                >
                  Continuar
                </button>
              ) : null}
            </div>
          </div>

          {/* Opciones de respuesta como grid */}
          <div
            className="lado-derecho"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
              width: "100%",
            }}
          >
            {preguntas[preguntaActual].opciones.map((respuesta) => (
              <button
                disabled={areDisabled}
                key={respuesta.textoRespuesta}
                onClick={(e) => handleAnswerSubmit(respuesta.isCorrect, e)}
                className="btn-juego"
                style={{ cursor: areDisabled ? "default" : "pointer" }}
              >
                {respuesta.textoRespuesta}
              </button>
            ))}
          </div>
        </div>
      </main>

      <nav className="paginacion" style={{ width: "100%" }}>
        {renderPaginacion()}
      </nav>
    </div>
  );
}

export default QuizPage;
