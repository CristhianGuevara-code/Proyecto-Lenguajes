import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { UserResponse } from "../../../infraestructure/interfaces/user.response";
import { eduRuralApi } from "../../api/edurural.api";
import { UserEditModel } from "../../models/user-edit.model";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const editUserAction = async (
    user: UserEditModel
): Promise<ApiResponse<UserResponse>> => {

    try {

        const { data } = await eduRuralApi
            .put<ApiResponse<UserResponse>>(
                `/users/${user.id}`,
                user
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