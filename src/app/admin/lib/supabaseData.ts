import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";

type Updater<T> = T | ((prev: T) => T);

function resolve<T>(updater: Updater<T>, prev: T): T {
  return typeof updater === "function" ? (updater as (p: T) => T)(prev) : updater;
}

/**
 * Coleção de linhas de uma tabela, com a mesma forma [items, setItems] do
 * useLocalStorage. setItems diffa o array anterior contra o novo (por id)
 * para decidir quais linhas inserir, atualizar ou remover no Supabase —
 * assim o código de cada módulo (que já chama setX(prev => [...])) não
 * precisou ser reescrito.
 */
export function useSupabaseTable<T extends { id: string }>(
  table: string,
  fromRow: (row: any) => T,
  toRow: (item: T) => Record<string, unknown>,
) {
  const [items, setItems] = useState<T[]>([]);
  const itemsRef = useRef<T[]>([]);
  itemsRef.current = items;

  useEffect(() => {
    let cancelled = false;
    supabase
      .from(table)
      .select("*")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error(`[supabase] falha ao carregar ${table}`, error);
          return;
        }
        setItems((data ?? []).map(fromRow));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

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
        supabase
          .from(table)
          .delete()
          .eq("id", i.id)
          .then(({ error }) => error && console.error(`[supabase] falha ao remover ${table}`, error));
      });
      added.forEach((i) => {
        supabase
          .from(table)
          .insert(toRow(i))
          .then(({ error }) => error && console.error(`[supabase] falha ao inserir ${table}`, error));
      });
      updated.forEach((i) => {
        supabase
          .from(table)
          .update(toRow(i))
          .eq("id", i.id)
          .then(({ error }) => error && console.error(`[supabase] falha ao atualizar ${table}`, error));
      });
    },
    [table],
  );

  return [items, setValue] as const;
}

/**
 * Um único valor de configuração (categorias, meta, template) guardado em
 * app_settings, com a mesma forma [value, setValue] do useLocalStorage.
 */
export function useSupabaseSetting<T>(key: string, initial: T) {
  const [value, setValueState] = useState<T>(initial);

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("app_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error(`[supabase] falha ao carregar setting ${key}`, error);
          return;
        }
        if (data) setValueState(data.value as T);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback(
    (updater: Updater<T>) => {
      setValueState((prev) => {
        const next = resolve(updater, prev);
        supabase
          .from("app_settings")
          .upsert({ key, value: next as never })
          .then(({ error }) => error && console.error(`[supabase] falha ao salvar setting ${key}`, error));
        return next;
      });
    },
    [key],
  );

  return [value, setValue] as const;
}
