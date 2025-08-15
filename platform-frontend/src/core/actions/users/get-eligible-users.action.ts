import { eduRuralApi } from "../../api/edurural.api";

export interface EligibleUserDto {
  id: string;
  fullName: string;
  email: string;
  parentId?: string;
  roles: string[];
}

export interface EligibleUsersPage {
  items: EligibleUserDto[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export const getEligibleUsersAction = async (
  page: number,
  pageSize: number,
  searchTerm: string,
  role?: "PADRE" | "PROFESOR"
): Promise<EligibleUsersPage> => {

  //console.log('Usuaros Elegibles');
  //console.log('Parámetros enviados a la API:', { page, pageSize, searchTerm, role });

  // Llamada a la API
  const { data } = await eduRuralApi.get<{
    status: boolean;
    data: EligibleUsersPage;
    message: string;
  }>("/users/eligible", {
    params: { page, pageSize, searchTerm, role },
  });

  //console.log('Respuesta de la api');
  //console.log(data);

  // Revisamos qué trae 'items' antes de filtrar
  //console.log('Usuarios recibidos directamente desde la API antes del filtro:', data.data.items);

  // Filtramos solo usuarios que tengan el rol solicitado
  const filteredItems = data.data.items.filter(user => role ? user.roles.includes(role) : true);

  //console.log('Usuarios filtrados que llegarán al combobox:', filteredItems);

  // Retornamos la data final
  return {
    ...data.data,
    items: filteredItems,
  };
};
