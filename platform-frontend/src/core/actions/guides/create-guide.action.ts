import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { GuideResponse } from "../../../infraestructure/interfaces/guides.response";
import { eduRuralApi } from "../../api/edurural.api";
import { GuideCreateModel } from "../../models/guide-create.model";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const createGuideAction = async (
  guide: GuideCreateModel
): Promise<ApiResponse<GuideResponse>> => {
  try {
    const fd = new FormData();
    fd.append("title", guide.title);
    fd.append("description", guide.description ?? "");
    fd.append("gradeId", guide.gradeId);
    fd.append("subjectId", guide.subjectId);
    fd.append("file", guide.file); // <-- nombre EXACTO "file"

    const { data } = await eduRuralApi.post<ApiResponse<GuideResponse>>(
      "/guides",
      fd,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return data;
  } catch (error) {
    const apiError = error as AxiosError<ApiErrorResponse>;
    if (apiError.response) throw new Error(apiError.response.data.message);
    if (apiError.request) throw new Error("Error de conexion");
    throw new Error("Error desconocido");
  }
};
