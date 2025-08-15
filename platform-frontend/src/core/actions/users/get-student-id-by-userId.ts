export const getStudentIdByUserId = async (userId: string) => {
  try {
    // Realiza la solicitud a la API para obtener el studentId usando el userId
    const response = await fetch(`/api/users/${userId}/student`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error("No se pudo obtener el studentId.");
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error al obtener el studentId: ", error);
    throw error; 
  }
};
