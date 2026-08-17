import type { Transaction } from "../types";
import { monthKey, monthLabel } from "../ui/tokens";

export function netOf(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + (t.type === "receita" ? t.amount : -t.amount), 0);
}

export function computeFinanceSummary(transactions: Transaction[]) {
  const now = new Date();
  const currentMonth = monthKey(now);

  const thisMonth = transactions.filter((t) => t.date.slice(0, 7) === currentMonth);
  const totalReceitasMes = thisMonth.filter((t) => t.type === "receita").reduce((s, t) => s + t.amount, 0);
  const totalDespesasMes = thisMonth.filter((t) => t.type === "despesa").reduce((s, t) => s + t.amount, 0);
  const lucroMes = totalReceitasMes - totalDespesasMes;
  const saldoEmCaixa = netOf(transactions);
  const notasPendentes = transactions.filter((t) => t.type === "receita" && !t.invoiceIssued);

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const key = monthKey(d);
    const net = netOf(transactions.filter((t) => t.date.slice(0, 7) === key));
    return { key, label: monthLabel(key), net };
  });

  return { totalReceitasMes, totalDespesasMes, lucroMes, saldoEmCaixa, notasPendentes, last6Months, currentMonth };
}
