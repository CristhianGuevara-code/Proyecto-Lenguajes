import { useState } from "react";
import { FaPlusCircle, FaTimesCircle, FaEdit, FaTrashAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getPaginationSubjectsAction } from "../../../core/actions/subjects/get-pagination-subject.action"; // <- ajustá ruta

// Tipos que ya tenés o equivalentes
import { StudentResponse } from "../../../infraestructure/interfaces/student.response";
import { GradeResponse } from "../../../infraestructure/interfaces/grade.response";
import { SubjectResponse } from "../../../infraestructure/interfaces/subject.response";
import { StudentCreateModel } from "../../../core/models/student-create.model";
import { StudentEditModel } from "../../../core/models/student-edit.model";
import { useStudents } from "../hooks/useStudents";
import { useGrades } from "../hooks/useGrades";

export const StudentPage = () => {
  // CRUD de alumnos
  const {
    studentsPaginationQuery,
    createStudentMutation,
    editStudentMutation,
    deleteStudentMutation,
    refreshStudents,
  } = useStudents();

  // Grados (desde DB)
  const { grades } = useGrades(); // GradeResponse[]

  // Subjects (solo para opciones del select)
  const subjectsQuery = useQuery({
    queryKey: ["subjects-options"],
    queryFn: () => getPaginationSubjectsAction(1, 1000, ""),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  const subjects: SubjectResponse[] = subjectsQuery.data?.data?.items ?? [];

  // Mapas id->name para mostrar nombres
  const gradeNameById = new Map<string, string>(grades.map((g: GradeResponse) => [g.id, g.name]));
  const subjectNameById = new Map<string, string>(subjects.map((s: SubjectResponse) => [s.id, s.name]));

  // Estado del form (Edit usa id; Create no lo envía)
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState<StudentEditModel>({
    id: "",
    fullName: "",
    birthDate: "", // formato "YYYY-MM-DD"
    gradeId: "",
    subjectIds: [],
  });

  // Lista de alumnos desde el query
  const students: StudentResponse[] = studentsPaginationQuery.data?.data?.items ?? [];

  // Handlers
  const onInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubjectsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setForm((prev) => ({ ...prev, subjectIds: selected }));
  };

  const resetForm = () => {
    setForm({
      id: "",
      fullName: "",
      birthDate: "",
      gradeId: "",
      subjectIds: [],
    });
    setModoEdicion(false);
    refreshStudents();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      alert("El nombre completo es requerido.");
      return;
    }
    if (!form.birthDate) {
      alert("La fecha de nacimiento es requerida.");
      return;
    }
    if (!form.gradeId) {
      alert("Seleccione un grado.");
      return;
    }

    if (modoEdicion && form.id) {
      // EDIT
      editStudentMutation.mutate(
        { ...form },
        { onSuccess: () => resetForm() }
      );
    } else {
      // CREATE (no mandamos id)
      const payload: StudentCreateModel = {
        fullName: form.fullName,
        birthDate: form.birthDate,
        gradeId: form.gradeId,
        subjectIds: form.subjectIds,
      };
      createStudentMutation.mutate(payload, { onSuccess: () => resetForm() });
    }
  };

  const handleEdit = (st: StudentResponse) => {
    setForm({
      id: st.id,
      fullName: st.fullName,
      // si viene como ISO "YYYY-MM-DDTHH:mm:ss", cortamos al día
      birthDate: st.birthDate?.slice(0, 10) ?? "",
      gradeId: st.gradeId ?? "",
      subjectIds: st.subjectIds ?? [],
    });
    setModoEdicion(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este alumno?")) return;
    deleteStudentMutation.mutate(id, { onSuccess: () => resetForm() });
  };

  const loading = studentsPaginationQuery.isLoading || subjectsQuery.isLoading;

  return (
    <div className="p-6 bg-transparent min-h-screen w-full">
      <h1 className="text-3xl font-bold text-platform-bluedark mb-6">Alumnos</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-8 bg-white shadow-md p-6 rounded-xl w-full">
        <h2 className="text-xl font-semibold mb-4">
          {modoEdicion ? "Editar alumno" : "Crear alumno"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-medium mb-1">Nombre completo:</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={onInput}
              className="w-full border p-2 rounded"
              placeholder="Ej: Juan Pérez"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Fecha de nacimiento:</label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={onInput}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Grado:</label>
            <select
              name="gradeId"
              value={form.gradeId}
              onChange={onInput}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Seleccione un grado --</option>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Asignaturas:</label>
            <select
              multiple
              name="subjectIds"
              value={form.subjectIds}
              onChange={onSubjectsChange}
              className="w-full border p-2 rounded h-32"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
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

      {/* LISTA */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {students.map((st) => (
            <div
              key={st.id}
              className="w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 bg-white p-4"
            >
              <h3 className="text-lg font-semibold text-gray-800">{st.fullName}</h3>

              <p className="text-sm text-gray-600 mt-1">
                Nacimiento: <span className="font-medium">{st.birthDate?.slice(0, 10) ?? "-"}</span>
              </p>

              <p className="text-sm text-gray-600 mt-1">
                Grado:{" "}
                <span className="font-medium">
                  {gradeNameById.get(st.gradeId) ?? st.gradeId ?? "-"}
                </span>
              </p>

              <p className="text-sm text-gray-600 mt-1">
                Asignaturas:{" "}
                {st.subjectIds?.length
                  ? st.subjectIds
                      .map((id) => subjectNameById.get(id) ?? id)
                      .join(", ")
                  : "-"}
              </p>

              <div className="flex justify-end gap-2 mt-4">
                <button className="btn-sm btn-editar" onClick={() => handleEdit(st)}>
                  <FaEdit />
                  Editar
                </button>
                <button className="btn-sm btn-eliminar" onClick={() => handleDelete(st.id)}>
                  <FaTrashAlt />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentPage;