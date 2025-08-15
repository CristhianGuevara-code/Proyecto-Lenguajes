import { FaPlusCircle, FaTimesCircle, FaEdit, FaTrashAlt, FaPalette, FaFlask, FaCalculator, FaBook, FaGlobeAmericas, FaMusic, FaAtom } from "react-icons/fa";
import { useSubjects } from "../hooks/useSubjects";
import { SubjectModel } from "../../../core/models/subject.model";
import { SubjectResponse } from "../../../infraestructure/interfaces/subject.response";
import { useRef, useState } from "react";

type Palette = { bg: string; text: string; ring: string; accent: string; btn: string };
const PALETTES: Palette[] = [
  { bg: "bg-emerald-50",  text: "text-emerald-800",  ring: "ring-emerald-200",  accent: "bg-emerald-500",  btn: "bg-emerald-600 hover:bg-emerald-700" },
  { bg: "bg-sky-50",      text: "text-sky-800",      ring: "ring-sky-200",      accent: "bg-sky-500",      btn: "bg-sky-600 hover:bg-sky-700" },
  { bg: "bg-amber-50",    text: "text-amber-900",    ring: "ring-amber-200",    accent: "bg-amber-500",    btn: "bg-amber-600 hover:bg-amber-700" },
  { bg: "bg-rose-50",     text: "text-rose-800",     ring: "ring-rose-200",     accent: "bg-rose-500",     btn: "bg-rose-600 hover:bg-rose-700" },
  { bg: "bg-violet-50",   text: "text-violet-800",   ring: "ring-violet-200",   accent: "bg-violet-500",   btn: "bg-violet-600 hover:bg-violet-700" },
  { bg: "bg-lime-50",     text: "text-lime-800",     ring: "ring-lime-200",     accent: "bg-lime-500",     btn: "bg-lime-600 hover:bg-lime-700" },
];

const subjectIcon = (name: string) => {
  const n = (name || "").toLowerCase();
  if (n.includes("mate")) return <FaCalculator />;
  if (n.includes("ciencia") || n.includes("química") || n.includes("fisica") || n.includes("física")) return <FaFlask />;
  if (n.includes("español") || n.includes("lengua")) return <FaBook />;
  if (n.includes("social") || n.includes("hist") || n.includes("cív") || n.includes("civica")) return <FaGlobeAmericas />;
  if (n.includes("música")) return <FaMusic />;
  if (n.includes("tecno") || n.includes("comunic")) return <FaAtom />;
  return <FaBook />;
};

const colorKey = (id: string) => `subjectColor:${id}`;

const getColorIndex = (s: SubjectResponse): number => {
  const saved = localStorage.getItem(colorKey(s.id));
  if (saved) return Number(saved) % PALETTES.length;
  const sum = (s.name || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return sum % PALETTES.length;
};

const setColorIndex = (id: string, idx: number) => {
  localStorage.setItem(colorKey(id), String(idx % PALETTES.length));
};

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
  const [colorVersion, setColorVersion] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert("Debes escribir un nombre");

    if (modoEdicion && formData.id) {
      editSubjectMutation.mutate(
        { ...formData },
        { onSuccess: () => resetForm() }
      );
    } else {
      createSubjectMutation.mutate(
        { name: formData.name },
        { onSuccess: () => resetForm() }
      );
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("¿Deseas eliminar esta asignatura?")) {
      deleteSubjectMutation.mutate(id, { onSuccess: () => resetForm() });
    }
  };

  const handleEdit = (subject: SubjectResponse) => {
  setFormData({ id: subject.id, name: subject.name });
  setModoEdicion(true);

  if (formRef.current) {
    formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });

    // Usamos setTimeout para dar un tiempo de espera antes de aplicar el scroll adicional
    setTimeout(() => {
      window.scrollBy(0, -50);  // Ajusta el valor según necesites
    }, 500); // 500ms de espera antes de hacer el ajuste
  }
};


  const resetForm = () => {
    setFormData({ id: "", name: "" });
    setModoEdicion(false);
    refreshSubjects();
  };

  const subjects = subjectsPaginationQuery.data?.data?.items ?? [];
  const loading = subjectsPaginationQuery.isLoading;

  return (
    <div className="min-h-screen px-6 py-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-platform-bluedark mb-6">Mis asignaturas</h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white shadow-sm ring-1 ring-gray-200 p-5 rounded-2xl"
        ref={formRef} 
        > 
        <h2 className="text-lg font-semibold mb-3">{modoEdicion ? "Editar asignatura" : "Crear nueva asignatura"}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-platform-mintgreen"
              placeholder="Nombre de la asignatura"
              required
            />
          </div>

          <div className="flex gap-3 items-end">
            <button type="submit" className="btn-sm btn-agregar">
              <FaPlusCircle />
              {modoEdicion ? "Guardar" : "Agregar"}
            </button>
            <button type="button" onClick={resetForm} className="btn-sm btn-cancelar">
              <FaTimesCircle />
              Cancelar
            </button>
          </div>
        </div>
      </form>

      {/* Lista de asignaturas */}
      <div className="space-y-4">
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-4 animate-pulse h-32" />
        ))}

        {!loading && subjects.length === 0 && (
          <div className="text-center text-gray-500">Aún no hay asignaturas.</div>
        )}

        {!loading && subjects.map((asig) => {
          const idx = getColorIndex(asig);
          const pal = PALETTES[idx];

          return (
            <div key={asig.id} className={`flex justify-between items-center bg-white p-4 rounded-lg shadow-md ring-1 ${pal.ring}`}>
              {/* Información de la asignatura */}
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${pal.bg} ${pal.text}`}>
                  {subjectIcon(asig.name)}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{asig.name}</h3>
              </div>

              {/* Botones */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleEdit(asig); }}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-platform-darkblue text-white hover:opacity-90"
                >
                  <FaEdit /> Editar
                </button>

                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleDelete(asig.id); }}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700"
                >
                  <FaTrashAlt /> Eliminar
                </button>

                <button
                  type="button"
                  title="Cambiar color"
                  onClick={(e) => {
                    e.stopPropagation();
                    setColorIndex(asig.id, (idx + 1) % PALETTES.length);
                    setColorVersion(v => v + 1); // Forzar re-render
                  }}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-white ${pal.btn}`}
                >
                  <FaPalette />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
