import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrashAlt, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

// hooks y actions
import { getPaginationStudentsAction } from "../../../core/actions/students/get-pagination-student.action";
import { getOneParentAction } from "../../../core/actions/parents/get-one-parent.action";

// modelos/interfaces
import { ParentResponse } from "../../../infraestructure/interfaces/parent.response";
import { StudentResponse } from "../../../infraestructure/interfaces/student.response";
import { ParentEditModel } from "../../../core/models/parent-edit.model";

// combobox de usuario elegible
import { useParents } from "../hooks/useParent";
import { ParentCreateModel } from "../../../core/models/parent-create.model";
import { UserComboBox } from "../components/shared/UserComboBox";

export default function ParentPage() {
  // estado UI
  const [queryText, setQueryText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  // hook de padres
  const {
    parentsPaginationQuery,
    createParentMutation,
    editParentMutation,
    deleteParentMutation,
    refreshParents,
    page,
    setPage,
    pageSize,
    setPageSize,
    setSearchTerm,
  } = useParents();

  // alumnos (para selector de hijos)
  const studentsQuery = useQuery({
    queryKey: ["students-for-parents"],
    queryFn: () => getPaginationStudentsAction(1, 1000, ""),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
 
// Filtrar estudiantes que no tienen un "parentId" asignado (no relacionados con un padre)
  const students: StudentResponse[] = studentsQuery.data?.data?.items ?? [];
  const availableStudents = students.filter(student => !student.parentId);  // Filtra los estudiantes no asignados


  const studentNameById = useMemo(
    () => new Map(availableStudents.map(s => [s.id, s.fullName])),
    [availableStudents]
  );

  // datos paginados
  const dataset = parentsPaginationQuery.data?.data;
  const rows: ParentResponse[] = dataset?.items ?? [];
  const cur = dataset?.currentPage ?? 1;
  const totalPages = dataset?.totalPages ?? 1;
  const totalItems = dataset?.totalItems ?? 0;

  // form
  const [form, setForm] = useState<ParentEditModel>({
    id: "",
    userId: "",
    phoneNumber: "",
    address: "",
    studentIds: [],
  });

  // side effects
  useEffect(() => { 
    //console.log("Término de búsqueda:", queryText);
    setSearchTerm(queryText); setPage(1); }, 
    [queryText, setSearchTerm, setPage]);

  const resetForm = () => {
    setForm({ id: "", userId: "", phoneNumber: "", address: "", studentIds: [] });
    setModoEdicion(false);
  };

  const openCreate = () => { resetForm(); setOpenModal(true); };
  
  const openEdit = async (row: ParentResponse) => {
    // Pedir el detalle para rellenar ids (userId, studentIds)
    const res = await getOneParentAction(row.id);
    if (res.status && res.data) {
      const d = res.data; // ajusta propiedades anidadas de oneparentresponse 
      setForm({
        id: d.id,
        userId: d.userId,
        phoneNumber: d.phoneNumber ?? "",
        address: d.address ?? "",
        studentIds: d.studentIds ?? [],
      });
      setModoEdicion(true);
      setOpenModal(true);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.userId) { alert("Selecciona un usuario."); return; }
    if (!form.phoneNumber.trim()) { alert("Teléfono requerido."); return; }
    if (!form.address.trim()) { alert("Dirección requerida."); return; }

    if (modoEdicion && form.id) {
      editParentMutation.mutate(form, {
        onSuccess: (r) => {
          if (r.status) { setOpenModal(false); resetForm(); refreshParents(); }
        },
        onError: (err: any) => alert(err?.message ?? "Error al editar"),
      });
    } else {
      const payload: ParentCreateModel = {
        userId: form.userId,
        phoneNumber: form.phoneNumber,
        address: form.address,
        studentIds: form.studentIds,
      };
      createParentMutation.mutate(payload, {
        onSuccess: (r) => {
          if (r.status) { setOpenModal(false); resetForm(); refreshParents(); }
        },
        onError: (err: any) => alert(err?.message ?? "Error al crear"),
      });
    }
  };

  const onDelete = (id: string) => {
    if (!confirm("¿Eliminar este padre/tutor?")) return;
    deleteParentMutation.mutate(id, {
      onSuccess: () => refreshParents(),
      onError: (err: any) => alert(err?.message ?? "Error al eliminar"),
    });
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-platform-darkblue">Padres / Tutores</h1>
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
              placeholder="Buscar por nombre o email…"
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

      {/* Tabla desktop */}
      <div className="hidden md:block rounded-xl border bg-white shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="text-left px-4 py-3">Usuario</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Teléfono</th>
              <th className="text-left px-4 py-3">Dirección</th>
              <th className="text-left px-4 py-3">Hijos</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-3">{p.fullName ?? "-"}</td>
                <td className="px-4 py-3">{p.email ?? "-"}</td>
                <td className="px-4 py-3">{p.phoneNumber ?? "-"}</td>
                <td className="px-4 py-3">{p.address ?? "-"}</td>
                <td className="px-4 py-3">
                  {p.students?.length ? p.students.map(s => s.fullName).join(", ") : "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-3 py-1.5 rounded border hover:bg-gray-50 inline-flex items-center gap-2"
                      onClick={() => openEdit(p)}
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      className="px-3 py-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
                      onClick={() => onDelete(p.id)}
                    >
                      <FaTrashAlt /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No hay registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Lista móvil */}
      <div className="md:hidden space-y-3">
        {rows.map((p) => (
          <div key={p.id} className="rounded-xl border bg-white shadow-sm p-4">
            <div className="font-semibold">{p.fullName ?? "Padre/Tutor"}</div>
            <div className="text-xs text-gray-500">{p.email ?? "-"}</div>

            <div className="mt-2 text-sm">
              <div><span className="text-gray-500">Teléfono:</span> {p.phoneNumber ?? "-"}</div>
              <div><span className="text-gray-500">Dirección:</span> {p.address ?? "-"}</div>
              <div>
                <span className="text-gray-500">Hijos:</span>{" "}
                {p.students?.length ? p.students.map(s => s.fullName).join(", ") : "-"}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <button className="px-3 py-1.5 rounded border inline-flex items-center gap-2" onClick={() => openEdit(p)}>
                <FaEdit /> Editar
              </button>
              <button className="px-3 py-1.5 rounded border border-red-300 text-red-600 inline-flex items-center gap-2" onClick={() => onDelete(p.id)}>
                <FaTrashAlt /> Eliminar
              </button>
            </div>
          </div>
        ))}

        {rows.length === 0 && (
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
            disabled={cur <= 1 || parentsPaginationQuery.isFetching}
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-600">Página {cur} de {totalPages}</span>
          <button
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => setPage(cur + 1)}
            disabled={cur >= totalPages || parentsPaginationQuery.isFetching}
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
                {modoEdicion ? "Editar padre/tutor" : "Nuevo padre/tutor"}
              </h3>
              <button className="p-2 rounded hover:bg-gray-100" onClick={() => setOpenModal(false)}>
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
                    helperText="Solo elegibles (no ADMIN, sin vínculo previo)."
                    requiredRole="PADRE"
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
                  <label className="block font-medium mb-1">Dirección</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={form.address}
                    onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Barrio/colonia, calle, referencias…"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Hijos (alumnos)</label>
                  <select
                    multiple
                    className="w-full border rounded px-3 py-2 h-40"
                    value={form.studentIds}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                      setForm(prev => ({ ...prev, studentIds: selected }));
                    }}
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.fullName}
                      </option>
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
                  disabled={createParentMutation.isPending || editParentMutation.isPending}
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
