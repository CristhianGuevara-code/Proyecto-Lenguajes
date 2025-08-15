import { useEffect, useState } from "react";
import { FaDownload, FaEdit, FaTrashAlt, FaPlus, FaSearch, FaEye, FaTimes } from "react-icons/fa";
 import { useAuthStore } from "../../stores/authStore";
import { Role } from "../../../infraestructure/enums/role.enum";
import { useGuides } from "../hooks/useGuides";
import { eduRuralApi } from "../../../core/api/edurural.api";
import { fetchGuideBlob } from "../utils/fetch-guide-blob";
import { GuideFormModal } from "../components/shared/GuideFormModal";

// Tipos mínimos
type GuideRow = {
  id: string;
  title: string;
  description: string;
  filePath: string;   // ej: /uploads/guides/---.pdf
  uploadDate: string; // ISO
  gradeName?: string;
  subjectName?: string;
  uploadedByName?: string;

};

// ------------ Utilidad para traer blob pasando por SW (y cachear) ------------
/* async function fetchGuideBlob(guideId: string): Promise<Blob> {
  const { data } = await eduRuralApi.get(`/guides/${guideId}/download`, {
    responseType: "blob",
  });
  return data;
} */

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

  const handleDownload = async () => {
    try {
      if (blobUrl) {
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${title || "guia"}`; 
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
    <div className="relative bg-white rounded-2xl shadow-2xl w-11/12 max-w-4xl mx-auto my-auto flex flex-col overflow-hidden max-h-screen">        <div className="flex items-center justify-between px-4 py-3 border-b">
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

  const [guides, setGuides] = useState<any[]>([]); // lista de guías
  const [preview, setPreview] = useState<{ id: string; title: string } | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

   // Función para recargar guías desde la API
  /*const refreshGuides = async () => {
    const res = await fetch("/api/guides"); 
    const data = await res.json();
    setGuides(data);
  };*/

  // hooks de datos
  const {
    guidesPaginationQuery,
    page,
    pageSize,
    setPage,
    setPageSize,
    searchTerm,
    setSearchTerm,
    refreshGuides
  } = useGuides();

  // dataset
  const dataset = guidesPaginationQuery.data?.data;
  const rows: GuideRow[] = dataset?.items ?? [];
  const cur = dataset?.currentPage ?? 1;
  const totalPages = dataset?.totalPages ?? 1;
  const totalItems = dataset?.totalItems ?? 0;

  // Cargar grados y asignaturas desde API
  const [grades, setGrades] = useState<{ id: string; name: string }[]>([]);
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);

  // búsqueda local
  const [queryText, setQueryText] = useState("");
  useEffect(() => {
    setSearchTerm(queryText);
    setPage(1);
  }, [queryText, setSearchTerm, setPage]);



useEffect(() => {
    async function loadOptions() {
      try {
        const gradesRes = await eduRuralApi.get("/grades");
        const subjectsRes = await eduRuralApi.get("/subjects");

        setGrades(gradesRes.data.data.items || []);
        setSubjects(subjectsRes.data.data.items || []);
      } catch (error) {
        console.error("Error al cargar grados y asignaturas:", error);
      }
    }
    if (modalOpen) loadOptions();
  }, [modalOpen]);

  // verificar datos
  useEffect(() => {
  console.log("Grados cargados:", grades);
  console.log("Asignaturas cargadas:", subjects);
}, [grades, subjects]);

const handleCreate = () => {
    setSelectedGuide(null); // no hay datos, es creación
    setModalOpen(true);
  };

  const handleEdit = (guide: any) => {
    setSelectedGuide(guide); // le pasamos la guía para edición
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que querés eliminar esta guía?")) return;
    //await fetch(`/api/guides/${id}`, { method: "DELETE" });
    await eduRuralApi.delete(`/guides/${id}`);
    refreshGuides();
  };

  const loadingList = guidesPaginationQuery.isLoading;

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
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
              onClick={() =>handleCreate()}
              className="inline-flex items-center gap-2 bg-platform-mintgreen text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              <FaPlus /> Nueva guía
            </button>
          )}
        </div>
      </div>

      {/* Tabla*/}
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
               {/* <td className="px-4 py-3">{(g as any).subjectName ?? "-"}</td>*/}
               <td className="px-4 py-3">{g.subjectName ?? "-"}</td>
                <td className="px-4 py-3">{g.uploadedByName ?? "-"}</td>
                <td className="px-4 py-3">{(g.uploadDate ?? "").slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {/* Botón VER (abre modal y cachea vía SW) */}
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
                          onClick={() => handleEdit(g)}
                        >
                          <FaEdit /> Editar
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded border border-red-300 text-red-600 inline-flex items-center gap-2 hover:bg-red-50"
                          onClick={() => handleDelete(g.id)}
                        >
                          <FaTrashAlt /> Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && !loadingList && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No hay registros.
                </td>
              </tr>
            )}

            {loadingList && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Cargando…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Lista móvil */}
      <div className="md:hidden space-y-3">
        {rows.map((g) => (
          <div key={g.id} className="rounded-xl border bg-white shadow-sm p-4">
            <div className="font-semibold">{g.title}</div>
            <div className="mt-2 text-sm">
              <div><span className="text-gray-500">Grado:</span> {g.gradeName ?? "-"}</div>
{/*              <div><span className="text-gray-500">Asignatura:</span> {(g as any).subjectName ?? "-"}</div>*/}
              <div><span className="text-gray-500">Asignatura:</span> {g.subjectName ?? "-"}</div>              
              <div><span className="text-gray-500">Subido por:</span> {g.uploadedByName ?? "-"}</div>
              <div><span className="text-gray-500">Fecha:</span> {(g.uploadDate ?? "").slice(0,10)}</div>
            </div>

            <div className="flex justify-end gap-2 mt-3">
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
                    className="px-3 py-1.5 rounded border inline-flex items-center gap-2"
                    onClick={() => handleEdit(g)}
                  >
                    <FaEdit /> Editar
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded border border-red-300 text-red-600 inline-flex items-center gap-2"
                    onClick={() => handleDelete(g.id)}
                  >
                    <FaTrashAlt /> Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {rows.length === 0 && !loadingList && (
          <div className="text-center text-gray-500">No hay registros.</div>
        )}
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span>Filas por página:</span>
          <select
            className="border rounded px-2 py-1"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => setPage(Math.max(1, (dataset?.currentPage ?? 1) - 1))}
            disabled={(dataset?.currentPage ?? 1) <= 1 || guidesPaginationQuery.isFetching}
          >
            &larr; Anterior
          </button>
          <span className="text-sm text-gray-600">Página {cur} de {totalPages}</span>
          <button
            type="button"
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => setPage((dataset?.currentPage ?? 1) + 1)}
            disabled={(dataset?.currentPage ?? 1) >= totalPages || guidesPaginationQuery.isFetching}
          >
            &rarr; Siguiente
          </button>
        </div>
      </div>

      {/* Modal de vista previa */}
      <PreviewGuideModal
        open={!!preview}
        guideId={preview?.id || ""}
        title={preview?.title || ""}
        onClose={() => setPreview(null)}
      />

      {/* Modal de crear/editar */}
      <GuideFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        guide={selectedGuide || undefined}
        grades={grades}
        subjects={subjects}
      />
    </div>
  );
}
