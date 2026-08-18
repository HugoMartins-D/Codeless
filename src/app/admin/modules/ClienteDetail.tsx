import { useMemo, useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { uid } from "../lib/storage";
import { CLIENT_STATUS_REASON_PRESETS } from "../lib/clientStatus";
import type { Client, ClientBillingType, ClientStatus, ClientStatusHistoryEntry, Contract, ContractStatus, Transaction } from "../types";
import { Panel, Field, TextInput, SelectInput, TextArea, Button, Badge } from "../ui/primitives";
import { ACCENT, DANGER, currency, headingFont, parseDecimal } from "../ui/tokens";

const STATUSES: ClientStatus[] = ["ativo", "pausado", "prospect", "ex-cliente"];

const statusTone: Record<ClientStatus, "accent" | "warn" | "neutral" | "danger"> = {
  ativo: "accent",
  pausado: "warn",
  prospect: "neutral",
  "ex-cliente": "danger",
};

const contractStatusTone: Record<ContractStatus, "neutral" | "warn" | "accent"> = {
  rascunho: "neutral",
  enviado: "warn",
  assinado: "accent",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function ClienteDetail({
  initial,
  transactions,
  contracts,
  statusHistory,
  onSave,
  onClose,
}: {
  initial: Client | null;
  transactions: Transaction[];
  contracts: Contract[];
  statusHistory: ClientStatusHistoryEntry[];
  onSave: (client: Client, historyEntry: ClientStatusHistoryEntry | null) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    contact: initial?.contact ?? "",
    status: initial?.status ?? ("prospect" as ClientStatus),
    billingType: initial?.billingType ?? ("recorrente" as ClientBillingType),
    value: initial?.value ? String(initial.value) : "",
  });
  const [reasonPreset, setReasonPreset] = useState("");
  const [reasonNote, setReasonNote] = useState("");

  const originalStatus = initial?.status ?? null;
  const needsReason = (form.status === "pausado" || form.status === "ex-cliente") && form.status !== originalStatus;

  const clientTransactions = useMemo(
    () =>
      initial
        ? transactions.filter((t) => t.clientId === initial.id).sort((a, b) => b.date.localeCompare(a.date))
        : [],
    [transactions, initial],
  );

  const clientContracts = useMemo(
    () =>
      initial
        ? contracts.filter((c) => c.clientId === initial.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        : [],
    [contracts, initial],
  );

  const clientHistory = useMemo(
    () =>
      initial
        ? statusHistory.filter((h) => h.clientId === initial.id).sort((a, b) => b.changedAt.localeCompare(a.changedAt))
        : [],
    [statusHistory, initial],
  );

  function handleSave() {
    if (!form.name.trim()) return;
    if (needsReason && !reasonPreset) return;

    const value = form.value ? parseDecimal(form.value) : undefined;
    const client: Client = {
      id: initial?.id ?? uid(),
      name: form.name,
      contact: form.contact,
      status: form.status,
      billingType: form.billingType,
      value,
    };
    const historyEntry: ClientStatusHistoryEntry | null = needsReason
      ? {
          id: uid(),
          clientId: client.id,
          status: form.status,
          reasonPreset,
          reasonNote: reasonNote.trim() || undefined,
          changedAt: new Date().toISOString(),
        }
      : null;

    onSave(client, historyEntry);
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <h2 className="text-white text-lg" style={headingFont}>
          {initial ? "Detalhes do cliente" : "Novo cliente"}
        </h2>
        <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          <Panel>
            <p className="text-white/40 text-[11px] tracking-widest uppercase mb-4">Dados</p>
            <div className="flex flex-col gap-4">
              <Field label="Nome">
                <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Contato">
                <TextInput value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Telefone, e-mail..." />
              </Field>
              <Field label="Status">
                <SelectInput value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ClientStatus })}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Cobrança">
                <div className="flex gap-2">
                  {(["recorrente", "unico"] as ClientBillingType[]).map((type) => {
                    const active = form.billingType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm({ ...form, billingType: type })}
                        className="px-3 py-1.5 rounded-full text-xs transition-colors"
                        style={{
                          background: active ? "rgba(199,211,0,0.10)" : "rgba(255,255,255,0.03)",
                          border: active ? "1px solid rgba(199,211,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
                          color: active ? "#c7d300" : "rgba(255,255,255,0.5)",
                        }}
                      >
                        {type === "recorrente" ? "Recorrente (mensal)" : "Pagamento único"}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label={form.billingType === "unico" ? "Valor único (R$)" : "Valor mensal (R$)"}>
                <TextInput value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} inputMode="decimal" />
              </Field>

              {needsReason && (
                <div className="rounded-lg p-4 flex flex-col gap-4" style={{ background: "rgba(233,62,143,0.06)", border: "1px solid rgba(233,62,143,0.25)" }}>
                  <p className="inline-flex items-center gap-1.5 text-[#e93e8f] text-xs">
                    <AlertTriangle size={13} /> Motivo obrigatório para mudar o status para "{form.status}"
                  </p>
                  <Field label="Motivo">
                    <SelectInput value={reasonPreset} onChange={(e) => setReasonPreset(e.target.value)}>
                      <option value="">Selecionar motivo</option>
                      {CLIENT_STATUS_REASON_PRESETS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </SelectInput>
                  </Field>
                  <Field label="Detalhe complementar (opcional)">
                    <TextArea rows={2} value={reasonNote} onChange={(e) => setReasonNote(e.target.value)} placeholder="Algo a mais que queira registrar" />
                  </Field>
                </div>
              )}
            </div>
          </Panel>

          {initial && clientHistory.length > 0 && (
            <Panel>
              <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">Histórico de status</p>
              <div className="flex flex-col">
                {clientHistory.map((h) => (
                  <div key={h.id} className="flex items-start justify-between gap-3 py-2.5 border-b border-white/5 last:border-0">
                    <div className="min-w-0">
                      <Badge tone={statusTone[h.status]}>{h.status}</Badge>
                      {h.reasonPreset && <p className="text-white/60 text-sm mt-1.5">{h.reasonPreset}</p>}
                      {h.reasonNote && <p className="text-white/30 text-xs mt-0.5">{h.reasonNote}</p>}
                    </div>
                    <span className="text-white/30 text-xs shrink-0">{formatDateTime(h.changedAt)}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {initial && (
            <Panel>
              <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">Histórico de recebimentos</p>
              {clientTransactions.length === 0 ? (
                <p className="text-white/30 text-sm">Nenhum lançamento do Financeiro vinculado a este cliente ainda.</p>
              ) : (
                <div className="flex flex-col">
                  {clientTransactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <Badge tone={t.type === "receita" ? "accent" : "danger"}>{t.type}</Badge>
                        <span className="text-white/60 text-sm truncate">{t.description || t.category}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {t.type === "receita" && <Badge tone={t.invoiceIssued ? "accent" : "warn"}>{t.invoiceIssued ? "NF emitida" : "NF pendente"}</Badge>}
                        <span className="text-white/40 text-xs">{t.date}</span>
                        <span
                          className="text-sm font-medium"
                          style={{ color: t.type === "receita" ? ACCENT : DANGER, minWidth: 90, textAlign: "right" }}
                        >
                          {t.type === "receita" ? "+" : "-"} {currency(t.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          )}

          {initial && (
            <Panel>
              <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">Contratos</p>
              {clientContracts.length === 0 ? (
                <p className="text-white/30 text-sm">Nenhum contrato vinculado a este cliente ainda.</p>
              ) : (
                <div className="flex flex-col">
                  {clientContracts.map((c) => (
                    <div key={c.id} className="py-3 border-b border-white/5 last:border-0">
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <span className="text-white/70 text-sm font-medium">{c.clientCompanyName}</span>
                        <div className="flex items-center gap-3 shrink-0">
                          <Badge tone={contractStatusTone[c.status]}>{c.status}</Badge>
                          <span className="text-white/40 text-xs">{c.createdAt}</span>
                        </div>
                      </div>
                      {c.projectObject && <p className="text-white/50 text-sm mb-1.5">{c.projectObject}</p>}
                      <p className="text-white/30 text-xs">
                        {currency(c.implementationValue)} implantação
                        {c.monthlyValue > 0 && ` · ${currency(c.monthlyValue)}/mês`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSave}>
          {initial ? "Salvar" : "Adicionar"}
        </Button>
      </div>
    </div>
  );
}
