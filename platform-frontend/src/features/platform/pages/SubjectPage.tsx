import { useState } from "react";
import { FaPlusCircle, FaTimesCircle, FaEdit, FaTrashAlt } from "react-icons/fa";
import { useSubjects } from "../hooks/useSubjects";
import { SubjectModel } from "../../../core/models/subject.model";
import { SubjectResponse } from "../../../infraestructure/interfaces/subject.response";

export const SubjectPage = () => {
  const {
    subjectsPaginationQuery,
    createSubjectMutation,
    editSubjectMutation,
    deleteSubjectMutation,
    refreshSubjects,
  } = useSubjects();

  const [formData, setFormData] = useState<SubjectModel>({ id: "", name: "" });
  const [modoEdicion, setModoEdicion] = useState(false);
  //const [editId, setEditId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);

    if (!formData.name.trim()) return alert("Debes escribir un nombre");

    if (modoEdicion && formData.id) {
       console.log("Editando...");
       if (!formData.id) {
        alert("No se pudo editar: ID no definido");
        return;
                    }
      editSubjectMutation.mutate(
        {...formData },
        {
          onSuccess: () => {
            resetForm();
          },
        }
      );
    } else {
      console.log("Creando...");
      createSubjectMutation.mutate(
        { name: formData.name },
        {
          onSuccess: () => {
            resetForm();
          },
        }
      );
    }
  };

  const handleDelete = (id: string) => {
  if (window.confirm("¿Deseas eliminar esta asignatura?")) {
    deleteSubjectMutation.mutate(id, {
      onSuccess: () => {
        resetForm();
      },
    });
  }
};


  const handleEdit = (subject: SubjectResponse) => {
    setFormData({ id: subject.id, name: subject.name });
    //setEditId(subject.id);
    setModoEdicion(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData({ id: "", name: "" });
    setModoEdicion(false);
    //setEditId(null);
    refreshSubjects();
  };

  const subjects = subjectsPaginationQuery.data?.data?.items ?? [];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block font-medium mb-1">Nombre:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Nombre de la asignatura"
              required
            />
          </div>

          <div className="flex gap-3 items-end">
            <button type="submit" className="btn-sm btn-agregar">
              <FaPlusCircle />
              {modoEdicion ? "Guardar cambios" : "Agregar"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="btn-sm btn-cancelar"
            >
              <FaTimesCircle />
              Cancelar
            </button>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {subjects.map((asig: SubjectResponse) => (
          <div
            key={asig.id}
            className="w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 bg-white p-4"
          >
            <h2 className="text-xl font-semibold text-gray-800">{asig.name}</h2>

            <div className="flex justify-end gap-2 mt-4">
              <button className="btn-sm btn-editar" onClick={() => handleEdit(asig)}>
                <FaEdit />
                Editar
              </button>

              <button className="btn-sm btn-eliminar" onClick={() => handleDelete(asig.id)}>
                <FaTrashAlt />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


/*
import { useState, useEffect } from "react";
import { FaPlusCircle, FaTimesCircle, FaEdit, FaTrashAlt } from "react-icons/fa";

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
            <FaPlusCircle />
            {modoEdicion ? "Guardar cambios" : "Agregar"}
          </button>

          <button type="button" onClick={resetForm} className="btn-sm btn-cancelar">
            <FaTimesCircle />
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
                  className="btn-sm btn-editar"
                  onClick={() => handleEditar(asig)}
                >
                  <FaEdit />
                  Editar
                </button>

                <button
                  className="btn-sm btn-eliminar"
                  onClick={() => handleDelete(asig.id)}
                >
                  <FaTrashAlt />
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
 


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////77
import { useEffect, useState } from "react";
import { FaPlusCircle, FaTimesCircle, FaEdit, FaTrashAlt } from "react-icons/fa";
//import { useSubjects } from "../../core/hooks/subjects/useSubjects";
//import { SubjectModel } from "../../core/models/subject.model";
import { useSubjects } from "../hooks/useSubjects";
import { SubjectModel } from "../../../core/models/subject.model";

export const HomePage = () => {
  const {
    subjectsPaginationQuery,
    createSubjectMutation,
    editSubjectMutation,
    deleteSubjectMutation,
    refreshSubjects,
  } = useSubjects();

  const [nuevaAsignatura, setNuevaAsignatura] = useState<SubjectModel>({
    name: "",
  });

  const [modoEdicion, setModoEdicion] = useState(false);
  const [asignaturaEditandoId, setAsignaturaEditandoId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevaAsignatura((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevaAsignatura.name) return;

    if (modoEdicion && asignaturaEditandoId) {
      editSubjectMutation.mutate(
        { ...nuevaAsignatura },
        {
          onSuccess: () => {
            resetForm();
          },
        }
      );
    } else {
      createSubjectMutation.mutate(
        { ...nuevaAsignatura },
        {
          onSuccess: () => {
            resetForm();
          },
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    const confirm = window.confirm("¿Seguro que querés eliminar esta asignatura?");
    if (confirm) {
      deleteSubjectMutation.mutate(undefined, {
        onSuccess: () => {
          resetForm();
        },
      });
    }
  };

  const handleEditar = (subject: any) => {
    setNuevaAsignatura({
      name: subject.name,
    });
    setModoEdicion(true);
    setAsignaturaEditandoId(subject.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setNuevaAsignatura({ name: "" });
    setModoEdicion(false);
    setAsignaturaEditandoId(null);
    refreshSubjects();
  };

  const subjects = subjectsPaginationQuery.data?.data?.items || [];

  return (
    <div className="p-6 bg-transparent min-h-screen">
      <h1 className="text-3xl font-bold text-platform-bluedark mb-6">
        Mis asignaturas:
      </h1>

      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md p-6 rounded-xl w-full">
        <h2 className="text-xl font-semibold mb-4">
          {modoEdicion ? "Editar asignatura" : "Crear nueva asignatura:"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="col-span-2">
            <label className="block font-medium mb-1">Nombre:</label>
            <input
              type="text"
              name="name"
              value={nuevaAsignatura.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              placeholder="Nombre de la asignatura"
              required
            />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button type="submit" className="btn-sm btn-agregar">
            <FaPlusCircle />
            {modoEdicion ? "Guardar cambios" : "Agregar"}
          </button>

          <button type="button" onClick={resetForm} className="btn-sm btn-cancelar">
            <FaTimesCircle />
            Cancelar
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {subjects.map((asig) => (
          <div
            key={asig.id}
            className="w-full rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition duration-300"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{asig.name}</h2>
              <div className="flex justify-end gap-2 mt-4">
                <button className="btn-sm btn-editar" onClick={() => handleEditar(asig)}>
                  <FaEdit />
                  Editar
                </button>
                <button className="btn-sm btn-eliminar" onClick={() => handleDelete(asig.id)}>
                  <FaTrashAlt />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};*/
