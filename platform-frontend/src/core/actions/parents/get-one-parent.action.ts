import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { OneParentResponse } from "../../../infraestructure/interfaces/one-parent.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const getOneParentAction = async (parentId: string): 
Promise<ApiResponse<OneParentResponse>> => {

    try {

        const { data } = await eduRuralApi
        .get<ApiResponse<OneParentResponse>>(`/parents/${parentId}`);

        return data
        
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        
                if(apiError.response) {
                    throw new Error(apiError.response.data.message)
                }
                else if (apiError.request) {
                    throw new Error("Error de conexion");
                }
                else {
                    throw new Error("Error desconocido");
                }
    }

}