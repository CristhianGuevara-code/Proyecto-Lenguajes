export const getStudentIdByUserId = async (userId: string) => {
  try {
    // Realiza la solicitud a la API para obtener el studentId usando el userId
    const response = await fetch(`/api/users/${userId}/student`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Si es necesario incluir un token en la solicitud
      }
    });

    if (!response.ok) {
      throw new Error("No se pudo obtener el studentId.");
    }

    const data = await response.json();
    return data; // Suponiendo que la respuesta contiene el studentId.
  } catch (error) {
    console.error("Error al obtener el studentId: ", error);
    throw error; // Maneja el error aquí, o devuelvelo a la llamada original.
  }
};
