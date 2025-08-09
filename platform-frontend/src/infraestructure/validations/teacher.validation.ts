import * as Yup from 'yup';
import { TeacherModel } from '../../core/models/teacher.model';

export const teacherInitialValues: TeacherModel = {
     userID: "",
    phoneNumber: "",
    specialty: ""
};

export const teacherValidationSchema: Yup.ObjectSchema<TeacherModel> = Yup.object({
    userID: Yup.string()
        .required("El userID es requerido"),

    phoneNumber: Yup.string()
        .required("El Número es requerido."),

    specialty: Yup.string()
    .required("La especialidad es requerida"),

});