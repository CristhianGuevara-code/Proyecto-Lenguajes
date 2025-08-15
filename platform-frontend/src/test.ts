// src/test.ts

import { authEduRuralApi } from "./core/api/auth.edurural.api";

authEduRuralApi.get('/guides')
  .then(res => console.log(res.data))
  .catch(err => console.error('Error al conectar:', err));
/*import { useEffect, useMemo, useState } from "react";
import { FaDownload, FaEdit, FaTrashAlt, FaPlus, FaSearch, FaEye, FaTimes } from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";
import { Role } from "../../../infraestructure/enums/role.enum";
import { useGuides } from "../hooks/useGuides";
import { eduRuralApi } from "../../../core/api/edurural.api";
import { fetchGuideBlob } from "../utils/fetch-guide-blob";
import { deleteGuideAction } from "../../../core/actions/guides/delete-guide.action";
import { editGuideAction } from "../../../core/actions/guides/edit-guide.action";
import { createGuideAction } from "../../../core/actions/guides/create-guide.action";

// Tipos mínimos (ajusta si ya los tienes tipados en otro lado)
type GuideRow = {
  id: string;
  title: string;
  description: string;
  filePath: string;   // ej: /uploads/guides/xxxxx.pdf
  uploadDate: string; // ISO
  gradeName?: string;
  subjectName?: string;
  uploadedByName?: string;
};

// --------------------------- Modal de Vista Previa ---------------------------
function PreviewGuideModal({
  guideId,
  title,
  open,
  onClose,
}: {
  guideId: string;
  title: string;
  open: boolean;
  onClose: () => void;
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let revoke: string | null = null;

    async function load() {
      if (!open) return;
      setLoading(true);
      setErr(null);
      try {
        const blob = await fetchGuideBlob(guideId); // ← esto pasa por el SW y queda cacheado
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        revoke = url;
      } catch (e: any) {
        setErr(e?.message || "No se pudo cargar el archivo.");
      } finally {
        setLoading(false);
      }
    }
    load();

    return () => {
      if (revoke) URL.revokeObjectURL(revoke);
      setBlobUrl(null);
    };
  }, [guideId, open]);

  if (!open) return null;

  // Handler para enviar el formulario
  const handleDownload = async () => {
    try {
      if (blobUrl) {
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${title || "guia"}`; // si quieres, añade extensión
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const blob = await fetchGuideBlob(guideId);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title || "guia"}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } catch {
      alert("No se pudo descargar el archivo.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-11/12 max-w-4xl mx-auto my-auto flex flex-col overflow-hidden max-h-screen">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold truncate">{title || "Vista previa"}</h3>
          <button className="p-2 rounded hover:bg-gray-100" onClick={onClose} aria-label="Cerrar">
            <FaTimes />
          </button>
        </div>

        <div className="p-3 overflow-y-auto h-72 sm:h-80 md:h-96">
          {loading && <div className="text-center text-gray-500">Cargando…</div>}
          {err && <div className="text-center text-red-600">{err}</div>}
          {!loading && !err && blobUrl && (
            <iframe title="preview" src={blobUrl} className="w-full h-full border rounded" />
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t">
          <button type="button" className="px-4 py-2 rounded border" onClick={onClose}>
            Cerrar
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded bg-platform-mintgreen text-white hover:opacity-90 inline-flex items-center gap-2"
            onClick={handleDownload}
          >
            <FaDownload /> Descargar
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------- Página --------------------------------
export default function GuidesPage() {
  const { roles } = useAuthStore();
  const isTeacher = roles?.includes(Role.PROFESOR);
  const isAdmin = roles?.includes(Role.ADMIN);
  const canManage = isTeacher || isAdmin;

  // hooks de datos
  const {
    guidesPaginationQuery,
    page,
    pageSize,
    setPage,
    setPageSize,
    searchTerm,
    setSearchTerm,
    refreshGuides,
  } = useGuides();

  // dataset
  const dataset = guidesPaginationQuery.data?.data;
  const rows: GuideRow[] = dataset?.items ?? [];
  const cur = dataset?.currentPage ?? 1;
  const totalPages = dataset?.totalPages ?? 1;
  const totalItems = dataset?.totalItems ?? 0;

  // búsqueda local
  const [queryText, setQueryText] = useState("");
  useEffect(() => {
    setSearchTerm(queryText);
    setPage(1);
  }, [queryText, setSearchTerm, setPage]);

  // modal preview
  const [preview, setPreview] = useState<{ id: string; title: string } | null>(null);

  const [openModal, setOpenModal] = useState(false); // Estado para abrir/cerrar el modal
  const [modoEdicion, setModoEdicion] = useState(false); // Para saber si es creación o edición

  // Estado de formulario
 const [form, setForm] = useState<{
  id: string;
  title: string;
  description: string;
  gradeId: string;
  subjectId: string;
  file: File | null;  // Cambié el tipo de `file` a `File | null`
}>({
  id: "",
  title: "",
  description: "",
  gradeId: "",
  subjectId: "",
  file: null,
});

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm(p => ({ ...p, file }));
  };

  const openCreate = () => {
    setForm({
      id: "",
      title: "",
      description: "",
      gradeId: "",
      subjectId: "",
      file: null,
    });
    setModoEdicion(false);  // No estamos en edición, es creación
    setOpenModal(true);  // Abre el modal de creación
  };

  const openEdit = (g: GuideRow) => {
    setForm({
      id: g.id,
      title: g.title,
      description: g.description,
      gradeId: g.gradeName ?? "",
      subjectId: g.subjectName ?? "",
      file: null,  // Aquí puedes manejar el archivo si quieres cambiarlo
    });
    setModoEdicion(true);  // Estamos en modo edición
    setOpenModal(true);  // Abre el modal de edición
  };

  const onDelete = async (id: string) => {
    if (!canManage) return;
    if (!confirm("¿Eliminar esta guía?")) return;
    try {
      const response = await deleteGuideAction(id);
      if (response.status) {
        refreshGuides();
        alert("Guía eliminada correctamente.");
      } else {
        alert(response.message ?? "No se pudo eliminar la guía.");
      }
    } catch (err: any) {
      alert(err?.message ?? "Ocurrió un error al eliminar.");
    }
  };

  const loadingList = guidesPaginationQuery.isLoading;

  // Función de envío del formulario (Crear/Editar)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.title || !form.gradeId || !form.subjectId) {
    alert("Por favor completa todos los campos requeridos.");
    return;
  }

  try {
    // Si no se ha seleccionado un archivo, creamos un archivo vacío
    const file = form.file ?? new File([], ""); // Creamos un archivo vacío

    const payload = {
      title: form.title,
      description: form.description,
      gradeId: form.gradeId,
      subjectId: form.subjectId,
      file, // Ahora `file` nunca será `undefined`
    };

    if (modoEdicion) {
      const editPayload = { ...payload, id: form.id };

      const response = await editGuideAction(editPayload);
      if (response.status) {
        alert("Guía editada con éxito.");
      } else {
        alert(response.message ?? "No se pudo editar la guía.");
      }
    } else {
      const response = await createGuideAction(payload);
      if (response.status) {
        alert("Guía creada con éxito.");
      } else {
        alert(response.message ?? "No se pudo crear la guía.");
      }
    }

    setOpenModal(false);  // Cierra el modal
    refreshGuides();  // Refresca las guías
  } catch (err: any) {
    alert(err?.message ?? "Error al procesar la guía.");
  }
};





  return (
    <div className="p-6 space-y-4">
      {/* Header *
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-platform-darkblue">Guías</h1>
          <p className="text-sm text-gray-600">
            {totalItems} registro{totalItems === 1 ? "" : "s"} • página {cur} de {totalPages}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
            <input
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Buscar por título…"
              className="pl-9 pr-3 py-2 border rounded-lg w-64"
            />
          </div>

          {canManage && (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-platform-mintgreen text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              <FaPlus /> Nueva guía
            </button>
          )}
        </div>
      </div>

      {/* Tabla desktop *
      <div className="hidden md:block rounded-xl border bg-white shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="text-left px-4 py-3">Título</th>
              <th className="text-left px-4 py-3">Grado</th>
              <th className="text-left px-4 py-3">Asignatura</th>
              <th className="text-left px-4 py-3">Subido por</th>
              <th className="text-left px-4 py-3">Fecha</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((g) => (
              <tr key={g.id} className="border-t">
                <td className="px-4 py-3">{g.title}</td>
                <td className="px-4 py-3">{g.gradeName ?? "-"}</td>
                <td className="px-4 py-3">{(g as any).subjectName ?? "-"}</td>
                <td className="px-4 py-3">{g.uploadedByName ?? "-"}</td>
                <td className="px-4 py-3">{(g.uploadDate ?? "").slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {/* Botón VER (abre modal y cachea vía SW) *
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded border inline-flex items-center gap-2 hover:bg-gray-50"
                      onClick={() => setPreview({ id: g.id, title: g.title })}
                    >
                      <FaEye /> Ver
                    </button>

                    {canManage && (
                      <>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded border inline-flex items-center gap-2 hover:bg-gray-50"
                          onClick={() => openEdit(g)}
                        >
                          <FaEdit /> Editar
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded border border-red-300 text-red-600 inline-flex items-center gap-2 hover:bg-red-50"
                          onClick={() => onDelete(g.id)}
                        >
                          <FaTrashAlt /> Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de creación/edición *
      {openModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-11/12 max-w-4xl mx-auto my-auto flex flex-col overflow-hidden max-h-screen">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold">{modoEdicion ? "Editar guía" : "Nueva guía"}</h3>
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setOpenModal(false)} // Cierra el modal
                aria-label="Cerrar"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Título</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={form.title}
                    onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Ej: Guía de Ciencias"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Grado</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={form.gradeId}
                    onChange={(e) => setForm(p => ({ ...p, gradeId: e.target.value }))}
                  >
                    <option value="">— Selecciona —</option>
                    {/* Aquí deberías cargar los grados *
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Asignatura</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={form.subjectId}
                    onChange={(e) => setForm(p => ({ ...p, subjectId: e.target.value }))}
                  >
                    <option value="">— Selecciona —</option>
                    {/* Aquí deberías cargar las asignaturas *
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Descripción</label>
                  <textarea
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Opcional"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Archivo</label>
                  <input
                    type="file"
                    className="w-full border rounded px-3 py-2"
                    onChange={onFileChange}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="px-4 py-2 rounded border" onClick={() => setOpenModal(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-platform-mintgreen text-white hover:opacity-90"
                >
                  {modoEdicion ? "Guardar cambios" : "Crear guía"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
*/