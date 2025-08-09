// src/features/hooks/grades/useGrades.ts
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { getPaginationGradesAction } from "../../../core/actions/grades/get-pagination-grades.action";
import { GradeResponse } from "../../../infraestructure/interfaces/grade.response";

export const useGrades = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const gradesPaginationQuery = useQuery({
    queryKey: ["grades", page, pageSize, searchTerm],
    queryFn: () => getPaginationGradesAction(page, pageSize, searchTerm),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const refetch = gradesPaginationQuery.refetch;
  const refreshGrades = useCallback(() => {
    refetch();
  }, [refetch]);


  const pageData = gradesPaginationQuery.data?.data; // PageResponse<GradeResponse>
  const grades: GradeResponse[] = pageData?.items ?? [];
  const totalItems = pageData?.totalItems ?? 0;
  const totalPages = pageData?.totalPages ?? 0;

  return {
    // data
    gradesPaginationQuery,
    grades,        
    totalItems,
    totalPages,

    page,
    pageSize,
    searchTerm,

    setPage,
    setPageSize,
    setSearchTerm,

    refreshGrades,
  };
};
