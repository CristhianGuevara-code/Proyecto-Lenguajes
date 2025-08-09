import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPaginationSubjectsAction } from "../../../core/actions/subjects/get-pagination-subject.action";
import { getOneSubjectAction } from "../../../core/actions/subjects/get-one-subject.action";
import { SubjectModel } from "../../../core/models/subject.model";
import { createSubjectAction } from "../../../core/actions/subjects/create-subject.action";
import { editSubjectAction } from "../../../core/actions/subjects/edit-subject.action";
import { deleteSubjectAction } from "../../../core/actions/subjects/delete-subject.action";
import { SubjectCreateModel } from "../../../core/models/subject-create.model";

export const useSubjects = (subjectId?: string) => {
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  
  const subjectsPaginationQuery = useQuery({
    queryKey: ["subjects", page, pageSize, searchTerm], // Unique key 
    queryFn: () => getPaginationSubjectsAction(page, pageSize, searchTerm),
    staleTime: 1000 * 60 * 5, // 5M
    refetchOnWindowFocus: false,
  });

  const oneSubjectQuery = useQuery({
    queryKey: ["subject", subjectId],
    queryFn: () => getOneSubjectAction(subjectId!),
    enabled: !!subjectId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  const createSubjectMutation = useMutation({
    mutationFn: (subject: SubjectCreateModel) => createSubjectAction(subject),
    onSuccess: (data) => {
      if(data.status) {
        navigate("/subjects");
      }
    },
    onError: (data) => {
      console.log(data);
    }
  });

  const editSubjectMutation = useMutation({
    mutationFn: (subject: SubjectModel) => editSubjectAction(subject, subject.id!),
    onSuccess: (data) => {
      if(data.status) {
        refreshSubjects();
        navigate("/subjects");
      }
    },
    onError: (data) => {
      console.log(data);
    },
  });

    const deleteSubjectMutation = useMutation({
    mutationFn: (id: string) => deleteSubjectAction(id),
    onSuccess: (data) => {
      if(data.status) {
        refreshSubjects();
        navigate("/subjects");
      }
    },
    onError: (data) => {
      console.log(data);
    },
  });

  const refetch = subjectsPaginationQuery.refetch;

  const refreshSubjects = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    // Properties
    page,
    pageSize,
    searchTerm,
    subjectsPaginationQuery,
    oneSubjectQuery,
    createSubjectMutation,
    editSubjectMutation,
    deleteSubjectMutation,

    // Methods
    setPage,
    setPageSize,
    setSearchTerm,
    refreshSubjects,
  }
}