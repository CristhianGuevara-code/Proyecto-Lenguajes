import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { GuideResponse } from "../../../infraestructure/interfaces/guides.response";
import { PageResponse } from "../../../infraestructure/interfaces/page.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const getPaginationGuidesAction = async (page = 1, pageSize = 10, searchTerm = ""): 
Promise<ApiResponse<PageResponse<GuideResponse>>> => {
    try {
        const { data } = await eduRuralApi
        .get<ApiResponse<PageResponse<GuideResponse>>>(`/guides`, {
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