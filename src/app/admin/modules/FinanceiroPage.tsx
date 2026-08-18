import { useMemo, useState } from "react";
import { Plus, Trash2, X as XIcon, FileCheck2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { uid } from "../lib/storage";
import { useSupabaseTable, useSupabaseSetting } from "../lib/supabaseData";
import { fromTransactionRow, toTransactionRow, fromClientRow, toClientRow } from "../lib/mappers";
import { computeFinanceSummary } from "../lib/finance";
import type { Client, Transaction, TransactionType } from "../types";
import { Panel, Field, TextInput, SelectInput, Button, Badge, StatCard } from "../ui/primitives";
import { Modal } from "../ui/Modal";
import { ACCENT, DANGER, currency, headingFont, parseDecimal } from "../ui/tokens";

const DEFAULT_CATEGORIES = {
  receita: ["Clientes fixos", "Landing pages", "Parcelados", "Infoprodutos"],
  despesa: ["Ferramentas", "Pró-labore", "Contabilidade", "Impostos"],
};

const emptyForm = {
  type: "receita" as TransactionType,
  category: "",
  description: "",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  invoiceIssued: false,
  clientId: "",
};

export function FinanceiroPage() {
  const [transactions, setTransactions] = useSupabaseTable<Transaction>("transactions", fromTransactionRow, toTransactionRow);
  const [clients] = useSupabaseTable<Client>("clients", fromClientRow, toClientRow);
  const [categories, setCategories] = useSupabaseSetting("financeiro_categories", DEFAULT_CATEGORIES);
  const [goal, setGoal] = useSupabaseSetting("financeiro_goal", 50000);
  const [goalDraft, setGoalDraft] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [newCategory, setNewCategory] = useState({ receita: "", despesa: "" });

  const summary = useMemo(() => computeFinanceSummary(transactions), [transactions]);
  const goalProgress = goal > 0 ? Math.min(100, Math.round((summary.totalReceitasMes / goal) * 100)) : 0;

  function openNew() {
    setEditingId(null);
    setForm({ ...emptyForm, category: categories.receita[0] ?? "" });
    setModalOpen(true);
  }

  function openEdit(t: Transaction) {
    setEditingId(t.id);
    setForm({
      type: t.type,
      category: t.category,
      description: t.description,
      amount: String(t.amount),
      date: t.date,
      invoiceIssued: !!t.invoiceIssued,
      clientId: t.clientId ?? "",
    });
    setModalOpen(true);
  }

  function submit() {
    const amount = parseDecimal(form.amount);
    if (!form.category || !amount || amount <= 0) return;

    if (editingId) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                type: form.type,
                category: form.category,
                description: form.description,
                amount,
                date: form.date,
                invoiceIssued: form.invoiceIssued,
                clientId: form.clientId || undefined,
              }
            : t,
        ),
      );
    } else {
      const newTx: Transaction = {
        id: uid(),
        type: form.type,
        category: form.category,
        description: form.description,
        amount,
        date: form.date,
        invoiceIssued: form.type === "receita" ? form.invoiceIssued : undefined,
        clientId: form.clientId || undefined,
      };
      setTransactions((prev) => [newTx, ...prev]);
    }
    setModalOpen(false);
  }

  function remove(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function toggleInvoice(id: string) {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, invoiceIssued: !t.invoiceIssued } : t)));
  }

  function addCategory(type: TransactionType) {
    const value = newCategory[type].trim();
    if (!value || categories[type].includes(value)) return;
    setCategories({ ...categories, [type]: [...categories[type], value] });
    setNewCategory({ ...newCategory, [type]: "" });
  }

  function removeCategory(type: TransactionType, value: string) {
    setCategories({ ...categories, [type]: categories[type].filter((c) => c !== value) });
  }

  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl" style={headingFont}>
          Financeiro
        </h1>
        <Button variant="primary" onClick={openNew} className="inline-flex items-center gap-1.5">
          <Plus size={14} /> Nova transação
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Lucro do mês" value={currency(summary.lucroMes)} />
        <StatCard label="Receitas do mês" value={currency(summary.totalReceitasMes)} />
        <StatCard label="Despesas do mês" value={currency(summary.totalDespesasMes)} />
        <StatCard label="Saldo em caixa" value={currency(summary.saldoEmCaixa)} />
      </div>

      {/* Goal */}
      <Panel className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/50 text-[11px] tracking-widest uppercase">Meta do mês</p>
          {goalDraft === null ? (
            <button className="text-xs text-white/40 hover:text-white/70" onClick={() => setGoalDraft(String(goal))}>
              editar
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <TextInput
                autoFocus
                value={goalDraft}
                onChange={(e) => setGoalDraft(e.target.value)}
                className="!w-32 !py-1"
              />
              <button
                className="text-xs text-[#c7d300]"
                onClick={() => {
                  const v = parseDecimal(goalDraft);
                  if (v > 0) setGoal(v);
                  setGoalDraft(null);
                }}
              >
                salvar
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full" style={{ width: `${goalProgress}%`, background: ACCENT }} />
          </div>
          <p className="text-white/60 text-sm whitespace-nowrap">
            {currency(summary.totalReceitasMes)} / {currency(goal)} ({goalProgress}%)
          </p>
        </div>
      </Panel>

      {/* Cash flow chart */}
      <Panel className="mb-6">
        <p className="text-white/50 text-[11px] tracking-widest uppercase mb-4">Fluxo de caixa · últimos 6 meses</p>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <AreaChart data={summary.last6Months}>
              <defs>
                <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="label" stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(255,255,255,0.35)" fontSize={11} tickLine={false} axisLine={false} width={40} />
              <Tooltip
                contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                formatter={(v: number) => currency(v)}
              />
              <Area type="monotone" dataKey="net" stroke={ACCENT} strokeWidth={2} fill="url(#flowGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Pending invoices */}
      {summary.notasPendentes.length > 0 && (
        <Panel className="mb-6">
          <p className="text-white/50 text-[11px] tracking-widest uppercase mb-4">Notas fiscais pendentes</p>
          <div className="flex flex-col gap-2">
            {summary.notasPendentes.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span className="text-white/70">
                  {t.description || t.category} · {currency(t.amount)}
                </span>
                <button
                  className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-[#c7d300] transition-colors"
                  onClick={() => toggleInvoice(t.id)}
                >
                  <FileCheck2 size={13} /> marcar como emitida
                </button>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Categories */}
      <Panel className="mb-6">
        <p className="text-white/50 text-[11px] tracking-widest uppercase mb-4">Categorias</p>
        <div className="grid md:grid-cols-2 gap-6">
          {(["receita", "despesa"] as TransactionType[]).map((type) => (
            <div key={type}>
              <p className="text-white/40 text-xs mb-2 capitalize">{type}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {categories[type].map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-white/60"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    {c}
                    <button onClick={() => removeCategory(type, c)} className="text-white/30 hover:text-[#e93e8f]">
                      <XIcon size={11} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <TextInput
                  placeholder="Nova categoria"
                  value={newCategory[type]}
                  onChange={(e) => setNewCategory({ ...newCategory, [type]: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && addCategory(type)}
                  className="!py-1.5"
                />
                <Button onClick={() => addCategory(type)}>Add</Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Transactions list */}
      <Panel>
        <p className="text-white/50 text-[11px] tracking-widest uppercase mb-4">Lançamentos</p>
        {sorted.length === 0 && <p className="text-white/30 text-sm">Nenhum lançamento ainda.</p>}
        <div className="flex flex-col gap-1">
          {sorted.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 py-2.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors group"
            >
              <button className="flex items-center gap-3 flex-1 min-w-0 text-left" onClick={() => openEdit(t)}>
                <Badge tone={t.type === "receita" ? "accent" : "danger"}>{t.type}</Badge>
                <span className="text-white/70 text-sm truncate">{t.description || t.category}</span>
                <span className="text-white/30 text-xs shrink-0">{t.category}</span>
              </button>
              <span className="text-white/40 text-xs shrink-0">{t.date}</span>
              <span
                className="text-sm font-medium shrink-0"
                style={{ color: t.type === "receita" ? ACCENT : DANGER, minWidth: 90, textAlign: "right" }}
              >
                {t.type === "receita" ? "+" : "-"} {currency(t.amount)}
              </span>
              <button
                onClick={() => remove(t.id)}
                className="text-white/20 hover:text-[#e93e8f] transition-colors opacity-0 group-hover:opacity-100 shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </Panel>

      <Modal open={modalOpen} onOpenChange={setModalOpen} title={editingId ? "Editar transação" : "Nova transação"}>
        <div className="flex flex-col gap-4">
          <Field label="Tipo">
            <SelectInput
              value={form.type}
              onChange={(e) => {
                const type = e.target.value as TransactionType;
                setForm({ ...form, type, category: categories[type][0] ?? "" });
              }}
            >
              <option value="receita">Receita</option>
              <option value="despesa">Despesa</option>
            </SelectInput>
          </Field>
          <Field label="Categoria">
            <SelectInput value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories[form.type].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Descrição">
            <TextInput value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ex: Projeto site institucional" />
          </Field>
          {clients.length > 0 && (
            <Field label="Cliente (opcional)">
              <SelectInput value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
                <option value="">Sem cliente vinculado</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Valor (R$)">
              <TextInput value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0,00" inputMode="decimal" />
            </Field>
            <Field label="Data">
              <TextInput type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
          </div>
          {form.type === "receita" && (
            <label className="flex items-center gap-2 text-sm text-white/60">
              <input
                type="checkbox"
                checked={form.invoiceIssued}
                onChange={(e) => setForm({ ...form, invoiceIssued: e.target.checked })}
              />
              Nota fiscal já emitida
            </label>
          )}
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={submit}>
              {editingId ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
