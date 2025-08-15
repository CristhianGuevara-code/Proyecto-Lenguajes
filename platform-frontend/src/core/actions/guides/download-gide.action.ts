import { eduRuralApi } from "../../api/edurural.api";

export const downloadGuideAction = async (guideId: string, fileName: string) => {
  const response = await eduRuralApi.get(`/guides/${guideId}/download`, {
    responseType: "blob", // importante para que reciba binario
  });

  // Crear URL temporal
  const url = window.URL.createObjectURL(new Blob([response.data]));

  // Crear enlace y disparar click
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName); 
  document.body.appendChild(link);
  link.click();

  // Limpiar
  link.remove();
  window.URL.revokeObjectURL(url);
};
