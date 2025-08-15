import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrashAlt, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

// hooks & actions
import { useStudents } from "../hooks/useStudents";
import { useGrades } from "../hooks/useGrades";
import { getPaginationSubjectsAction } from "../../../core/actions/subjects/get-pagination-subject.action";
import { getOneStudentAction } from "../../../core/actions/students/get-one-student.action";

// tipos/modelos
import { StudentResponse } from "../../../infraestructure/interfaces/student.response";
import { StudentCreateModel } from "../../../core/models/student-create.model";
import { StudentEditModel } from "../../../core/models/student-edit.model";
import { GradeResponse } from "../../../infraestructure/interfaces/grade.response";
import { SubjectResponse } from "../../../infraestructure/interfaces/subject.response";

export function StudentPage() {
  // UI
  const [queryText, setQueryText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Hook principal de alumnos
  const {
    studentsPaginationQuery,
    createStudentMutation,
    editStudentMutation,
    deleteStudentMutation,
    refreshStudents,
    page,
    setPage,
    pageSize,
    setPageSize,
    setSearchTerm,
  } = useStudents();

  // Cargar grados
  const { grades } = useGrades(); // GradeResponse[]
  const gradeNameById = useMemo(
    () => new Map(grades.map((g: GradeResponse) => [g.id, g.name])),
    [grades]
  );

  // Cargar subjects para selector múltiple
  const subjectsQuery = useQuery({
    queryKey: ["subjects-options-students"],
    queryFn: () => getPaginationSubjectsAction(1, 1000, ""),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  const subjects: SubjectResponse[] = subjectsQuery.data?.data?.items ?? [];
  const subjectNameById = useMemo(
    () => new Map(subjects.map((s) => [s.id, s.name])),
    [subjects]
  );

  // Dataset paginado
  const dataset = studentsPaginationQuery.data?.data;
  const rows: StudentResponse[] = dataset?.items ?? [];
  const cur = dataset?.currentPage ?? 1;
  const totalPages = dataset?.totalPages ?? 1;
  const totalItems = dataset?.totalItems ?? 0;

  // Form state
  const [form, setForm] = useState<StudentEditModel>({
    id: "",
    fullName: "",
    birthDate: "",
    gradeId: "",
    subjectIds: [],
  });

  // Buscar
  useEffect(() => {
    setSearchTerm(queryText);
    setPage(1);
  }, [queryText, setSearchTerm, setPage]);

  // Helpers UI
  const resetForm = () => {
    setForm({ id: "", fullName: "", birthDate: "", gradeId: "", subjectIds: [] });
    setModoEdicion(false);
  };

  const openCreate = () => {
    resetForm();
    setOpenModal(true);
  };

  const openEdit = async (row: StudentResponse) => {
    // Trae detalle para poblar correctamente (ojo con subjectsIds vs subjectIds)
    const res = await getOneStudentAction(row.id);
    if (res.status && res.data) {
      const d = res.data; // OneStudentResponse
      setForm({
        id: d.id,
        fullName: d.fullName ?? "",
        // si viene ISO completa, corta al día
        birthDate: (d.birthDate ?? "").slice(0, 10),
        gradeId: d.gradeId ?? "",
        subjectIds: (res.data as any).subjectIds ?? (res.data as any).subjectsIds ?? [], // tolerante a nombre del campo
      });
      setModoEdicion(true);
      setOpenModal(true);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim()) { alert("El nombre es requerido."); return; }
    if (!form.birthDate) { alert("La fecha de nacimiento es requerida."); return; }
    if (!form.gradeId) { alert("Seleccione un grado."); return; }

    if (modoEdicion && form.id) {
      editStudentMutation.mutate(form, {
        onSuccess: (r) => {
          if (r.status) {
            setOpenModal(false);
            resetForm();
            refreshStudents();
          }
        },
        onError: (err: any) => alert(err?.message ?? "Error al editar"),
      });
    } else {
      const payload: StudentCreateModel = {
        fullName: form.fullName,
        birthDate: form.birthDate,
        gradeId: form.gradeId,
        subjectIds: form.subjectIds,
      };
      createStudentMutation.mutate(payload, {
        onSuccess: (r) => {
          if (r.status) {
            setOpenModal(false);
            resetForm();
            refreshStudents();
          }
        },
        onError: (err: any) => alert(err?.message ?? "Error al crear"),
      });
    }
  };

  const onDelete = (id: string) => {
    if (!confirm("¿Eliminar este alumno?")) return;
    deleteStudentMutation.mutate(id, {
      onSuccess: () => refreshStudents(),
      onError: (err: any) => alert(err?.message ?? "Error al eliminar"),
    });
  };

  const loadingList = studentsPaginationQuery.isLoading || subjectsQuery.isLoading;

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-platform-darkblue">Alumnos</h1>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
            <input
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Buscar por nombre…"
              className="pl-9 pr-3 py-2 border rounded-lg w-64"
            />
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-platform-mintgreen text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            <FaPlus /> Nuevo
          </button>
        </div>
      </div>

      {/* Info resumen */}
      <p className="text-sm text-gray-600">
        {totalItems} registro{totalItems === 1 ? "" : "s"} • página {cur} de {totalPages}
      </p>

      {/* Tabla desktop */}
      <div className="hidden md:block rounded-xl border bg-white shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Nacimiento</th>
              <th className="text-left px-4 py-3">Grado</th>
              <th className="text-left px-4 py-3">Asignaturas</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((st) => (
              <tr key={st.id} className="border-t">
                <td className="px-4 py-3">{st.fullName}</td>
                <td className="px-4 py-3">{st.birthDate?.slice(0, 10) ?? "-"}</td>
                <td className="px-4 py-3">{gradeNameById.get(st.gradeId) ?? st.gradeId ?? "-"}</td>
                <td className="px-4 py-3">
                    {st.subjectsNames || "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-3 py-1.5 rounded border hover:bg-gray-50 inline-flex items-center gap-2"
                      onClick={() => openEdit(st)}
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      className="px-3 py-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
                      onClick={() => onDelete(st.id)}
                    >
                      <FaTrashAlt /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && !loadingList && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No hay registros.
                </td>
              </tr>
            )}

            {loadingList && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Cargando…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Lista móvil */}
      <div className="md:hidden space-y-3">
        {rows.map((st) => (
          <div key={st.id} className="rounded-xl border bg-white shadow-sm p-4">
            <div className="font-semibold">{st.fullName}</div>
            <div className="text-xs text-gray-500">{st.birthDate?.slice(0, 10) ?? "-"}</div>

            <div>
        <div className="px-4 py-3">
          {st.subjectsNames || "-"}
        </div>
      </div>

            <div className="flex justify-end gap-2 mt-3">
              <button className="px-3 py-1.5 rounded border inline-flex items-center gap-2" onClick={() => openEdit(st)}>
                <FaEdit /> Editar
              </button>
              <button className="px-3 py-1.5 rounded border border-red-300 text-red-600 inline-flex items-center gap-2" onClick={() => onDelete(st.id)}>
                <FaTrashAlt /> Eliminar
              </button>
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
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => setPage(Math.max(1, cur - 1))}
            disabled={cur <= 1 || studentsPaginationQuery.isFetching}
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-600">Página {cur} de {totalPages}</span>
          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => setPage(cur + 1)}
            disabled={cur >= totalPages || studentsPaginationQuery.isFetching}
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* Modal crear/editar */}
      {openModal && (
        <div className="fixed inset-0 z-50 grid place-items-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenModal(false)} />
          <div className="relative w-[95%] max-w-3xl bg-white rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <h3 className="font-semibold">
                {modoEdicion ? "Editar alumno" : "Nuevo alumno"}
              </h3>
              <button className="p-2 rounded hover:bg-gray-100" onClick={() => setOpenModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1">Nombre completo</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={form.fullName}
                    onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Fecha de nacimiento</label>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={form.birthDate}
                    onChange={(e) => setForm(prev => ({ ...prev, birthDate: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Grado</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={form.gradeId}
                    onChange={(e) => setForm(prev => ({ ...prev, gradeId: e.target.value }))}
                    required
                  >
                    <option value="">-- Seleccione --</option>
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">Asignaturas</label>
                  <select
                    multiple
                    className="w-full border rounded px-3 py-2 h-40"
                    value={form.subjectIds}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                      setForm(prev => ({ ...prev, subjectIds: selected }));
                    }}
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Usa Ctrl/Cmd para seleccionar múltiples.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="px-4 py-2 rounded border" onClick={() => setOpenModal(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-platform-mintgreen text-white hover:opacity-90"
                  disabled={createStudentMutation.isPending || editStudentMutation.isPending}
                >
                  {modoEdicion ? "Guardar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentPage;
