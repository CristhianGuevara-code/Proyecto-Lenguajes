export interface ParentResponse {
    id: string;
    phoneNumber: string;
    address: string;
    fullName: string;
    email: string;
    students: {
        id: string;
        fullName: string;
        birthDate: string;
        gradeId: string;
        gradeName?: string;
        subjectsIds: string[];
        subjectsNames: string;
    }[];
}
