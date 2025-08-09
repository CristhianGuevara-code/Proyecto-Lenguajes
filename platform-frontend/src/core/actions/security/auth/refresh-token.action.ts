import { AxiosError } from "axios";
import { LoginResponse } from "../../../../infraestructure/interfaces/login.response";
import { ApiErrorResponse } from "../../../../infraestructure/interfaces/api-error.response";
import { ApiResponse } from "../../../../infraestructure/interfaces/api.response";
import { authEduRuralApi } from "../../../api/auth.edurural.api";
import { RefreshTokenModel } from "../../../models/refresh-token.model";


export const refreshTokenAction = async (refreshTokenModel: RefreshTokenModel) : 
                                        Promise<ApiResponse<LoginResponse>> => {
    try {
        const { data } = await authEduRuralApi.post<ApiResponse<LoginResponse>>(
            '/auth/login',
            refreshTokenModel
        );

        return data;
        
    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        console.error(apiError);

        if (apiError.response) {
            //throw new Error(apiError.response.data.message);
            return {
                status: false,
                message: apiError.response.data.message || 'Error al iniciar sesión',
            };
        } else if(apiError.request){
            //throw new Error('Error de conexion');
            return {
                status: false,
                message: 'Error de conexion',
            };
        } else{
            //throw new Error('Error desconocido');
            return{
                status: false,
                message: 'Error desconocido'
            };
        }
    }
} 