import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { StudentResponse } from "../../../infraestructure/interfaces/student.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";
import { StudentCreateModel } from "../../models/student-create.model";

export const createStudentAction = async (
    student: StudentCreateModel
): Promise<ApiResponse<StudentResponse>> => {

    try {

        const { data } = await eduRuralApi.post<ApiResponse<StudentResponse>>(
            "/students",
            student
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