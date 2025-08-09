import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { PageResponse } from "../../../infraestructure/interfaces/page.response";
import { StudentResponse } from "../../../infraestructure/interfaces/student.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const getPaginationStudentsAction = async (page = 1, pageSize = 10, searchTerm = ""): 
Promise<ApiResponse<PageResponse<StudentResponse>>> => {
    try {
        const { data } = await eduRuralApi
        .get<ApiResponse<PageResponse<StudentResponse>>>(`/students`, {
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