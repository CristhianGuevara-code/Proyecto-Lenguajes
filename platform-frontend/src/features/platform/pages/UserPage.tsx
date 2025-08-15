// src/features/platform/pages/UsersAdminPage.tsx
import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrashAlt, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../stores/authStore";
import { Role as RoleEnum } from "../../../infraestructure/enums/role.enum";

import { useUsers } from "../hooks/useUsers";
import { getOneUserAction } from "../../../core/actions/users/get-one-user.action";
import { createUserAction } from "../../../core/actions/users/create-user.action";
import { editUserAction } from "../../../core/actions/users/edit-user.action";
import { eduRuralApi } from "../../../core/api/edurural.api";

import { UserResponse } from "../../../infraestructure/interfaces/user.response";
import { OneUserResponse } from "../../../infraestructure/interfaces/one-user.response";
import { UserCreateModel } from "../../../core/models/user-create.model";

type RoleItem = { id: string; name: string; description?: string };

type UserForm = {
  id: string;
  fullName: string;
  email: string;
  birthDate: string; // YYYY-MM-DD
  roles: string[];
  password: string;
  confirmPassword: string;
};

export function UserPage() {
  const navigate = useNavigate();
  const { authenticated, roles } = useAuthStore();
  const isAdmin = roles?.includes(RoleEnum.ADMIN);

  useEffect(() => {
    if (authenticated && !isAdmin) navigate("/platform", { replace: true });
  }, [authenticated, isAdmin, navigate]);

  if (!isAdmin) {
    return <div className="p-6 text-red-600">No tienes permiso para ver esta página.</div>;
  }

  // UI
  const [queryText, setQueryText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Hook usuarios
  const {
    usersPaginationQuery,
    deleteUserMutation,         
    refreshUsers,
    page, setPage,
    pageSize, setPageSize,
    setSearchTerm,
  } = useUsers();

  // Roles
  const rolesQuery = useQuery({
    queryKey: ["roles-all"],
    queryFn: async (): Promise<RoleItem[]> => {
      const { data } = await eduRuralApi.get<{ status: boolean; data: { items: RoleItem[] } }>(
        "/roles",
        { params: { page: 1, pageSize: 1000, searchTerm: "" } }
      );
      return data?.data?.items ?? [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const availableRoles = useMemo(() => {
    const items = rolesQuery.data ?? [];
    return items; // .filter(r => r.name !== "ADMIN")
  }, [rolesQuery.data]);

  // Dataset
  const dataset = usersPaginationQuery.data?.data;
  const rows: UserResponse[] = dataset?.items ?? [];
  const cur = dataset?.currentPage ?? 1;
  const totalPages = dataset?.totalPages ?? 1;
  const totalItems = dataset?.totalItems ?? 0;

  // Form
  const [form, setForm] = useState<UserForm>({
    id: "",
    fullName: "",
    email: "",
    birthDate: "",
    roles: [],
    password: "",
    confirmPassword: "",
  });

  // Búsqueda
  useEffect(() => {
    setSearchTerm(queryText);
    setPage(1);
  }, [queryText, setSearchTerm, setPage]);

  // Helpers
  const resetForm = () => {
    setForm({
      id: "",
      fullName: "",
      email: "",
      birthDate: "",
      roles: [],
      password: "",
      confirmPassword: "",
    });
    setModoEdicion(false);
  };

  const openCreate = () => {
    resetForm();
    setOpenModal(true);
  };

  const openEdit = async (row: UserResponse) => {
    const res = await getOneUserAction(row.id);
    if (res.status && res.data) {
      const d: OneUserResponse = res.data;
      setForm({
        id: d.id,
        fullName: d.fullName ?? "",
        email: d.email ?? "",
        birthDate: (d.birthDate ?? "").slice(0, 10),
        roles: d.roles ?? [],
        password: "",
        confirmPassword: "",
      });
      setModoEdicion(true);
      setOpenModal(true);
    }
  };

  // Eliminar (usa la mutation del hook)
  const onDelete = (id: string) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    deleteUserMutation.mutate(id, {
      onSuccess: (r) => {
        if (r.status) {
          refreshUsers();
        } else {
          alert(r.message ?? "No se pudo eliminar");
        }
      },
      onError: (err: any) => alert(err?.message ?? "Error al eliminar"),
    });
  };

  // Validaciones simples
  const isValidEmail = (s: string) => /\S+@\S+\.\S+/.test(s);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim()) return alert("El nombre es requerido.");
    if (!form.email.trim() || !isValidEmail(form.email)) return alert("Email inválido.");
    if (!form.birthDate) return alert("Fecha de nacimiento requerida.");
    if (!form.roles.length) return alert("Seleccione al menos un rol.");

    // Crear
    if (!modoEdicion) {
      if (!form.password) return alert("Contraseña requerida.");
      if (form.password !== form.confirmPassword) return alert("Las contraseñas no coinciden.");
      const payload: UserCreateModel = {
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        birthDate: form.birthDate,
        roles: form.roles,
        password: form.password,
        confirmPassword: form.confirmPassword,
      };
      try {
        const r = await createUserAction(payload);
        if (r.status) {
          setOpenModal(false);
          resetForm();
          refreshUsers();
        } else {
          alert(r.message ?? "Error al crear usuario");
        }
      } catch (err: any) {
        alert(err?.message ?? "Error al crear usuario");
      }
      return;
    }

    // Editar: solo enviar password si el usuario la cambió
    if (form.password || form.confirmPassword) {
      if (form.password !== form.confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }
    }

    const basePayload = {
      id: form.id,
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      birthDate: form.birthDate,
      roles: form.roles,
    };

    const payload: any = { ...basePayload };
    if (form.password && form.confirmPassword) {
      payload.password = form.password;
      payload.confirmPassword = form.confirmPassword;
    }

    try {
      const r = await editUserAction(payload);
      if (r.status) {
        setOpenModal(false);
        resetForm();
        refreshUsers();
      } else {
        alert(r.message ?? "Error al editar usuario");
      }
    } catch (err: any) {
      alert(err?.message ?? "Error al editar usuario");
    }
  };

  const loadingList = usersPaginationQuery.isLoading || rolesQuery.isLoading;

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-platform-darkblue">Usuarios</h1>
          <p className="text-sm text-gray-600">
            {totalItems} registro{totalItems === 1 ? "" : "s"} • página {cur} de {totalPages}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
            <input
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Buscar por nombre/email…"
              className="pl-9 pr-3 py-2 border rounded-lg w-64"
            />
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-platform-mintgreen text-white px-4 py-2 rounded-lg hover:opacity-90"
          >
            <FaPlus /> Nuevo
          </button>
        </div>
      </div>

      {/* Tabla desktop */}
      <div className="hidden md:block rounded-xl border bg-white shadow-sm overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Nacimiento</th>
              <th className="text-left px-4 py-3">Roles</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-3">{u.fullName ?? "-"}</td>
                <td className="px-4 py-3">{u.email ?? "-"}</td>
                <td className="px-4 py-3">{(u.birthDate ?? "").slice(0, 10)}</td>
                <td className="px-4 py-3">{u.roles?.join(", ") || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded border hover:bg-gray-50 inline-flex items-center gap-2"
                      onClick={() => openEdit(u)}
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
                      onClick={() => onDelete(u.id)}
                    >
                      <FaTrashAlt /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && !loadingList && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No hay registros.
                </td>
              </tr>
            )}

            {loadingList && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Cargando…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Lista móvil */}
      <div className="md:hidden space-y-3">
        {rows.map((u) => (
          <div key={u.id} className="rounded-xl border bg-white shadow-sm p-4">
            <div className="font-semibold">{u.fullName ?? "-"}</div>
            <div className="mt-2 text-sm">
              <div><span className="text-gray-500">Email:</span> {u.email ?? "-"}</div>
              <div><span className="text-gray-500">Nacimiento:</span> {(u.birthDate ?? "").slice(0,10)}</div>
              <div><span className="text-gray-500">Roles:</span> {u.roles?.join(", ") || "-"}</div>
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <button type="button" className="px-3 py-1.5 rounded border inline-flex items-center gap-2" onClick={() => openEdit(u)}>
                <FaEdit /> Editar
              </button>
              <button type="button" className="px-3 py-1.5 rounded border border-red-300 text-red-600 inline-flex items-center gap-2" onClick={() => onDelete(u.id)}>
                <FaTrashAlt /> Eliminar
              </button>
            </div>
          </div>
        ))}

        {rows.length === 0 && !loadingList && (
          <div className="text-center text-gray-500">No hay registros.</div>
        )}
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span>Filas por página:</span>
          <select
            className="border rounded px-2 py-1"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => setPage(Math.max(1, (dataset?.currentPage ?? 1) - 1))}
            disabled={(dataset?.currentPage ?? 1) <= 1 || usersPaginationQuery.isFetching}
          >
            ← Anterior
          </button>
          <span className="text-sm text-gray-600">Página {cur} de {totalPages}</span>
          <button
            type="button"
            className="px-3 py-1 rounded border disabled:opacity-50"
            onClick={() => setPage((dataset?.currentPage ?? 1) + 1)}
            disabled={(dataset?.currentPage ?? 1) >= totalPages || usersPaginationQuery.isFetching}
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* Modal crear/editar con scroll interno */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-3 border-b">
              <h3 className="font-semibold">
                {modoEdicion ? "Editar usuario" : "Nuevo usuario"}
              </h3>
              <button
                type="button"
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setOpenModal(false)}
                aria-label="Cerrar"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Nombre completo</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={form.fullName}
                    onChange={(e) => setForm(p => ({ ...p, fullName: e.target.value }))}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded px-3 py-2"
                    value={form.email}
                    onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="correo@dominio.com"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Fecha de nacimiento</label>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={form.birthDate}
                    onChange={(e) => setForm(p => ({ ...p, birthDate: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-medium mb-1">Roles</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableRoles.map((r) => {
                      const checked = form.roles.includes(r.name);
                      return (
                        <label key={r.id} className="flex items-center gap-2 border rounded px-3 py-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const next = new Set(form.roles);
                              if (e.target.checked) next.add(r.name);
                              else next.delete(r.name);
                              setForm(p => ({ ...p, roles: Array.from(next) }));
                            }}
                          />
                          <span className="text-sm">{r.name}</span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Selecciona uno o varios roles. (Recuerda que ADMIN otorga todos los permisos.)
                  </p>
                </div>

                {/* Contraseña (requerida al crear; opcional al editar) */}
                <div>
                  <label className="block font-medium mb-1">
                    {modoEdicion ? "Nueva contraseña (opcional)" : "Contraseña"}
                  </label>
                  <input
                    type="password"
                    className="w-full border rounded px-3 py-2"
                    value={form.password}
                    onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="********"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    {modoEdicion ? "Confirmar nueva contraseña" : "Confirmar contraseña"}
                  </label>
                  <input
                    type="password"
                    className="w-full border rounded px-3 py-2"
                    value={form.confirmPassword}
                    onChange={(e) => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="********"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="px-4 py-2 rounded border" onClick={() => setOpenModal(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-platform-mintgreen text-white hover:opacity-90"
                  disabled={usersPaginationQuery.isFetching}
                >
                  {modoEdicion ? "Guardar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default UserPage;
