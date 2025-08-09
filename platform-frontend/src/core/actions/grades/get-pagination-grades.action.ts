import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { GradeResponse } from "../../../infraestructure/interfaces/grade.response";
import { PageResponse } from "../../../infraestructure/interfaces/page.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const getPaginationGradesAction = async (page = 1, pageSize = 10, searchTerm = ""): 
Promise<ApiResponse<PageResponse<GradeResponse>>> => {
    try {
        const { data } = await eduRuralApi
        .get<ApiResponse<PageResponse<GradeResponse>>>(`/grades`, {
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