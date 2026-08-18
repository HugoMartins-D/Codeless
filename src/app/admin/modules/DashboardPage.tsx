import { useMemo } from "react";
import { Users, FileText, KanbanSquare } from "lucide-react";
import { useSupabaseTable } from "../lib/supabaseData";
import { fromTaskRow, toTaskRow, fromTransactionRow, toTransactionRow, fromClientRow, toClientRow, fromContractRow, toContractRow } from "../lib/mappers";
import { computeFinanceSummary } from "../lib/finance";
import { useSession } from "../auth";
import { useMyAccess, hasAccess } from "../lib/access";
import type { Client, Contract, Task, Transaction } from "../types";
import { Panel, Badge, StatCard } from "../ui/primitives";
import { ACCENT, currency, headingFont, monthKey, monthLabelFull } from "../ui/tokens";

const statusTone = { todo: "neutral", doing: "warn", done: "accent" } as const;
const statusLabel = { todo: "A fazer", doing: "Em andamento", done: "Concluído" } as const;

export function DashboardPage() {
  const access = useMyAccess(useSession() ?? null);
  const canFinanceiro = hasAccess(access, "financeiro");
  const canClientes = hasAccess(access, "clientes");
  const canContratos = hasAccess(access, "contratos");
  const canDemandas = hasAccess(access, "demandas");

  const [tasks] = useSupabaseTable<Task>("tasks", fromTaskRow, toTaskRow);
  const [transactions] = useSupabaseTable<Transaction>("transactions", fromTransactionRow, toTransactionRow);
  const [clients] = useSupabaseTable<Client>("clients", fromClientRow, toClientRow);
  const [contracts] = useSupabaseTable<Contract>("contracts", fromContractRow, toContractRow);

  const summary = useMemo(() => computeFinanceSummary(transactions), [transactions]);

  const clientesAtivos = useMemo(() => clients.filter((c) => c.status === "ativo").length, [clients]);

  const contratosEmAberto = useMemo(() => contracts.filter((c) => c.status !== "assinado").length, [contracts]);

  const demandasEmAberto = useMemo(() => tasks.filter((t) => t.status !== "done").length, [tasks]);

  const upcoming = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== "done")
        .sort((a, b) => (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999"))
        .slice(0, 8),
    [tasks],
  );

  const byAssignee = useMemo(() => {
    const map = new Map<string, number>();
    tasks
      .filter((t) => t.status !== "done")
      .forEach((t) => {
        const key = t.assignee || "Sem responsável";
        map.set(key, (map.get(key) ?? 0) + 1);
      });
    const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
    const max = entries[0]?.[1] ?? 1;
    return { entries, max };
  }, [tasks]);

  const hasSecondaryStats = canClientes || canContratos || canDemandas;

  return (
    <div className="max-w-5xl">
      <h1 className="text-white text-2xl mb-1" style={headingFont}>
        Geral
      </h1>
      <p className="text-white/40 text-xs mb-6">Visão consolidada do negócio em {monthLabelFull(monthKey(new Date()))}</p>

      {canFinanceiro && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <StatCard label="Lucro do mês" value={currency(summary.lucroMes)} />
          <StatCard label="Receitas do mês" value={currency(summary.totalReceitasMes)} />
          <StatCard label="Despesas do mês" value={currency(summary.totalDespesasMes)} />
          <StatCard label="Saldo em caixa" value={currency(summary.saldoEmCaixa)} />
        </div>
      )}

      {hasSecondaryStats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {canClientes && <StatCard label="Clientes ativos" value={String(clientesAtivos)} icon={Users} tone="accent" />}
          {canContratos && <StatCard label="Contratos em aberto" value={String(contratosEmAberto)} icon={FileText} tone="warn" />}
          {canDemandas && <StatCard label="Demandas em aberto" value={String(demandasEmAberto)} icon={KanbanSquare} tone="neutral" />}
        </div>
      )}

      {canDemandas && (
        <div className="grid md:grid-cols-2 gap-6">
          <Panel>
            <p className="text-white/50 text-[11px] tracking-widest uppercase mb-4">Próximas entregas</p>
            {upcoming.length === 0 && <p className="text-white/30 text-sm">Nada pendente por aqui.</p>}
            <div className="flex flex-col gap-2">
              {upcoming.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-2 text-sm">
                  <div className="min-w-0">
                    <p className="text-white/70 truncate">{t.title}</p>
                    <p className="text-white/30 text-xs truncate">{t.client || "Sem cliente"}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {t.dueDate && <span className="text-white/40 text-xs">{t.dueDate}</span>}
                    <Badge tone={statusTone[t.status]}>{statusLabel[t.status]}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <p className="text-white/50 text-[11px] tracking-widest uppercase mb-4">Carga por colaborador</p>
            {byAssignee.entries.length === 0 && <p className="text-white/30 text-sm">Nenhuma demanda em aberto.</p>}
            <div className="flex flex-col gap-3">
              {byAssignee.entries.map(([name, count]) => (
                <div key={name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-white/60">{name}</span>
                    <span className="text-white/40">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(count / byAssignee.max) * 100}%`, background: ACCENT }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
