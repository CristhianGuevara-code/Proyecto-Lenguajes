import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { TeacherResponse } from "../../../infraestructure/interfaces/teacher.response";
import { eduRuralApi } from "../../api/edurural.api";
import { TeacherModel } from "../../models/teacher.model";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const createTeacherAction = async (
    teacher: TeacherModel
): Promise<ApiResponse<TeacherResponse>> => {

    try {

        const { data } = await eduRuralApi.post<ApiResponse<TeacherResponse>>(
            "/teachers",
            teacher
        );

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