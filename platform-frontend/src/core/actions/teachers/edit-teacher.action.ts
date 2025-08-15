import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { TeacherResponse } from "../../../infraestructure/interfaces/teacher.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";
import { TeacherEditModel } from "../../models/teacher-edit.model";

export const editTeacherAction = async (
    teacher: TeacherEditModel
): Promise<ApiResponse<TeacherResponse>> => {

    try {

        const { data } = await eduRuralApi
            .put<ApiResponse<TeacherResponse>>(
                `/teachers/${teacher.id}`,
                teacher
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