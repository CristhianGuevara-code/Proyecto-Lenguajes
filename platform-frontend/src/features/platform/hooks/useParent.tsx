import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getOneParentAction } from "../../../core/actions/parents/get-one-parent.action";
import { createParentAction } from "../../../core/actions/parents/create-parent.action";
import { editParentAction } from "../../../core/actions/parents/edit-parent.action";
import { deleteParentAction } from "../../../core/actions/parents/delete-parent.action";

import { ParentEditModel } from "../../../core/models/parent-edit.model";
import { getPaginationParentsAction } from "../../../core/actions/parents/get-pagination-parent.action";
import { ParentCreateModel } from "../../../core/models/parent-create.model";

export const useParents = (parentId?: string) => {
  // estado de paginación/búsqueda
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const navigate = useNavigate();

  // listado con paginación
  const parentsPaginationQuery = useQuery({
    queryKey: ["parents", {page, pageSize, searchTerm}],
    queryFn: () => getPaginationParentsAction(page, pageSize, searchTerm),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });


  // detalle (solo si viene parentId)
  const oneParentQuery = useQuery({
    queryKey: ["parent", parentId],
    queryFn: () => getOneParentAction(parentId!),
    enabled: !!parentId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // crear
  const createParentMutation = useMutation({
    mutationFn: (parent: ParentCreateModel) => createParentAction(parent),
    onSuccess: (data) => {
      if (data.status) {
        parentsPaginationQuery.refetch();
        navigate("/parents");
      }
    },
  });

  // editar (usa ParentEditModel con id embebido)
  const editParentMutation = useMutation({
    mutationFn: (parent: ParentEditModel) => editParentAction(parent),
    onSuccess: (data) => {
      if (data.status) {
        parentsPaginationQuery.refetch();
        navigate("/parents");
      }
    },
  });

  // eliminar
  const deleteParentMutation = useMutation({
    mutationFn: (id: string) => deleteParentAction(id),
    onSuccess: (data) => {
      if (data.status) {
        parentsPaginationQuery.refetch();
        navigate("/parents");
      }
    },
  });

  // helper para refrescar listado
  const refreshParents = useCallback(() => {
    parentsPaginationQuery.refetch();
  }, [parentsPaginationQuery]);

  return {
    // data
    parentsPaginationQuery,
    oneParentQuery,

    // mutations
    createParentMutation,
    editParentMutation,
    deleteParentMutation,

    // paginación/búsqueda
    page,
    pageSize,
    searchTerm,
    setPage,
    setPageSize,
    setSearchTerm,

    // helper
    refreshParents,
  };
};
