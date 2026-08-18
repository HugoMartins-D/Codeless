import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import { uid } from "./storage";

/** Precisa bater com a função public.is_admin() no banco. */
export const ADMIN_EMAIL = "djhugomartis2018@gmail.com";

/** Módulos que o admin pode conceder a outros logins pela tela de Acessos. */
export const GRANTABLE_MODULES = ["financeiro", "contratos", "demandas", "clientes"] as const;

export interface MyAccess {
  loading: boolean;
  isAdmin: boolean;
  moduleAccess: string[];
}

export function hasAccess(access: MyAccess, module: string): boolean {
  return access.isAdmin || access.moduleAccess.includes(module);
}

export function useMyAccess(session: Session | null): MyAccess {
  const email = session?.user.email;
  const [state, setState] = useState<MyAccess>({ loading: true, isAdmin: false, moduleAccess: [] });

  useEffect(() => {
    if (!email) {
      setState({ loading: false, isAdmin: false, moduleAccess: [] });
      return;
    }

    if (email === ADMIN_EMAIL) {
      setState({ loading: false, isAdmin: true, moduleAccess: [...GRANTABLE_MODULES] });
      return;
    }

    let cancelled = false;
    (async () => {
      const { data: existing, error: selectError } = await supabase
        .from("collaborators")
        .select("module_access")
        .eq("email", email)
        .maybeSingle();

      if (selectError) {
        console.error("[access] falha ao buscar permissões", selectError);
        if (!cancelled) setState({ loading: false, isAdmin: false, moduleAccess: [] });
        return;
      }

      if (existing) {
        if (!cancelled) setState({ loading: false, isAdmin: false, moduleAccess: existing.module_access ?? [] });
        return;
      }

      // Primeiro login desse e-mail: registra como pendente (sem nenhum acesso ainda).
      const { error: insertError } = await supabase.from("collaborators").insert({
        id: uid(),
        name: email.split("@")[0],
        email,
        module_access: [],
        client_access: "all",
      });
      if (insertError) console.error("[access] falha ao auto-registrar colaborador", insertError);
      if (!cancelled) setState({ loading: false, isAdmin: false, moduleAccess: [] });
    })();

    return () => {
      cancelled = true;
    };
  }, [email]);

  return state;
}
