export interface StudentResponse {
    id: string;              
    fullName: string;       
    birthDate: string;       
    gradeId: string;         
    gradeName?: string;      
    parentId: string | null; // ID del padre (puede ser nulo si no hay relación)
    parentName: string | null; // Nombre del padre (puede ser nulo si no hay relación)
    subjectIds: string[];    
    subjectsNames?: string[]; 
}
