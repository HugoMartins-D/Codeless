import { useEffect, useState } from "react";
import type { Session } from "../auth";
import { apiGet } from "./apiClient";
import type { CollaboratorStatus } from "../types";

/** Precisa bater com o ADMIN_EMAIL de cada Lambda em infra/lambdas/*. */
export const ADMIN_EMAIL = "djhugomartis2018@gmail.com";

/** Módulos que o admin pode conceder a outros logins pela tela de Acessos. */
export const GRANTABLE_MODULES = ["financeiro", "contratos", "demandas", "clientes"] as const;

export interface MyAccess {
  loading: boolean;
  isAdmin: boolean;
  /** null só para o admin, que não tem linha em collaborators. */
  status: CollaboratorStatus | null;
  moduleAccess: string[];
  /** "all" ou lista de ids de Client — usado para restringir queries por client_id. */
  clientAccess: "all" | string[];
  canCreateDemandas: boolean;
}

export function hasAccess(access: MyAccess, module: string): boolean {
  return access.isAdmin || access.moduleAccess.includes(module);
}

/** ids permitidos para filtrar queries (.in("client_id"|"id", ids)), ou null se não há restrição. */
export function allowedClientIds(access: MyAccess): string[] | null {
  return access.clientAccess === "all" ? null : access.clientAccess;
}

const initialState: MyAccess = {
  loading: true,
  isAdmin: false,
  status: null,
  moduleAccess: [],
  clientAccess: "all",
  canCreateDemandas: false,
};

export function useMyAccess(session: Session | null): MyAccess {
  const email = session?.user.email;
  const [state, setState] = useState<MyAccess>(initialState);

  useEffect(() => {
    if (!email) {
      setState({ loading: false, isAdmin: false, status: null, moduleAccess: [], clientAccess: [], canCreateDemandas: false });
      return;
    }

    let cancelled = false;
    (async () => {
      // /me resolve isAdmin/status/moduleAccess/clientAccess no backend (Lambda) e,
      // no primeiro login, autorregistra o colaborador como "pending" — mesma lógica
      // que antes vivia aqui no cliente, só que agora atrás da API.
      try {
        const me = await apiGet<{
          isAdmin: boolean;
          status: CollaboratorStatus | null;
          moduleAccess: string[];
          clientAccess: "all" | string[];
          canCreateDemandas: boolean;
        }>("/me");
        if (!cancelled && me) {
          setState({ loading: false, ...me });
        } else if (!cancelled) {
          setState({ loading: false, isAdmin: false, status: null, moduleAccess: [], clientAccess: [], canCreateDemandas: false });
        }
      } catch (err) {
        console.error("[access] falha ao buscar permissões", err);
        if (!cancelled)
          setState({ loading: false, isAdmin: false, status: null, moduleAccess: [], clientAccess: [], canCreateDemandas: false });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [email]);

  return state;
}
