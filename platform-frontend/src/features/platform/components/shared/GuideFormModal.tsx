import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { GuideEditModel } from "../../../../core/models/guide-edit.model";
import { useGuides } from "../../hooks/useGuides";



type Grade = { id: string; name: string };
type Subject = { id: string; name: string };

type Props = {
  open: boolean;
  onClose: () => void;
  guide?: GuideEditModel;
  grades: Grade[];
  subjects: Subject[];
};

export function GuideFormModal({ open, onClose, guide, grades, subjects }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [subjectIds, setSubjectIds] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const { createGuideMutation, editGuideMutation, refreshGuides } = useGuides();

  // Inicializar campos cuando cambia 'guide'
  useEffect(() => {
    if (guide) {
      setTitle(guide.title || "");
      setDescription(guide.description || "");
      setGradeId(guide.gradeId || "");
      setSubjectIds(guide.subjectId ? [guide.subjectId] : []);
      setFile(null);
    } else {
      setTitle("");
      setDescription("");
      setGradeId("");
      setSubjectIds([]);
      setFile(null);
    }
  }, [guide]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación mínima
    if (!title || !gradeId || subjectIds.length === 0) {
      alert("Completá todos los campos requeridos.");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("gradeId", gradeId);
    subjectIds.forEach(id => fd.append("subjectId", id));
    if (file) fd.append("file", file);

    try {
      if (guide?.id) {
        fd.append("id", guide.id);
        await editGuideMutation.mutateAsync(fd as any);
      } else {
        await createGuideMutation.mutateAsync(fd as any);
      }
      refreshGuides();
      onClose();
    } catch (err: any) {
      alert(err.message || "Error al guardar la guía");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-11/12 max-w-2xl mx-auto my-auto flex flex-col overflow-hidden max-h-screen">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold truncate">{guide ? "Editar guía" : "Nueva guía"}</h3>
          <button className="p-2 rounded hover:bg-gray-100" onClick={onClose} aria-label="Cerrar">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3 overflow-y-auto max-h-[70vh]">
          <div>
            <label className="block mb-1 font-medium">Título</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Descripción</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Grado</label>
            <select
              value={gradeId}
              onChange={e => setGradeId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Seleccioná un grado</option>
              {Array.isArray(grades) && grades.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Asignaturas</label>
            <select
              multiple
              value={subjectIds}
              onChange={e => setSubjectIds(Array.from(e.target.selectedOptions, o => o.value))}
              className="w-full border rounded px-3 py-2"
            >
              {Array.isArray(subjects) && subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Archivo</label>
            <input
              type="file"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 border rounded" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-platform-mintgreen text-white rounded hover:opacity-90">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
