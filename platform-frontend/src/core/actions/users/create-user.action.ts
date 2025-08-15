import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { UserResponse } from "../../../infraestructure/interfaces/user.response";
import { eduRuralApi } from "../../api/edurural.api";
import { UserCreateModel } from "../../models/user-create.model";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const createUserAction = async (
    user: UserCreateModel
): Promise<ApiResponse<UserResponse>> => {

    try {

        const { data } = await eduRuralApi.post<ApiResponse<UserResponse>>(
            "/users",
            user
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
