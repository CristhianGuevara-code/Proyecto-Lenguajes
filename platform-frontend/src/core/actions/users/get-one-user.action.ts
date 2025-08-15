import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { OneUserResponse } from "../../../infraestructure/interfaces/one-user.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const getOneUserAction = async (userId: string): 
Promise<ApiResponse<OneUserResponse>> => {

    try {

        const { data } = await eduRuralApi
        .get<ApiResponse<OneUserResponse>>(`/users/${userId}`);

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