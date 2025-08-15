import { TeacherCreateModel } from "./teacher-create.model";

export interface TeacherEditModel extends TeacherCreateModel {
  id: string;
}