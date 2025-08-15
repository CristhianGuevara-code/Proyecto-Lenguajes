import { AxiosError } from "axios";
import { ApiResponse } from "../../../infraestructure/interfaces/api.response";
import { PageResponse } from "../../../infraestructure/interfaces/page.response";
import { StudentResponse } from "../../../infraestructure/interfaces/student.response";
import { eduRuralApi } from "../../api/edurural.api";
import { ApiErrorResponse } from "../../../infraestructure/interfaces/api-error.response";

export const getPaginationStudentsAction = async (page = 1, pageSize = 10, searchTerm = ""): 
Promise<ApiResponse<PageResponse<StudentResponse>>> => {
    try {
        const { data } = await eduRuralApi
        .get<ApiResponse<PageResponse<StudentResponse>>>(`/students`, {
            params: {
                page,
                pageSize,
                searchTerm
            }
        });

        // Filtramos para que solo aparezcan los estudiantes que no tienen padre asignado
        const students = (data?.data?.items ?? []).filter(student => !student.parentId);

        // Construimos el objeto con valores predeterminados para las propiedades opcionales
        const response: PageResponse<StudentResponse> = {
            items: students,
            currentPage: data?.data?.currentPage ?? 1,  // Valor predeterminado: 1
            hasNextPage: data?.data?.hasNextPage ?? false,  // Valor predeterminado: false
            hasPreviousPage: data?.data?.hasPreviousPage ?? false,  // Valor predeterminado: false
            pageSize: data?.data?.pageSize ?? 10,  // Valor predeterminado: 10
            totalItems: data?.data?.totalItems ?? 0,  // Valor predeterminado: 0
            totalPages: data?.data?.totalPages ?? 1,  // Valor predeterminado: 1
        };

        return {
            ...data, // Incluimos toda la respuesta original
            data: response
        };

    } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        console.error(apiError);

        if(apiError.response) {
            throw new Error(apiError.response.data.message);
        } else if (apiError.request) {
            throw new Error("Error de conexion");
        } else {
            throw new Error("Error desconocido");
        }
    }
}
