import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { SubjectResponse } from "../../../infraestructure/interfaces/subject.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";
import { SubjectCreateModel } from "../../models/subject-create.model";

export const createSubjectAction = async (
    subject: SubjectCreateModel
): Promise<ApiResponse<SubjectResponse>> => {

    try {

        const { data } = await eduRuralApi.post<ApiResponse<SubjectResponse>>(
            "/subjects",
            subject
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