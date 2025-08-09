import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { PageResponse } from "../../../infraestructure/interfaces/page.response";
import { TeacherResponse } from "../../../infraestructure/interfaces/teacher.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const getPaginationTeachersAction = async (page = 1, pageSize = 10, searchTerm = ""): 
Promise<ApiResponse<PageResponse<TeacherResponse>>> => {
    try {
        const { data } = await eduRuralApi
        .get<ApiResponse<PageResponse<TeacherResponse>>>(`/teachers`, {
               params: {
                page,
                pageSize,
                searchTerm
               }
            });
        return data

    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        console.error(apiError);

        if(apiError.response)
        {
            throw new Error(apiError.response.data.message);
        } else if (apiError.request) {
            throw new Error("Error de conexion");
        } else {
            throw new Error("Error desconocido");
        }
    }
}