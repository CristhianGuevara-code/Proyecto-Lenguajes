import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPaginationTeachersAction } from "../../../core/actions/teachers/get-pagination-teacher.action";
import { getOneTeacherAction } from "../../../core/actions/teachers/get-one-teacher.action";
import { TeacherCreateModel } from "../../../core/models/teacher-create.model";
import { createTeacherAction } from "../../../core/actions/teachers/create-teacher.action";
import { TeacherEditModel } from "../../../core/models/teacher-edit.model";
import { editTeacherAction } from "../../../core/actions/teachers/edit-teacher.action";
import { deleteTeacherAction } from "../../../core/actions/teachers/delete-teacher.action";

export const useTeachers = (teacherId?: string) => {
  // estado de paginación/búsqueda
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // listado con paginación
  const teachersPaginationQuery = useQuery({
    queryKey: ["teachers", page, pageSize, searchTerm],
    queryFn: () => getPaginationTeachersAction(page, pageSize, searchTerm),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const oneTeacherQuery = useQuery({
    queryKey: ["teacher", teacherId],
    queryFn: () => getOneTeacherAction(teacherId!),
    enabled: !!teacherId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // crear
  const createTeacherMutation = useMutation({
    mutationFn: (teacher: TeacherCreateModel) => createTeacherAction(teacher),
    onSuccess: (data) => {
      if (data.status) {
        teachersPaginationQuery.refetch();
        //navigate("/teachers");
      }
    },
  });

  // editar 
  const editTeacherMutation = useMutation({
    mutationFn: (teacher: TeacherEditModel) => editTeacherAction(teacher),
    onSuccess: (data) => {
      if (data.status) {
        teachersPaginationQuery.refetch();
        //navigate("/teachers");
      }
    },
  });

  // eliminar
  const deleteTeacherMutation = useMutation({
    mutationFn: (id: string) => deleteTeacherAction(id),
    onSuccess: (data) => {
      if (data.status) {
        teachersPaginationQuery.refetch();
       // navigate("/teachers");
      }
    },
  });

  // helper para refrescar listado
  const refreshTeachers = useCallback(() => {
    teachersPaginationQuery.refetch();
  }, [teachersPaginationQuery]);

  return {
    // data
    teachersPaginationQuery,
    oneTeacherQuery,

    // mutations
    createTeacherMutation,
    editTeacherMutation,
    deleteTeacherMutation,

    // paginación/búsqueda
    page,
    pageSize,
    searchTerm,
    setPage,
    setPageSize,
    setSearchTerm,

    // helper
    refreshTeachers,
  };
};
