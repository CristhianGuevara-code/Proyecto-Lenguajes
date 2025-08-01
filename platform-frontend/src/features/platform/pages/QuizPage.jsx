import preguntas from "../components/quiz/preguntas";
import lectura from "../components/quiz/lectura"; // objeto con titulo y contenido
import { useEffect, useState } from "react";

function QuizPage() {
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [puntuación, setPuntuación] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(10);
  const [areDisabled, setAreDisabled] = useState(false);
  const [answersShown, setAnswersShown] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  function handleAnswerSubmit(isCorrect, e) {
    if (!hasStarted) setHasStarted(true);
    if (isCorrect) setPuntuación((prev) => prev + 1);
    e.target.classList.add(isCorrect ? "correct" : "incorrect");

    setTimeout(() => {
      if (preguntaActual === preguntas.length - 1) {
        setIsFinished(true);
      } else {
        setPreguntaActual((prev) => prev + 1);
        setTiempoRestante(10);
        setAreDisabled(false);
      }
    }, 1500);
  }

  useEffect(() => {
    if (!hasStarted) return;
    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev > 0) return prev - 1;
        else {
          setAreDisabled(true);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [hasStarted, tiempoRestante]);

  if (isFinished)
    return (
      <main
        className="app"
        style={{
          width: "100vw",
          padding: "1rem",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "white",
          minHeight: "100vh",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div className="juego-terminado">
          <span style={{ fontSize: "1.5rem", marginBottom: "1rem", display: "block" }}>
            Obtuviste {puntuación} de {preguntas.length}
          </span>
          <button
            onClick={() => (window.location.href = "/quiz")}
            style={{ marginBottom: "0.5rem", padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Volver a jugar
          </button>
          <button
            onClick={() => {
              setIsFinished(false);
              setAnswersShown(true);
              setPreguntaActual(0);
            }}
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Ver respuestas
          </button>
        </div>
      </main>
    );

  if (answersShown)
    return (
      <main
        className="app"
        style={{
          width: "100vw",
          padding: "1rem",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "white",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "900px", width: "100%" }}>
          <div className="numero-pregunta" style={{ marginBottom: "0.5rem" }}>
            <span> Pregunta {preguntaActual + 1} de</span> {preguntas.length}
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
                window.location.href = "/quiz";
              } else {
                setPreguntaActual((prev) => prev + 1);
              }
            }}
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            {preguntaActual === preguntas.length - 1
              ? "Volver a jugar"
              : "Siguiente"}
          </button>
        </div>
      </main>
    );

  return (
    <main
      className="app"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        padding: "1rem",
        boxSizing: "border-box",
        color: "white",
        minHeight: "100vh",
      }}
    >
      {/* Lectura */}
      <section
        className="lectura"
        style={{
          maxWidth: "900px",
          width: "100%",
          marginBottom: "2rem",
          textAlign: "justify",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>{lectura.titulo}</h1>
        {lectura.contenido
          .trim()
          .split("\n\n")
          .map((p, i) => (
            <p key={i} style={{ marginBottom: "1rem" }}>
              {p.trim()}
            </p>
          ))}
      </section>

      {/* Título separador */}
      <h2
        style={{
          marginBottom: "1rem",
          textAlign: "center",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        Hora de responder las preguntas
      </h2>

      {/* Quiz */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "900px",
          gap: "1.5rem",
        }}
      >
        {/* Parte pregunta + temporizador */}
        <div className="lado-izquierdo" style={{ width: "100%" }}>
          <div className="numero-pregunta" style={{ marginBottom: "0.5rem" }}>
            <span className="text-xl"> Pregunta {preguntaActual + 1} de</span> {preguntas.length}
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
            ) : (
              <button
                onClick={() => {
                  setTiempoRestante(10);
                  setAreDisabled(false);
                  if (preguntaActual === preguntas.length - 1) {
                    setIsFinished(true);
                  } else {
                    setPreguntaActual((prev) => prev + 1);
                  }
                }}
                style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
              >
                Continuar
              </button>
            )}
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
              style={{
                padding: "0.75rem",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              {respuesta.textoRespuesta}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default QuizPage;
