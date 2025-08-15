import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPaginationUsersAction } from "../../../core/actions/users/get-pagination-user.action";
import { getOneUserAction } from "../../../core/actions/users/get-one-user.action";
import { UserCreateModel } from "../../../core/models/user-create.model";
import { createUserAction } from "../../../core/actions/users/create-user.action";
import { UserEditModel } from "../../../core/models/user-edit.model";
import { editUserAction } from "../../../core/actions/users/edit-user.action";
import { deleteUserAction } from "../../../core/actions/users/delete-user.action";

export const useUsers = (userId?: string) => {
  // estado de paginación/búsqueda
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // listado con paginación
  const usersPaginationQuery = useQuery({
    queryKey: ["users", page, pageSize, searchTerm],
    queryFn: () => getPaginationUsersAction(page, pageSize, searchTerm),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const oneUserQuery = useQuery({
    queryKey: ["users", userId],
    queryFn: () => getOneUserAction(userId!),
    enabled: !!userId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // crear
  const createUserMutation = useMutation({
    mutationFn: (user: UserCreateModel) => createUserAction(user),
    onSuccess: (data) => {
      if (data.status) {
        usersPaginationQuery.refetch();
        //navigate("/teachers");
      }
    },
  });

  // editar 
  const editUserMutation = useMutation({
    mutationFn: (user: UserEditModel) => editUserAction(user),
    onSuccess: (data) => {
      if (data.status) {
        usersPaginationQuery.refetch();
        //navigate("/teachers");
      }
    },
  });

  // eliminar
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUserAction(id),
    onSuccess: (data) => {
      if (data.status) {
        usersPaginationQuery.refetch();
       // navigate("/teachers");
      }
    },
  });

  // helper para refrescar listado
  const refreshUsers = useCallback(() => {
    usersPaginationQuery.refetch();
  }, [usersPaginationQuery]);

  return {
    // data
    usersPaginationQuery,
    oneUserQuery,

    // mutations
    createUserMutation,
    editUserMutation,
    deleteUserMutation,

    // paginación/búsqueda
    page,
    pageSize,
    searchTerm,
    setPage,
    setPageSize,
    setSearchTerm,

    // helper
    refreshUsers,
  };
};
