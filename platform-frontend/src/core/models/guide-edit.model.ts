export interface GuideEditModel {
    id: string;
    title?:       string;
    description?: string;
    gradeId?:     string;
    subjectId?:   string;
    file?: File | null; 
}