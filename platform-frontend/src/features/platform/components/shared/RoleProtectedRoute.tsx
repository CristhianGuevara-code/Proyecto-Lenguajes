import { Navigate, Outlet } from "react-router";
import { Role } from "../../../../infraestructure/enums/role.enum";
import { useAuthStore } from "../../../stores/authStore";


interface Props {
    requiredRoles: Role[];
}

export const RoleProtectedRoute = ({requiredRoles} : Props) => {
    const {roles} = useAuthStore();

    const hasRequiredRoles = requiredRoles.some(role => roles?.includes(role));

    if(!hasRequiredRoles){
        return <Navigate to={"/"} replace />
    }
    

  return (
    <Outlet />
  )
}
