export interface OneStudentResponse {
    id:          string;
    fullName:    string;
    birthDate:   string;
    gradeId:     string;
    gradeName:   string;
    subjectsIds: string[];
    subjectsNames?: string[];
}

