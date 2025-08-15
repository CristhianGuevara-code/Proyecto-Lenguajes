export interface UserEditModel {
  id: string;
  fullName?: string;
  email?: string;
  birthDate?: string;
  roles?: string[];
  password?: string;          // <- opcional
  confirmPassword?: string;   // <- opcional
}