import { StudentCreateModel } from "./student-create.model";

export interface StudentEditModel extends StudentCreateModel {
  id: string;
}