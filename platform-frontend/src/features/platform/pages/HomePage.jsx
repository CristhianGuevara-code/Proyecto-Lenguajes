import { useState, useEffect } from "react";

export const HomePage = () => {
  const [asignaturas, setAsignaturas] = useState(() => {
    const dataGuardada = localStorage.getItem("asignaturas");
    return dataGuardada ? JSON.parse(dataGuardada) : [];
  });

  const [nuevaAsignatura, setNuevaAsignatura] = useState({
    titulo: "",
    imagenUrl: "",
    imagenFile: null,
    color: "#bae6fd",
  });

  const [modoEdicion, setModoEdicion] = useState(false);
  const [asignaturaEditando, setAsignaturaEditando] = useState(null);

  useEffect(() => {
    localStorage.setItem("asignaturas", JSON.stringify(asignaturas));
  }, [asignaturas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaAsignatura({
      ...nuevaAsignatura,
      [name]: value,
    });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64Image = await convertToBase64(file);
      setNuevaAsignatura({
        ...nuevaAsignatura,
        imagenUrl: base64Image,
        imagenFile: file,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevaAsignatura.titulo || !nuevaAsignatura.imagenUrl) return;

    if (modoEdicion && asignaturaEditando) {
      const actualizadas = asignaturas.map((asig) =>
        asig.id === asignaturaEditando.id
          ? {
              ...asig,
              titulo: nuevaAsignatura.titulo,
              imagen: nuevaAsignatura.imagenUrl,
              color: nuevaAsignatura.color,
            }
          : asig
      );
      setAsignaturas(actualizadas);
      setModoEdicion(false);
      setAsignaturaEditando(null);
    } else {
      const nueva = {
        id: Date.now(),
        titulo: nuevaAsignatura.titulo,
        imagen: nuevaAsignatura.imagenUrl,
        color: nuevaAsignatura.color,
      };
      setAsignaturas([...asignaturas, nueva]);
    }
    resetForm();
  };

  const resetForm = () => {
    setNuevaAsignatura({
      titulo: "",
      imagenUrl: "",
      imagenFile: null,
      color: "#bae6fd",
    });
    setModoEdicion(false);
    setAsignaturaEditando(null);
  };

  const handleDelete = (id) => {
    const confirm = window.confirm(
      "¿Estás seguro de que deseas eliminar esta asignatura? Esta acción es permanente y todos los archivos relacionados se perderán para siempre."
    );
    if (confirm) {
      setAsignaturas(asignaturas.filter((a) => a.id !== id));
      if (modoEdicion && asignaturaEditando?.id === id) {
        resetForm();
      }
    }
  };

  const handleEditar = (asig) => {
    setNuevaAsignatura({
      titulo: asig.titulo,
      imagenUrl: asig.imagen,
      imagenFile: null,
      color: asig.color,
    });
    setModoEdicion(true);
    setAsignaturaEditando(asig);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 bg-transparent min-h-screen">
      <h1 className="text-3xl font-bold text-platform-bluedark mb-6">
        Mis asignaturas:
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white shadow-md p-6 rounded-xl w-full"
      >
        <h2 className="text-xl font-semibold mb-4">
          {modoEdicion ? "Editar asignatura" : "Crear nueva asignatura:"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block font-medium mb-1">Nombre:</label>
            <input
              type="text"
              name="titulo"
              value={nuevaAsignatura.titulo}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Nombre de la asignatura"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Pegue una URL de imagen:</label>
            <input
              type="text"
              name="imagenUrl"
              value={nuevaAsignatura.imagenUrl}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Pega una URL o sube archivo"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">O Puede elegir una imagen:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Color de la asignatura:</label>
            <input
              type="color"
              name="color"
              value={nuevaAsignatura.color}
              onChange={handleChange}
              className="w-full h-10 rounded cursor-pointer"
            />
          </div>
        </div>

        {nuevaAsignatura.imagenUrl && (
          <div className="mt-4">
            <p className="font-medium mb-1">Vista previa:</p>
            <img
              src={nuevaAsignatura.imagenUrl}
              alt="Vista previa"
              className="w-full max-w-sm h-40 object-cover rounded-lg shadow"
            />
          </div>
        )}

        <div className="mt-4 flex gap-3">
          <button type="submit" className="btn-sm btn-agregar">
            {modoEdicion ? "Guardar cambios" : "Agregar"}
          </button>

          <button type="button" onClick={resetForm} className="btn-sm btn-cancelar">
            Cancelar
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {asignaturas.map((asig) => (
          <div
            key={asig.id}
            className="w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
            style={{ backgroundColor: asig.color }}
          >
            <img
              className="w-full h-40 object-cover"
              src={asig.imagen}
              alt={asig.titulo}
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{asig.titulo}</h2>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="btn-card btn-editar"
                  onClick={() => handleEditar(asig)}
                >
                  Editar
                </button>

                <button
                  className="btn-card btn-eliminar"
                  onClick={() => handleDelete(asig.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
