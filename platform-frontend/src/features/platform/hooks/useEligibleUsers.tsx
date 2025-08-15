import { useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { EligibleUserDto, getEligibleUsersAction } from "../../../core/actions/users/get-eligible-users.action";

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export const useEligibleUsers = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebouncedValue(search, 300);

  const query = useQuery({
    queryKey: ["eligible-users", debounced, page],
    queryFn: () => getEligibleUsersAction(page, 10, debounced, "PADRE"),
    placeholderData : keepPreviousData,
    staleTime: 1000 * 60 * 2,
  });

  const items: EligibleUserDto[] = query.data?.items ?? [];
  const totalPages = query.data?.totalPages ?? 1;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const controls = useMemo(() => ({
    search,
    setSearch,
    page,
    setPage,
    canPrev,
    canNext,
  }), [search, page, canPrev, canNext]);

  return { query, items, controls };
};
