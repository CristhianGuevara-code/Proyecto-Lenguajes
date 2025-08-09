import { AxiosError } from "axios";
import { LoginModel } from "../../../models/login.model";
import { LoginResponse } from "../../../../infraestructure/interfaces/login.response";
import { ApiResponse } from "../../../../infraestructure/interfaces/api.response";
import { authEduRuralApi } from "../../../api/auth.edurural.api";
import { useAuthStore } from "../../../../features/stores/authStore";

export const loginAction = async (
  login: LoginModel
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const { data } = await authEduRuralApi.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      login
    );

    if (data.status && data.data) {
      // Guardar tokens en localStorage
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      useAuthStore
        .getState()
        .setTokens(data.data.token, data.data.refreshToken);
    }

    return data;
  } catch (error) {
    const apiError = error as AxiosError<ApiResponse<LoginResponse>>;
    console.error(apiError);

    return {
      status: false,
      message:
        apiError.response?.data.message || "Error al iniciar sesión",
    };
  }
};
