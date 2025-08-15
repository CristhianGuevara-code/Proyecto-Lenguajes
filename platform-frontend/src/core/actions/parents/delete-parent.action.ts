import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { ParentResponse } from "../../../infraestructure/interfaces/parent.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const deleteParentAction = async (
     parentId: string
): Promise<ApiResponse<ParentResponse>> => {

    try {

        const { data } = await eduRuralApi
            .delete<ApiResponse<ParentResponse>>(
                `/parents/${parentId}`,
                
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