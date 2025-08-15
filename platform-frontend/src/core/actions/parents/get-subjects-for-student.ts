// Define el tipo para los elementos de "allSubjects"
interface Subject {
  id: string;
  name: string;
}

export const getSubjectsForStudent = async (studentId: string) => {
  try {
    // Llama a tu API para obtener las asignaturas del estudiante
    const response = await fetch(`/api/students/${studentId}/subjects`);
    const studentData = await response.json();

    if (!response.ok) {
      throw new Error("Error al obtener las asignaturas del estudiante.");
    }

    // Ahora obtén la lista de todas las asignaturas disponibles
    const subjectsResponse = await fetch("/api/subjects"); // Asegúrate de que este sea el endpoint correcto
    const subjectsData = await subjectsResponse.json();

    if (!subjectsResponse.ok) {
      throw new Error("Error al obtener las asignaturas.");
    }

    // Crea un mapa de todas las asignaturas por ID para facilitar la búsqueda
    const allSubjects: Subject[] = subjectsData.map((subject: { id: string, name: string }) => ({
      id: subject.id,
      name: subject.name
    }));

    // Mapea los subjectIds del estudiante a los nombres de las asignaturas
    const studentSubjects = studentData.subjectsIds.map((subjectId: string) => {
      const subject = allSubjects.find((subj: Subject) => subj.id === subjectId); // Usa el tipo "Subject" aquí
      return subject ? subject.name : null;
    }).filter((name: string | null) => name !== null); // Elimina asignaturas no encontradas (en caso de que haya algún error con los IDs)

    return studentSubjects; // Devuelve los nombres de las asignaturas

  } catch (error) {
    console.error("Error:", error);
    throw new Error("No se pudieron obtener las asignaturas.");
  }
};
