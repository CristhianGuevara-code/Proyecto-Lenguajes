import { EligibleUserDto } from "../../../../core/actions/users/get-eligible-users.action";
import { useEligibleUsers } from "../../hooks/useEligibleUsers";

type Props = {
  value?: string;                   // userId seleccionado
  onChange: (userId: string | undefined, user?: EligibleUserDto) => void;
  label?: string;
  helperText?: string;
};

export const UserSelect = ({ value, onChange, label = "Usuario", helperText }: Props) => {
  const { query, items, controls } = useEligibleUsers();

  return (
    <div>
      {label && <label className="block font-medium mb-1">{label}:</label>}

      {/* buscador */}
      <input
        type="text"
        value={controls.search}
        onChange={(e) => { controls.setSearch(e.target.value); controls.setPage(1); }}
        placeholder="Buscar por nombre o email…"
        className="w-full border p-2 rounded mb-2"
      />

      {/* resultados */}
      <div className="border rounded max-h-52 overflow-auto">
        {query.isLoading && <div className="p-2 text-sm text-gray-500">Buscando…</div>}
        {!query.isLoading && items.length === 0 && (
          <div className="p-2 text-sm text-gray-500">Sin resultados</div>
        )}

        {items.map((u) => {
          const selected = value === u.id;
          return (
            <button
              key={u.id}
              type="button"
              onClick={() => onChange(selected ? undefined : u.id, u)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50
                          ${selected ? "bg-blue-50" : ""}`}
            >
              <div className="font-medium">{u.fullName}</div>
              <div className="text-xs text-gray-600">{u.email}</div>
              {u.roles?.length ? (
                <div className="mt-1 text-[11px] text-gray-500">Roles: {u.roles.join(" • ")}</div>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* paginación simple */}
      <div className="flex items-center justify-between mt-2">
        <button
          type="button"
          disabled={!controls.canPrev || query.isFetching}
          onClick={() => controls.setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          ← Anterior
        </button>
        <span className="text-sm text-gray-600">
          Página {controls.page} {query.data ? `de ${query.data.totalPages}` : ""}
        </span>
        <button
          type="button"
          disabled={!controls.canNext || query.isFetching}
          onClick={() => controls.setPage((p) => p + 1)}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          Siguiente →
        </button>
      </div>

      {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
};
