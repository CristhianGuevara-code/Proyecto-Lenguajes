import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { getPaginationGuidesAction } from "../../../core/actions/guides/get-pagination-guide.action";
import { getOneGuideAction } from "../../../core/actions/guides/get-one-guide.action";
import { createGuideAction } from "../../../core/actions/guides/create-guide.action";
import { editGuideAction } from "../../../core/actions/guides/edit-guide.action";
import { deleteGuideAction } from "../../../core/actions/guides/delete-guide.action";
import { GuideCreateModel } from "../../../core/models/guide-create.model";
import { GuideEditModel } from "../../../core/models/guide-edit.model";

// ================= Hook =================
export const useGuides = (guideId?: string) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const queryClient = useQueryClient();

  // listado con paginación
  const guidesPaginationQuery = useQuery({
    queryKey: ["guides:list", { page, pageSize, searchTerm }],
    queryFn: () => getPaginationGuidesAction(page, pageSize, searchTerm),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // un registro (opcional)
  const oneGuideQuery = useQuery({
    queryKey: ["guide:one", guideId],
    queryFn: () => getOneGuideAction(guideId!),
    enabled: !!guideId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // ================= Mutations =================

 // crear guía
const createGuideMutation = useMutation({
  mutationFn: (guide: GuideCreateModel) => createGuideAction(guide),
  onSuccess: (res) => {
    if (res.status) queryClient.invalidateQueries({ queryKey: ["guides:list"] });
  },
});

// editar guía
const editGuideMutation = useMutation({
  mutationFn: (guide: GuideEditModel) => editGuideAction(guide),
  onSuccess: (res) => {
    if (res.status) {
      queryClient.invalidateQueries({ queryKey: ["guides:list"] });
      if (guideId) queryClient.invalidateQueries({ queryKey: ["guide:one", guideId] });
    }
  },
});

  // eliminar guía
  const deleteGuideMutation = useMutation({
    mutationFn: (id: string) => deleteGuideAction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guides:list"] });
    },
  });

  // helper para refrescar listado manualmente
  const refreshGuides = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["guides:list"] });
  }, [queryClient]);

  return {
    // queries
    guidesPaginationQuery,
    oneGuideQuery,

    // mutations
    createGuideMutation,
    editGuideMutation,
    deleteGuideMutation,

    // paginación/búsqueda (state + setters)
    page,
    setPage,
    pageSize,
    setPageSize,
    searchTerm,
    setSearchTerm,

    // helper
    refreshGuides,
  };
};


/*import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { getPaginationGuidesAction } from "../../../core/actions/guides/get-pagination-guide.action";
import { getOneGuideAction } from "../../../core/actions/guides/get-one-guide.action";
import { createGuideAction } from "../../../core/actions/guides/create-guide.action";
import { editGuideAction } from "../../../core/actions/guides/edit-guide.action";
import { deleteGuideAction } from "../../../core/actions/guides/delete-guide.action";
import { GuideCreateModel } from "../../../core/models/guide-create.model";
import { GuideEditModel } from "../../../core/models/guide-edit.model";

export const useGuides = (guideId?: string) => {
  // estado de paginación/búsqueda
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const queryClient = useQueryClient();

  // listado con paginación
  const guidesPaginationQuery = useQuery({
    queryKey: ["guides:list", { page, pageSize, searchTerm }],
    queryFn: () => getPaginationGuidesAction(page, pageSize, searchTerm),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // un registro (opcional)
  const oneGuideQuery = useQuery({
    queryKey: ["guide:one", guideId],
    queryFn: () => getOneGuideAction(guideId!),
    enabled: !!guideId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

   // crear
  const createGuideMutation = useMutation({
    mutationFn: (guide: GuideCreateModel) => createGuideAction(guide),
    onSuccess: (res) => {
      if (res.status) {
        // invalida la lista para que se refresque
        queryClient.invalidateQueries({ queryKey: ["guides:list"] });
      }
    },
  });

  // editar
  const editGuideMutation = useMutation({
    mutationFn: (guide: GuideEditModel) => editGuideAction(guide),
    onSuccess: (res) => {
      if (res.status) {
        queryClient.invalidateQueries({ queryKey: ["guides:list"] });
        if (guideId) queryClient.invalidateQueries({ queryKey: ["guide:one", guideId] });
      }
    },
  }); 

  

  // eliminar
  const deleteGuideMutation = useMutation({
    mutationFn: (id: string) => deleteGuideAction(id),
    onSuccess: (res) => {
      if (res.status) {
        queryClient.invalidateQueries({ queryKey: ["guides:list"] });
      }
    },
  });

  // helper para refrescar listado manualmente
  const refreshGuides = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["guides:list"] });
  }, [queryClient]);

  return {
    // queries
    guidesPaginationQuery,
    oneGuideQuery,

    // mutations
    createGuideMutation,
    editGuideMutation,
    deleteGuideMutation,

    // paginación/búsqueda (state + setters)
    page, setPage,
    pageSize, setPageSize,
    searchTerm, setSearchTerm,

    // helper
    refreshGuides,
  };
};*/
