import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { OneTeacherResponse } from "../../../infraestructure/interfaces/one-teacher.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const getOneTeacherAction = async (teacherId: string): 
Promise<ApiResponse<OneTeacherResponse>> => {

    try {

        const { data } = await eduRuralApi
        .get<ApiResponse<OneTeacherResponse>>(`/teachers/${teacherId}`);

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