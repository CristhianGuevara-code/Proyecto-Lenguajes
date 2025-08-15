export interface UserCreateModel {
    fullName:        string;
    email:           string;
    birthDate:       string;
    roles:           string[];
    password:        string;
    confirmPassword: string;
}
