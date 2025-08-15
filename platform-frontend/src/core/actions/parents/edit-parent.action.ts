import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { ParentResponse } from "../../../infraestructure/interfaces/parent.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";
import { ParentEditModel } from "../../models/parent-edit.model";

export const editParentAction = async (
    parent: ParentEditModel
): Promise<ApiResponse<ParentResponse>> => {

    try {

        const { data } = await eduRuralApi
            .put<ApiResponse<ParentResponse>>(
                `/parents/${parent.id}`,
                parent
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