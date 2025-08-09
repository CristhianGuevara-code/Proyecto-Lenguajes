import { LoginModel } from "../../core/models/login.model";
import { loginAction } from "../../core/actions/security/auth/login.action";
import { create } from "zustand";
import { Role } from "../../infraestructure/enums/role.enum";

export interface JwtPayload {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
    jti:                                                                  string;
    UserId:                                                               string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":       Role | Role[];
    exp:                                                                  number;
    iss:                                                                  string;
    aud:                                                                  string;
}


interface AuthStore {
    token?: string;
    refreshToken?: string;
    email?: string;
    roles?: Role[];
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
    roles: storedRoles,
    errorMessage: undefined,
    authenticated: istokenValid(storedToken),
    login: async (login: LoginModel) => {

        set ({errorMessage: 'undefined'})

        const response = await loginAction(login);

        console.log(response);

        if(response.status && response.data) {
            localStorage.setItem("token", response.data!.token);
            localStorage.setItem("email", response.data!.email);
            localStorage.setItem("refreshToken", response.data!.refreshToken);
            const payload = getPayload(response.data!.token);
            const roles = getRolesFromPayload(payload);

            set({
                token: response.data!.token, 
                refreshToken: response.data!.refreshToken,
                email: response.data!.email, 
                authenticated: true,
                roles: roles,

            });

            return;
        }

        set({errorMessage: response.message, authenticated: false});

        return;
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
        })
    },
     logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("refreshToken")
        set({token: undefined, refreshToken: undefined, email: undefined, authenticated: false});
    }
}))

function istokenValid(token?: string) : boolean {
    const payload = getPayload(token)
    if(!payload || !payload.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
}

function getRolesFromPayload(payload : JwtPayload | undefined) : Role[] | undefined {

    if(!payload) return undefined;
    const claim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

    const roles = payload[claim];
    if(!roles) return undefined;

    if(Array.isArray(roles)) return roles as Role[];
    return [roles as Role];
}

function getPayload(token?: string) : JwtPayload | undefined {
    if(!token) return undefined;

    try {
        return JSON.parse(atob(token.split('.')[1])) as JwtPayload;

    } catch {
        return undefined;
    }

}