import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { OneSubjectResponse } from "../../../infraestructure/interfaces/one-subject.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const getOneSubjectAction = async (subjectId: string): 
Promise<ApiResponse<OneSubjectResponse>> => {

    try {

        const { data } = await eduRuralApi
        .get<ApiResponse<OneSubjectResponse>>(`/subjects/${subjectId}`);

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