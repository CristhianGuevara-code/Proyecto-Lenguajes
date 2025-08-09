// features/hooks/students/useStudents.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPaginationStudentsAction } from "../../../core/actions/students/get-pagination-student.action";
import { getOneStudentAction } from "../../../core/actions/students/get-one-student.action";
import { createStudentAction } from "../../../core/actions/students/create-student.action";
import { editStudentAction } from "../../../core/actions/students/edit-student.action";
import { deleteStudentAction } from "../../../core/actions/students/delete-student.action";
import { StudentCreateModel } from "../../../core/models/student-create.model";
import { StudentEditModel } from "../../../core/models/student-edit.model";

export const useStudents = (studentId?: string) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const studentsPaginationQuery = useQuery({
    queryKey: ["students", page, pageSize, searchTerm],
    queryFn: () => getPaginationStudentsAction(page, pageSize, searchTerm),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const oneStudentQuery = useQuery({
    queryKey: ["student", studentId],
    queryFn: () => getOneStudentAction(studentId!),
    enabled: !!studentId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // CREATE usa StudentCreateModel
  const createStudentMutation = useMutation({
    mutationFn: (student: StudentCreateModel) => createStudentAction(student),
    onSuccess: (data) => {
      if (data.status) {
        studentsPaginationQuery.refetch();
        navigate("/students");
      }
    },
  });

  // EDIT usa StudentEditModel y NO depende de studentId externo
  const editStudentMutation = useMutation({
    mutationFn: (student: StudentEditModel) => editStudentAction(student),
    onSuccess: (data) => {
      if (data.status) {
        studentsPaginationQuery.refetch();
        navigate("/students");
      }
    },
  });

  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => deleteStudentAction(id),
    onSuccess: (data) => {
      if (data.status) {
        studentsPaginationQuery.refetch();
        navigate("/students");
      }
    },
  });

  const refreshStudents = useCallback(() => {
    studentsPaginationQuery.refetch();
  }, [studentsPaginationQuery]);

  return {
    // data
    studentsPaginationQuery,
    oneStudentQuery,

    // mutations
    createStudentMutation,
    editStudentMutation,
    deleteStudentMutation,

    // pagination state
    page, pageSize, searchTerm,
    setPage, setPageSize, setSearchTerm,

    // helper
    refreshStudents,
  };
};
