import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { StudentResponse } from "../../../infraestructure/interfaces/student.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";
import { StudentEditModel } from "../../models/student-edit.model";

export const editStudentAction = async (
    student: StudentEditModel
): Promise<ApiResponse<StudentResponse>> => {

    try {

        const { data } = await eduRuralApi
            .put<ApiResponse<StudentResponse>>(
                `/students/${student.id}`,
                student
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