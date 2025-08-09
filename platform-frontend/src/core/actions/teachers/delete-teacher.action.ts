import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { TeacherResponse } from "../../../infraestructure/interfaces/teacher.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const deleteTeacherAction = async (
     teacherId: string
): Promise<ApiResponse<TeacherResponse>> => {

    try {

        const { data } = await eduRuralApi
            .delete<ApiResponse<TeacherResponse>>(
                `/teachers/${teacherId}`,
                
            );

        return data;

    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;

        if (apiError.response) {
            throw new Error(apiError.response.data.message)
        } else if (apiError.request) {
            throw new Error("Error de conexión.")
        } else {
            throw new Error("Error desconocido.")
        }
    }

}