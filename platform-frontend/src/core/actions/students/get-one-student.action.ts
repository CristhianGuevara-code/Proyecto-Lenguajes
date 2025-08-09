import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { OneStudentResponse } from "../../../infraestructure/interfaces/one-student.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const getOneStudentAction = async (studentId: string): 
Promise<ApiResponse<OneStudentResponse>> => {

    try {

        const { data } = await eduRuralApi
        .get<ApiResponse<OneStudentResponse>>(`/students/${studentId}`);

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