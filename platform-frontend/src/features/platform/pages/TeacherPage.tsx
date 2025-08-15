// src/features/platform/pages/TeacherPageAlt.tsx
import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrashAlt, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../stores/authStore";
import { Role } from "../../../infraestructure/enums/role.enum";

import { getPaginationSubjectsAction } from "../../../core/actions/subjects/get-pagination-subject.action";
import { getOneTeacherAction } from "../../../core/actions/teachers/get-one-teacher.action";

import { TeacherResponse } from "../../../infraestructure/interfaces/teacher.response";
import { TeacherCreateModel } from "../../../core/models/teacher-create.model";
import { TeacherEditModel } from "../../../core/models/teacher-edit.model";
import { SubjectResponse } from "../../../infraestructure/interfaces/subject.response";
import { useTeachers } from "../hooks/UseTeachers";
import { UserComboBox } from "../components/shared/UserComboBox";


type TeacherForm = {
  id: string;
  userId: string;
  phoneNumber: string;
  specialty: string;
  subjectIds: string[];
};

export function TeacherPage() {
  const navigate = useNavigate();
  const { authenticated, roles } = useAuthStore();
  const isAdmin = roles?.includes(Role.ADMIN);

  useEffect(() => {
    if (authenticated && !isAdmin) navigate("/platform", { replace: true });
  }, [authenticated, isAdmin, navigate]);

  if (!isAdmin) return <div className="p-6 text-red-600">No tienes permiso para ver esta página.</div>;

  const [queryText, setQueryText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const {
    teachersPaginationQuery,
    createTeacherMutation,
    editTeacherMutation,
    deleteTeacherMutation,
    refreshTeachers,
    page, setPage,
    pageSize, setPageSize,
    setSearchTerm,
  } = useTeachers();

  const subjectsQuery = useQuery({
    queryKey: ["subjects-options-teachers"],
    queryFn: () => getPaginationSubjectsAction(1, 1000, ""),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  const subjects: SubjectResponse[] = subjectsQuery.data?.data?.items ?? [];
  const subjectNameById = useMemo(
    () => new Map(subjects.map((s) => [s.id, s.name])),
    [subjects]
  );

  const dataset = teachersPaginationQuery.data?.data;
  const rawRows: any[] = dataset?.items ?? [];

  const rows: (TeacherResponse & { __subjectNames?: string[] })[] = rawRows.map((t: any) => {
    const fullName: string = t.fullName ?? t.user?.fullName ?? "";
    const subjectNamesFromObjects: string[] =
      Array.isArray(t.subjects) ? t.subjects.map((s: any) => s.name) : [];
    const subjectIds: string[] =
      t.subjectIds ??
      t.subjectsIds ??
      (Array.isArray(t.subjects) ? t.subjects.map((s: any) => s.id) : []) ??
      [];

    return { ...t, fullName, subjectIds, __subjectNames: subjectNamesFromObjects };
  });

  const cur = dataset?.currentPage ?? 1;
  const totalPages = dataset?.totalPages ?? 1;
  const totalItems = dataset?.totalItems ?? 0;

  const [form, setForm] = useState<TeacherForm>({
    id: "",
    userId: "",
    phoneNumber: "",
    specialty: "",
    subjectIds: [],
  });

  useEffect(() => {
    setSearchTerm(queryText);
    setPage(1);
  }, [queryText, setSearchTerm, setPage]);

  const resetForm = () => {
    setForm({ id: "", userId: "", phoneNumber: "", specialty: "", subjectIds: [] });
    setModoEdicion(false);
  };

  const openCreate = () => {
    resetForm();
    setOpenModal(true);
  };

  const openEdit = async (row: TeacherResponse) => {
    const res = await getOneTeacherAction(row.id);
    if (res.status && res.data) {
      const d: any = res.data;
      setForm({
        id: d.id,
        userId: d.userId ?? d.userID ?? d.user?.id ?? "",
        phoneNumber: d.phoneNumber ?? "",
        specialty: d.specialty ?? "",
        subjectIds:
          d.subjectIds ??
          d.subjectsIds ??
          (Array.isArray(d.subjects) ? d.subjects.map((s: any) => s.id) : []) ??
          [],
      });
      setModoEdicion(true);
      setOpenModal(true);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.userId) return alert("Selecciona un usuario.");
    if (!form.phoneNumber.trim()) return alert("Teléfono requerido.");
    if (!form.specialty.trim()) return alert("Especialidad requerida.");

    if (modoEdicion && form.id) {
      const payload: TeacherEditModel = {
        id: form.id,
        userId: form.userId,
        phoneNumber: form.phoneNumber,
        specialty: form.specialty,
        subjectIds: form.subjectIds,
      };
      editTeacherMutation.mutate(payload, {
        onSuccess: (r) => {
          if (r.status) { setOpenModal(false); resetForm(); refreshTeachers(); }
        },
        onError: (err: any) => alert(err?.message ?? "Error al editar"),
      });
    } else {
      const payload: TeacherCreateModel = {
        userId: form.userId,
        phoneNumber: form.phoneNumber,
        specialty: form.specialty,
        subjectIds: form.subjectIds,
      };
      createTeacherMutation.mutate(payload, {
        onSuccess: (r) => {
          if (r.status) { setOpenModal(false); resetForm(); refreshTeachers(); }
        },
        onError: (err: any) => alert(err?.message ?? "Error al crear"),
      });
    }
  };

  const onDelete = (id: string) => {
    if (!confirm("¿Eliminar este maestro?")) return;
    deleteTeacherMutation.mutate(id, {
      onSuccess: () => refreshTeachers(),
      onError: (err: any) => alert(err?.message ?? "Error al eliminar"),
    });
  };

  const loadingList = teachersPaginationQuery.isLoading || subjectsQuery.isLoading;

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-platform-darkblue">Maestros</h1>
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
              placeholder="Buscar por nombre…"
              className="pl-9 pr-3 py-2 border rounded-lg w-64"
            />
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-platform-mintgreen text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            <FaPlus /> Nuevo
          </button>
        </div>
      </div>

      {/* Tabla desktop */}
      <div className="hidden md:block rounded-xl border bg-white shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Teléfono</th>
              <th className="text-left px-4 py-3">Especialidad</th>
              <th className="text-left px-4 py-3">Asignaturas</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => {
              const subjectDisplay =
                (t.__subjectNames?.length ? t.__subjectNames :
                  (t.subjectIds?.length ? t.subjectIds.map((id: string) => subjectNameById.get(id) ?? id) : [])
                ).join(", ") || "-";

              return (
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-3">{(t as any).fullName ?? "-"}</td>
                  <td className="px-4 py-3">{t.phoneNumber ?? "-"}</td>
                  <td className="px-4 py-3">{t.specialty ?? "-"}</td>
                  <td className="px-4 py-3">{subjectDisplay}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded border hover:bg-gray-50 inline-flex items-center gap-2"
                        onClick={() => openEdit(t)}
                      >
                        <FaEdit /> Editar
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
                        onClick={() => onDelete(t.id)}
                      >
                        <FaTrashAlt /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

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
        {rows.map((t) => {
          const subjectDisplay =
            (t.__subjectNames?.length ? t.__subjectNames :
              (t.subjectIds?.length ? t.subjectIds.map((id: string) => subjectNameById.get(id) ?? id) : [])
            ).join(", ") || "-";

          return (
            <div key={t.id} className="rounded-xl border bg-white shadow-sm p-4">
              <div className="font-semibold">{(t as any).fullName ?? "-"}</div>
              <div className="mt-2 text-sm">
                <div><span className="text-gray-500">Teléfono:</span> {t.phoneNumber ?? "-"}</div>
                <div><span className="text-gray-500">Especialidad:</span> {t.specialty ?? "-"}</div>
                <div><span className="text-gray-500">Asignaturas:</span> {subjectDisplay}</div>
              </div>

              <div className="flex justify-end gap-2 mt-3">
                <button type="button" className="px-3 py-1.5 rounded border inline-flex items-center gap-2" onClick={() => openEdit(t)}>
                  <FaEdit /> Editar
                </button>
                <button type="button" className="px-3 py-1.5 rounded border border-red-300 text-red-600 inline-flex items-center gap-2" onClick={() => onDelete(t.id)}>
                  <FaTrashAlt /> Eliminar
                </button>
              </div>
            </div>
          );
        })}

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
            onClick={() => setPage(Math.max(1, cur - 1))}
            disabled={cur <= 1 || teachersPaginationQuery.isFetching}
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-600">Página {cur} de {totalPages}</span>
          <button
            type="button"
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => setPage(cur + 1)}
            disabled={cur >= totalPages || teachersPaginationQuery.isFetching}
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* Modal crear/editar con scroll interno */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          {/* Panel */}
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            {/* Header sticky opcional */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-3 border-b">
              <h3 className="font-semibold">
                {modoEdicion ? "Editar maestro" : "Nuevo maestro"}
              </h3>
              <button
                type="button"
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setOpenModal(false)}
                aria-label="Cerrar"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <UserComboBox
                    value={form.userId}
                    onChange={(id) => setForm(prev => ({ ...prev, userId: id ?? "" }))}
                    label="Usuario"
                    placeholder="Seleccionar usuario…"
                    helperText="Solo elegibles (no ADMIN y sin vínculo previo)."
                    requiredRole="PROFESOR"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Teléfono</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={form.phoneNumber}
                    onChange={(e) => setForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="Ej: +504 9999-9999"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Especialidad</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={form.specialty}
                    onChange={(e) => setForm(prev => ({ ...prev, specialty: e.target.value }))}
                    placeholder="Ej: Matemáticas"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Asignaturas</label>
                  <select
                    multiple
                    className="w-full border rounded px-3 py-2 h-48"
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
                  disabled={createTeacherMutation.isPending || editTeacherMutation.isPending}
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

export default TeacherPage;
