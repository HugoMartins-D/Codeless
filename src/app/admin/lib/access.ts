import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import { uid } from "./storage";
import type { CollaboratorStatus } from "../types";

/** Precisa bater com a função public.is_admin() no banco. */
export const ADMIN_EMAIL = "djhugomartis2018@gmail.com";

/** Módulos que o admin pode conceder a outros logins pela tela de Acessos. */
export const GRANTABLE_MODULES = ["financeiro", "contratos", "demandas", "clientes"] as const;

export interface MyAccess {
  loading: boolean;
  isAdmin: boolean;
  /** null só para o admin, que não tem linha em collaborators. */
  status: CollaboratorStatus | null;
  moduleAccess: string[];
}

export function hasAccess(access: MyAccess, module: string): boolean {
  return access.isAdmin || access.moduleAccess.includes(module);
}

const initialState: MyAccess = { loading: true, isAdmin: false, status: null, moduleAccess: [] };

export function useMyAccess(session: Session | null): MyAccess {
  const email = session?.user.email;
  const [state, setState] = useState<MyAccess>(initialState);

  useEffect(() => {
    if (!email) {
      setState({ loading: false, isAdmin: false, status: null, moduleAccess: [] });
      return;
    }

    if (email === ADMIN_EMAIL) {
      setState({ loading: false, isAdmin: true, status: null, moduleAccess: [...GRANTABLE_MODULES] });
      return;
    }

    let cancelled = false;
    (async () => {
      const { data: existing, error: selectError } = await supabase
        .from("collaborators")
        .select("status, module_access")
        .eq("email", email)
        .maybeSingle();

      if (selectError) {
        console.error("[access] falha ao buscar permissões", selectError);
        if (!cancelled) setState({ loading: false, isAdmin: false, status: null, moduleAccess: [] });
        return;
      }

      if (existing) {
        const status = (existing.status ?? "pending") as CollaboratorStatus;
        // só concede acesso de verdade se um admin já aprovou explicitamente
        const moduleAccess = status === "approved" ? existing.module_access ?? [] : [];
        if (!cancelled) setState({ loading: false, isAdmin: false, status, moduleAccess });
        return;
      }

      // Primeiro login desse e-mail: registra como pendente, aguardando aprovação do admin.
      const { error: insertError } = await supabase.from("collaborators").insert({
        id: uid(),
        name: email.split("@")[0],
        email,
        status: "pending",
        module_access: [],
        client_access: "all",
      });
      if (insertError) console.error("[access] falha ao auto-registrar colaborador", insertError);
      if (!cancelled) setState({ loading: false, isAdmin: false, status: "pending", moduleAccess: [] });
    })();

    return () => {
      cancelled = true;
    };
  }, [email]);

  return state;
}
