import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { ParentResponse } from "../../../infraestructure/interfaces/parent.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";
import { ParentCreateModel } from "../../models/parent-create.model";

export const createParentAction = async (
    parent: ParentCreateModel
): Promise<ApiResponse<ParentResponse>> => {

    try {

        const { data } = await eduRuralApi.post<ApiResponse<ParentResponse>>(
            "/parents",
            parent
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