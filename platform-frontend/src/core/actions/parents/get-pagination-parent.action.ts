import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { PageResponse } from "../../../infraestructure/interfaces/page.response";
import { ParentResponse } from "../../../infraestructure/interfaces/parent.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const getPaginationParentsAction = async (page = 1, pageSize = 10, searchTerm = ""): 
Promise<ApiResponse<PageResponse<ParentResponse>>> => {
    try {
        const { data } = await eduRuralApi
        .get<ApiResponse<PageResponse<ParentResponse>>>(`/parents`, {
               params: {
                page,
                pageSize,
                searchTerm
               }
            });
           // console.log("API Response:", data);  // Verifica la respuesta de la API
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