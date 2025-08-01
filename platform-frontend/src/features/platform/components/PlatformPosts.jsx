export const PlatformPosts = () => {
  return (
    <div className="w-full lg:w-8/12">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-platform-darkblue md:text-2xl">
          Ultimas asignaciones:
        </h1>
        <div>
          <select className="w-full font-bold text-platform-darkblue border-gray-300 rounded-sm" name="" id="">
            <option value="">Mostrar todas</option>
            <option value="">Pendientes</option>
          </select>
        </div>
      </div>
      <div className="mt-6">
        {/* Inicio de tarea #1 */}
        <div className="max-w-4xl px-10 py-6 mx-auto bg-platform-lightcream rounded-lg shadow-md mb-5">
          <div className="flex items-center justify-between">
            <span className="font-light text-gray-600">
              Fecha de entrega: 12 de Agosto de 2025
            </span>
            <div className="flex gap-1">
            </div>
          </div>
          <div className="mt-2">
            <a href="#">Mi Diario de Aventuras</a>
            <p className="mt--2 text-gray-600">
             Escribe un pequeño diario contando qué hiciste hoy o esta semana. Usa al menos 5 oraciones y 
             dibuja una imagen sobre tu día favorito. Puedes usar lápices de colores o crayones. ¡No olvides 
             escribir la fecha!
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <a
                href="#"
                className="px-2 py-1 font-bold text-platform-darkblue bg-platform-softyellow rounded hover:bg-platform-mintgreen"
              >
                Descargar ejemplo
              </a>
            <div>
              <a href="#" className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1664382953518-4a664ab8a8c9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Avatar"
                  className="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
                />
                <h3 className="font-bold text-sm text-gray-600 hover:underline">
                  Profesora: Ana Maria Garcia
                </h3>
              </a>
            </div>
          </div>
        </div>
        {/* Fin de tarea #1 */}

        {/* Inicio de tarea #2 */}
        <div className="max-w-4xl px-10 py-6 mx-auto bg-platform-lightcream rounded-lg shadow-md mb-5">
          <div className="flex items-center justify-between">
            <span className="font-light text-gray-600">
              Fecha de entrega: 13 de Agosto de 2025
            </span>
            <div className="flex gap-1">
            </div>
          </div>
          <div className="mt-2">
            <a href="#">Busca y Encuentra Palabras</a>
            <p className="mt--2 text-gray-600">
              Te dejaremos una sopa de letras con palabras relacionadas a los animales 
              (gato, perro, jirafa, pez, etc.). Encuentra todas las palabras escondidas y 
              márcalas con un color. Luego, escribe 2 oraciones usando algunas de esas palabras.
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <a
                href="#"
                className="px-2 py-1 font-bold text-platform-darkblue bg-platform-softyellow rounded hover:bg-platform-mintgreen"
              >
                Descargar ejemplo
              </a>
            <div>
              <a href="#" className="flex items-center">
                <img
                  src="https://plus.unsplash.com/premium_photo-1683140840845-073fa9638261?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Avatar"
                  className="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
                />
                <h3 className="font-bold text-sm text-gray-600 hover:underline">
                  Profesor: Miguel Adolfo Lopez
                </h3>
              </a>
            </div>
          </div>
        </div>
        {/* Fin de tarea #2 */}

        {/* Inicio de tarea #3 */}
        <div className="max-w-4xl px-10 py-6 mx-auto bg-platform-lightcream rounded-lg shadow-md mb-5">
          <div className="flex items-center justify-between">
            <span className="font-light text-gray-600">
              Fecha de entrega: 14 de Agosto de 2025
            </span>
            <div className="flex gap-1">
            </div>
          </div>
          <div className="mt-2">
            <a href="#">Diseña tu Escuela Ideal</a>
            <p className="mt--2 text-gray-600">
              Imagina cómo sería tu escuela perfecta. Dibuja cómo se vería y escribe 3 cosas que tendría 
              (por ejemplo: un parque grande, pizarras mágicas, una sala de juegos). Puedes hacerlo en 
              una hoja aparte.
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <a
                href="#"
                className="px-2 py-1 font-bold text-platform-darkblue bg-platform-softyellow rounded hover:bg-platform-mintgreen"
              >
                Descargar ejemplo
              </a>
            <div>
              <a href="#" className="flex items-center">
                <img
                  src="https://plus.unsplash.com/premium_photo-1714340369412-cc7a0f4d0595?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Avatar"
                  className="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
                />
                <h3 className="font-bold text-sm text-gray-600 hover:underline">
                  Profesor: Sergio Antonio Nuñez
                </h3>
              </a>
            </div>
          </div>
        </div>
        {/* Fin de tarea #3 */}

        {/* Inicio de tarea #4 */}
        <div className="max-w-4xl px-10 py-6 mx-auto bg-platform-lightcream rounded-lg shadow-md mb-5">
          <div className="flex items-center justify-between">
            <span className="font-light text-gray-600">
              Fecha de Entrega: 15 de Agosto de 2025
            </span>
            <div className="flex gap-1">
            </div>
          </div>
          <div className="mt-2">
            <a href="#">Problemas Matemáticos del Hogar</a>
            <p className="mt--2 text-gray-600">
              En el PDF encontrarás 4 problemas matemáticos con objetos de casa. Por ejemplo: 
              "Si tengo 3 manzanas y compro 2 más, ¿cuántas tengo en total?" Resuélvelos paso a 
              paso y escribe las respuestas. Usa dibujos si lo necesitas.
            </p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <a
                href="#"
                className="px-2 py-1 font-bold text-platform-darkblue bg-platform-softyellow rounded hover:bg-platform-mintgreen"
              >
                Descargar ejemplo
              </a>
            <div>
              <a href="#" className="flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Avatar"
                  className="hidden object-cover w-10 h-10 mx-4 rounded-full sm:block"
                />
                <h3 className="font-bold text-sm text-gray-600 hover:underline">
                  Profesor: Sadith Leonardo Gomez
                </h3>
              </a>
            </div>
          </div>
        </div>
        {/* Fin de tarea #4 */}

        {/* manejo de orden de tareas */}
        <div className="mt-8">
          <div className="flex">
            <a
              href="#"
              className="px-3 py-2 mx-1 font-bold bg-white text-platform-darkblue rounded-md cursor-not-allowed"
            >
              Regresar
            </a>
            <a
              href="#"
              className="px-3 py-2 mx-1 font-bold rounded-md text-platform-darkblue hover:bg-platform-softyellow hover:text-white"
            >
              1
            </a>
            <a
              href="#"
              className="px-3 py-2 mx-1 font-bold rounded-md text-platform-darkblue hover:bg-platform-softyellow hover:text-white"
            >
              2
            </a>
            <a
              href="#"
              className="px-3 py-2 mx-1 font-bold rounded-md text-platform-darkblue hover:bg-platform-softyellow hover:text-white"
            >
              3
            </a>
            <a
              href="#"
              className="px-3 py-2 mx-1 font-bold rounded-md text-platform-darkblue hover:bg-platform-softyellow hover:text-white"
            >
              4
            </a>
            <a
              href="#"
              className="px-3 py-2 mx-1 font-bold rounded-md text-platform-darkblue hover:bg-platform-softyellow hover:text-white"
            >
              5
            </a>
            <a
              href="#"
              className="px-3 py-2 mx-1 font-bold rounded-md text-platform-darkblue hover:bg-platform-softyellow hover:text-white"
            >
              Siguiente
            </a>
          </div>
        </div>
        {/* fin de orden de tareas */}
      </div>
    </div>
  );
};
