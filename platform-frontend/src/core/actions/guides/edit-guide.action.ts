// core/actions/guides/edit-guide.action.ts
import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { GuideResponse } from "../../../infraestructure/interfaces/guides.response";
import { eduRuralApi } from "../../api/edurural.api";
import { GuideEditModel } from "../../models/guide-edit.model";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const editGuideAction = async (
  guide: GuideEditModel
): Promise<ApiResponse<GuideResponse>> => {
  try {
    const fd = new FormData();
    if (guide.title !== undefined)       fd.append("title", guide.title);
    if (guide.description !== undefined) fd.append("description", guide.description);
    if (guide.gradeId !== undefined)     fd.append("gradeId", guide.gradeId);
    if (guide.subjectId !== undefined)   fd.append("subjectId", guide.subjectId);

    // archivo SOLO si lo manda el usuario
    if (guide.file) {
      fd.append("file", guide.file);
    }

    const { data } = await eduRuralApi.put<ApiResponse<GuideResponse>>(
      `/guides/${guide.id}`,
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return data;
  } catch (error) {
    const apiError = error as AxiosError<ApiErrorResponse>;
    if (apiError.response) throw new Error(apiError.response.data.message);
    if (apiError.request) throw new Error("Error de conexión.");
    throw new Error("Error desconocido.");
  }
};
