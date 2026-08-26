import {
  Wallet,
  FileText,
  KanbanSquare,
  Users,
  LayoutDashboard,
  ShieldCheck,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import { FinanceiroPage } from "./modules/FinanceiroPage";
import { ContratosPage } from "./modules/ContratosPage";
import { DemandasPage } from "./modules/DemandasPage";
import { ClientesPage } from "./modules/ClientesPage";
import { DashboardPage } from "./modules/DashboardPage";
import { AcessosPage } from "./modules/AcessosPage";
import { AgendaPage } from "./modules/AgendaPage";

export interface AdminModule {
  slug: string;
  title: string;
  icon: LucideIcon;
  component: ComponentType;
}

export const adminModules: AdminModule[] = [
  { slug: "geral", title: "Geral", icon: LayoutDashboard, component: DashboardPage },
  { slug: "financeiro", title: "Financeiro", icon: Wallet, component: FinanceiroPage },
  { slug: "contratos", title: "Contratos", icon: FileText, component: ContratosPage },
  { slug: "demandas", title: "Demandas", icon: KanbanSquare, component: DemandasPage },
  { slug: "clientes", title: "Clientes", icon: Users, component: ClientesPage },
  { slug: "agenda", title: "Agenda", icon: CalendarDays, component: AgendaPage },
  { slug: "acessos", title: "Acessos", icon: ShieldCheck, component: AcessosPage },
];
