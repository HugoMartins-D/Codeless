import { useCallback, useEffect, useRef, useState } from "react";
import { apiGet, apiSend } from "./apiClient";

type Updater<T> = T | ((prev: T) => T);

function resolve<T>(updater: Updater<T>, prev: T): T {
  return typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
}

/** Mapeia o nome de "tabela" (herdado do Supabase) para o caminho real da API nova. */
const TABLE_ENDPOINT: Record<string, string> = {
  clients: "/clients",
  transactions: "/transactions",
  contracts: "/contracts",
  tasks: "/tasks",
  collaborators: "/collaborators",
  client_status_history: "/status-history",
  profiles: "/profiles",
};

/** Restringe a query a linhas cuja `column` esteja em `values` — mantido só por compatibilidade de assinatura;
 * a restrição por clientAccess agora é aplicada no backend (Lambda), a partir do JWT do usuário logado. */
export interface TableFilter {
  column: string;
  values: string[];
}

/**
 * Coleção de itens de um recurso da API, com a mesma forma [items, setItems] do
 * useLocalStorage. setItems diffa o array anterior contra o novo (por id) para
 * decidir quais itens criar, atualizar ou remover via HTTP — assim o código de
 * cada módulo (que já chama setX(prev => [...])) não precisou ser reescrito.
 *
 * `fromRow`/`toRow` são aceitos só por compatibilidade com as chamadas existentes
 * (vinham de lib/mappers.ts, para converter linhas snake_case do Postgres) — a API
 * nova já devolve/recebe os itens no formato final usado pelo app, então não são
 * mais necessários e ficam sem uso aqui.
 */
export function useSupabaseTable<T extends { id: string }>(
  table: string,
  _fromRow: (row: any) => T,
  _toRow: (item: T) => Record<string, unknown>,
  filter?: TableFilter | null,
) {
  const endpoint = TABLE_ENDPOINT[table] ?? `/${table}`;
  const [items, setItems] = useState<T[]>([]);
  const itemsRef = useRef<T[]>([]);
  itemsRef.current = items;

  useEffect(() => {
    if (filter && filter.values.length === 0) {
      setItems([]);
      return;
    }

    let cancelled = false;
    apiGet<T[]>(endpoint)
      .then((data) => {
        if (!cancelled) setItems(data ?? []);
      })
      .catch((err) => console.error(`[api] falha ao carregar ${endpoint}`, err));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const setValue = useCallback(
    (updater: Updater<T[]>) => {
      const prev = itemsRef.current;
      const next = resolve(updater, prev);
      setItems(next);

      const prevIds = new Set(prev.map((i) => i.id));
      const nextIds = new Set(next.map((i) => i.id));

      const removed = prev.filter((i) => !nextIds.has(i.id));
      const added = next.filter((i) => !prevIds.has(i.id));
      const updated = next.filter((i) => {
        const before = prev.find((p) => p.id === i.id);
        return !!before && JSON.stringify(before) !== JSON.stringify(i);
      });

      removed.forEach((i) => {
        apiSend(`${endpoint}/${i.id}`, "DELETE").catch((err) => console.error(`[api] falha ao remover ${endpoint}`, err));
      });
      added.forEach((i) => {
        apiSend(endpoint, "POST", i).catch((err) => console.error(`[api] falha ao inserir ${endpoint}`, err));
      });
      updated.forEach((i) => {
        apiSend(`${endpoint}/${i.id}`, "PUT", i).catch((err) => console.error(`[api] falha ao atualizar ${endpoint}`, err));
      });
    },
    [endpoint],
  );

  return [items, setValue] as const;
}

/**
 * Um único valor de configuração (categorias, meta, template) guardado em
 * /settings/{key}, com a mesma forma [value, setValue] do useLocalStorage.
 */
export function useSupabaseSetting<T>(key: string, initial: T) {
  const [value, setValueState] = useState<T>(initial);

  useEffect(() => {
    let cancelled = false;
    apiGet<{ value: T }>(`/settings/${key}`)
      .then((data) => {
        if (!cancelled && data) setValueState(data.value);
      })
      .catch((err) => console.error(`[api] falha ao carregar setting ${key}`, err));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (updater: Updater<T>) => {
      setValueState((prev) => {
        const next = resolve(updater, prev);
        apiSend(`/settings/${key}`, "PUT", { value: next }).catch((err) => console.error(`[api] falha ao salvar setting ${key}`, err));
        return next;
      });
    },
    [key],
  );

  return [value, setValue] as const;
}
