import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EligibleUserDto, getEligibleUsersAction } from "../../../../core/actions/users/get-eligible-users.action";

type Props = {
  value?: string; // userId seleccionado
  onChange: (userId: string | undefined, user?: EligibleUserDto) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  requiredRole?: "PADRE" | "PROFESOR";
};

// Hook para debounce
function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export const UserComboBox = ({
  value,
  onChange,
  label = "Usuario",
  placeholder = "Seleccionar usuario…",
  helperText,
  disabled,
  requiredRole,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debounced = useDebounced(search, 300);
  const boxRef = useRef<HTMLDivElement>(null);

  const page = 1;
  const pageSize = 50;

  // Traer usuarios directamente usando getEligibleUsersAction
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["eligible-users", debounced, requiredRole],
    queryFn: () => getEligibleUsersAction(page, pageSize, debounced, requiredRole),
    staleTime: 1000 * 60 * 2, // 2 minutos
    enabled: open && !disabled,
  });

  const users = usersData?.items ?? [];

  // Log para ver qué usuarios llegan
  useEffect(() => {
    console.log("Usuarios recibidos desde la API: ", users);
  }, [users]);

  // user seleccionado (para mostrar nombre/email en la cajita)
  const selectedUser = useMemo(
    () => users.find(u => u.id === value),
    [users, value]
  );

  // cerrar al clickear fuera
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={boxRef} className="relative">
      {label && <label className="block font-medium mb-1">{label}:</label>}

      {/* caja */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full border rounded-lg px-3 py-2 text-left bg-white hover:bg-gray-50 disabled:opacity-50"
      >
        {selectedUser ? (
          <div className="flex flex-col">
            <span className="font-medium">{selectedUser.fullName}</span>
            <span className="text-xs text-gray-600">{selectedUser.email}</span>
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </button>

      {/* dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border bg-white shadow-xl ring-1 ring-black/5">
          {/* buscador dentro del dropdown */}
          <div className="p-2 border-b">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o email…"
              className="w-full border rounded-md px-2 py-1.5"
            />
          </div>

          {/* lista */}
          <div className="max-h-56 overflow-auto">
            {isLoading && (
              <div className="px-3 py-2 text-sm text-gray-500">Cargando…</div>
            )}

            {!isLoading && users.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">Sin resultados</div>
            )}

            {users.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  const next = value === u.id ? undefined : u.id;
                  onChange(next, u);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                  value === u.id ? "bg-blue-50 ring-inset ring-1" : ""
                }`}
              >
                <div className="font-medium">{u.fullName}</div>
                <div className="text-xs text-gray-600">{u.email}</div>
                {u.roles?.length ? (
                  <div className="mt-1 text-[11px] text-gray-500">
                    Roles: {u.roles.join(" • ")}
                  </div>
                ) : null}
              </button>
            ))}
          </div>

          {/* acciones footer */}
          <div className="flex justify-between items-center p-2 border-t">
            <button
              type="button"
              className="text-sm text-gray-600 hover:underline"
              onClick={() => { onChange(undefined, undefined); setOpen(false); }}
            >
              Limpiar selección
            </button>
            <button
              type="button"
              className="text-sm text-gray-600 hover:underline"
              onClick={() => setOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
};
