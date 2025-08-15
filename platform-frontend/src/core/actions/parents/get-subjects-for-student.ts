interface Subject {
  id: string;
  name: string;
}

export const getSubjectsForStudent = async (studentId: string) => {
  try {
    // Llama a la API para obtener las asignaturas del estudiante
    const response = await fetch(`/api/students/${studentId}/subjects`);
    const studentData = await response.json();

    if (!response.ok) {
      throw new Error("Error al obtener las asignaturas del estudiante.");
    }

    // Se obtiene la lista de todas las asignaturas disponibles
    const subjectsResponse = await fetch("/api/subjects"); 
    const subjectsData = await subjectsResponse.json();

    if (!subjectsResponse.ok) {
      throw new Error("Error al obtener las asignaturas.");
    }

    // un tipo mapa para las asignaturas 
    const allSubjects: Subject[] = subjectsData.map((subject: { id: string, name: string }) => ({
      id: subject.id,
      name: subject.name
    }));

    // Mapea los subjectIds del estudiante a los nombres de las asignaturas
    const studentSubjects = studentData.subjectsIds.map((subjectId: string) => {
      const subject = allSubjects.find((subj: Subject) => subj.id === subjectId);
      return subject ? subject.name : null;
    }).filter((name: string | null) => name !== null); 

    return studentSubjects; // Devuelve los nombres de las asignaturas

  } catch (error) {
    console.error("Error:", error);
    throw new Error("No se pudieron obtener las asignaturas.");
  }
};
