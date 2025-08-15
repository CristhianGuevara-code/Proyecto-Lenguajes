import { create } from "zustand";
import { Role } from "../../infraestructure/enums/role.enum";
import { loginAction } from "../../core/actions/security/auth/login.action";
import { getStudentIdByUserId } from "../../core/actions/users/get-student-id-by-userId";
import { LoginModel } from "../../core/models/login.model";

export interface JwtPayload {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  jti: string;
  UserId: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": Role | Role[];
  exp: number;
  iss: string;
  aud: string;
}

interface AuthStore {
  token?: string;
  refreshToken?: string;
  email?: string;
  roles?: Role[];
  studentId?: string;
  authenticated: boolean;
  errorMessage?: string;
  login: (login: LoginModel) => void;
  logout: () => void;
  setTokens: (token: string, refreshToken: string) => void;
}

const storedToken = localStorage.getItem('token') || undefined;
const storedEmail = localStorage.getItem('email') || undefined;
const storedPayload = getPayload(storedToken);
const storedRoles = getRolesFromPayload(storedPayload);
const storedRefreshToken = localStorage.getItem('refreshToken') || undefined;

export const useAuthStore = create<AuthStore>()((set) => ({
  token: storedToken,
  refreshToken: storedRefreshToken,
  email: storedEmail,
  studentId: "",
  roles: storedRoles,
  errorMessage: undefined,
  authenticated: istokenValid(storedToken),
  login: async (login: LoginModel) => {
    set({ errorMessage: 'undefined' });

    const response = await loginAction(login);

    if (response.status && response.data) {
      const token = response.data!.token;
      const refreshToken = response.data!.refreshToken;
      const email = response.data!.email;

      // Decodificamos el JWT para obtener roles y userId
      const payload = getPayload(token);
      const roles = getRolesFromPayload(payload);
      const userId = payload?.UserId; // <-- Usamos el GUID del token

      // Después del login, obtenemos el studentId usando el userId
      let studentId = '';
      try {
        if (userId) {
          const studentResponse = await getStudentIdByUserId(userId);
          studentId = studentResponse.studentId;
        }
      } catch (error) {
        console.error("Error al obtener el studentId:", error);
      }

      // Guardamos en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      localStorage.setItem("refreshToken", refreshToken);

      // Actualizamos el store
      set({
        token,
        refreshToken,
        email,
        studentId,
        authenticated: true,
        roles,
      });

      return;
    }

    set({ errorMessage: response.message, authenticated: false });
  },
  setTokens: (token: string, refreshToken: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    const payload = getPayload(token);
    const roles = getRolesFromPayload(payload);

    set({
      token,
      refreshToken,
      roles,
      authenticated: istokenValid(token)
    });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("refreshToken");
    set({ token: undefined, refreshToken: undefined, email: undefined, studentId: "", authenticated: false });
  }
}));

function istokenValid(token?: string): boolean {
  const payload = getPayload(token);
  if (!payload || !payload.exp) return false;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}

function getRolesFromPayload(payload: JwtPayload | undefined): Role[] | undefined {
  if (!payload) return undefined;
  const claim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

  const roles = payload[claim];
  if (!roles) return undefined;

  if (Array.isArray(roles)) return roles as Role[];
  return [roles as Role];
}

function getPayload(token?: string): JwtPayload | undefined {
  if (!token) return undefined;

  try {
    return JSON.parse(atob(token.split('.')[1])) as JwtPayload;
  } catch {
    return undefined;
  }
}


