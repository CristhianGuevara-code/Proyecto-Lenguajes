import { useEffect, useState } from "react";

import lectura1 from "../components/quiz/lectura";
import lectura2 from "../components/quiz/lectura2";
import lectura3 from "../components/quiz/lectura3";
import lectura4 from "../components/quiz/lectura4";
import lectura5 from "../components/quiz/lectura5";
import lectura6 from "../components/quiz/lectura6";
import lectura7 from "../components/quiz/lectura7";

import preguntas1 from "../components/quiz/preguntas";
import preguntas2 from "../components/quiz/preguntas2";
import preguntas3 from "../components/quiz/preguntas3";
import preguntas4 from "../components/quiz/preguntas4";
import preguntas5 from "../components/quiz/preguntas5";
import preguntas6 from "../components/quiz/preguntas6";
import preguntas7 from "../components/quiz/preguntas7";

const lecturas = [lectura1, lectura2, lectura3, lectura4, lectura5, lectura6, lectura7];
const preguntasSet = [preguntas1, preguntas2, preguntas3, preguntas4, preguntas5, preguntas6, preguntas7];

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
    if (!hasStarted || areDisabled) return;

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

        {lecturas.map((_, index) => (
          <button
            key={index}
            onClick={() => cambiarCuento(index)}
            className={`btn-paginacion ${cuentoActual === index ? "activo" : ""}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={cuentoActual === lecturas.length - 1}
          onClick={() => cambiarCuento(cuentoActual + 1)}
          className="btn-paginacion"
        >
          Siguiente
        </button>
      </>
    );
  }

  const Contenedor = ({ children }) => (
    <div
      className="contenedor-quiz"
      style={{
        width: "100vw",
        minHeight: "100vh",
        padding: "1rem",
        boxSizing: "border-box",
        backgroundColor: "transparent", 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );

  // Modificar la clase app para ocupar todo el ancho (sin max-width)
  const AppWrapper = ({ children }) => (
    <main
      className="app"
      style={{
        width: "100%",
        maxWidth: "100%",
        borderRadius: "0", // Opcional, si quieres bordes rectos en todo el ancho
        boxShadow: "none", // Opcional: quitar sombra para 100% ancho
        padding: "1rem",
      }}
    >
      {children}
    </main>
  );

  if (isFinished)
    return (
      <Contenedor>
        <AppWrapper>
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
        </AppWrapper>
        <nav className="paginacion">{renderPaginacion()}</nav>
      </Contenedor>
    );

  if (answersShown)
    return (
      <Contenedor>
        <AppWrapper>
          <div style={{ width: "100%" }}>
            <div className="numero-pregunta" style={{ marginBottom: "0.5rem" }}>
              <span>
                Pregunta {preguntaActual + 1} de {preguntas.length}
              </span>
            </div>
            <div className="titulo-pregunta" style={{ marginBottom: "1rem" }}>
              {preguntas[preguntaActual].titulo}
            </div>
            <div style={{ marginBottom: "1.5rem", fontWeight: "bold" }}>
              {
                preguntas[preguntaActual].opciones.find(
                  (opcion) => opcion.isCorrect
                ).textoRespuesta
              }
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
        </AppWrapper>
        <nav className="paginacion">{renderPaginacion()}</nav>
      </Contenedor>
    );

  return (
    <Contenedor>
      <AppWrapper>
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

        <h2 className="titulo-separador">Hora de responder las preguntas</h2>

        {/* Quiz */}
        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "1.5rem" }}>
          {/* Parte pregunta + temporizador */}
          <div className="lado-izquierdo">
            <div className="numero-pregunta titulo-separador2" style={{ marginBottom: "0.5rem" }}>
              <span className="text-xl">
                Pregunta {preguntaActual + 1} de
              </span>{" "}
              {preguntas.length}
            </div>
            <div className="titulo-pregunta" style={{ marginBottom: "1rem" }}>
              {preguntas[preguntaActual].titulo}
            </div>
            <div>
              {!areDisabled ? (
                hasStarted && (
                  <span className="tiempo-restante text-xl">
                    Tiempo restante: {tiempoRestante}
                  </span>
                )
              ) : showContinueButton &&
                preguntaActual !== preguntas.length - 1 ? (
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

          {/* Opciones */}
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
      </AppWrapper>
      <nav className="paginacion">{renderPaginacion()}</nav>
    </Contenedor>
  );
}

export default QuizPage;
