import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { OneGuideResponse } from "../../../infraestructure/interfaces/one-guide.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const getOneGuideAction = async (guideId: string): 
Promise<ApiResponse<OneGuideResponse>> => {

    try {

        const { data } = await eduRuralApi
        .get<ApiResponse<OneGuideResponse>>(`/guides/${guideId}`);

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
