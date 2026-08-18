import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { uid } from "../lib/storage";
import { useSupabaseTable } from "../lib/supabaseData";
import {
  fromClientRow,
  toClientRow,
  fromTransactionRow,
  toTransactionRow,
  fromContractRow,
  toContractRow,
  fromClientStatusHistoryRow,
  toClientStatusHistoryRow,
} from "../lib/mappers";
import { parseSimpleCsv } from "../lib/csv";
import type { Client, ClientStatus, ClientStatusHistoryEntry, Contract, Transaction } from "../types";
import { ClienteDetail } from "./ClienteDetail";
import { Panel, Button, Badge } from "../ui/primitives";
import { currency, headingFont } from "../ui/tokens";

const STATUSES: ClientStatus[] = ["ativo", "pausado", "prospect", "ex-cliente"];

const statusTone: Record<ClientStatus, "accent" | "warn" | "neutral" | "danger"> = {
  ativo: "accent",
  pausado: "warn",
  prospect: "neutral",
  "ex-cliente": "danger",
};

export function ClientesPage() {
  const [clients, setClients] = useSupabaseTable<Client>("clients", fromClientRow, toClientRow);
  const [transactions] = useSupabaseTable<Transaction>("transactions", fromTransactionRow, toTransactionRow);
  const [contracts] = useSupabaseTable<Contract>("contracts", fromContractRow, toContractRow);
  const [statusHistory, setStatusHistory] = useSupabaseTable<ClientStatusHistoryEntry>(
    "client_status_history",
    fromClientStatusHistoryRow,
    toClientStatusHistoryRow,
  );

  const [filter, setFilter] = useState<ClientStatus | "todos">("todos");
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => (filter === "todos" ? clients : clients.filter((c) => c.status === filter)), [clients, filter]);

  function openNew() {
    setEditingClient(null);
    setDetailOpen(true);
  }

  function openDetail(c: Client) {
    setEditingClient(c);
    setDetailOpen(true);
  }

  function handleSave(client: Client, historyEntry: ClientStatusHistoryEntry | null) {
    setClients((prev) => (prev.some((c) => c.id === client.id) ? prev.map((c) => (c.id === client.id ? client : c)) : [client, ...prev]));
    if (historyEntry) setStatusHistory((prev) => [historyEntry, ...prev]);
    setDetailOpen(false);
  }

  function remove(id: string) {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  function handleImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      const rows = parseSimpleCsv(text);
      const imported: Client[] = rows
        .filter((r) => r.nome)
        .map((r) => ({
          id: uid(),
          name: r.nome,
          contact: r.contato ?? "",
          status: (STATUSES as string[]).includes(r.status) ? (r.status as ClientStatus) : "prospect",
          oneTimeValue: r.valorunico ? Number(r.valorunico) : undefined,
          monthlyValue: r.valormensal || r.valorrecorrente ? Number(r.valormensal || r.valorrecorrente) : undefined,
        }));
      setClients((prev) => [...imported, ...prev]);
    });
    e.target.value = "";
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl" style={headingFont}>
          Clientes
        </h1>
        <div className="flex gap-2">
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
          <Button onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-1.5">
            <Upload size={14} /> Importar CSV
          </Button>
          <Button variant="primary" onClick={openNew} className="inline-flex items-center gap-1.5">
            <Plus size={14} /> Novo cliente
          </Button>
        </div>
      </div>

      <p className="text-white/30 text-xs mb-4">
        CSV com colunas: nome, contato, status (ativo/pausado/prospect/ex-cliente), valorunico, valormensal.
      </p>

      <div className="flex gap-2 mb-6">
        {(["todos", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-3 py-1.5 rounded-full text-xs capitalize transition-colors"
            style={{
              background: filter === s ? "rgba(199,211,0,0.10)" : "rgba(255,255,255,0.03)",
              border: filter === s ? "1px solid rgba(199,211,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
              color: filter === s ? "#c7d300" : "rgba(255,255,255,0.5)",
            }}
          >
            {s} {s !== "todos" && `(${clients.filter((c) => c.status === s).length})`}
          </button>
        ))}
      </div>

      <Panel>
        {filtered.length === 0 && <p className="text-white/30 text-sm">Nenhum cliente aqui.</p>}
        <div className="flex flex-col gap-1">
          {filtered.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 py-2.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors group">
              <button className="flex items-center gap-3 flex-1 min-w-0 text-left" onClick={() => openDetail(c)}>
                <span className="text-white/70 text-sm truncate">{c.name}</span>
                <span className="text-white/30 text-xs truncate">{c.contact}</span>
              </button>
              {(c.monthlyValue != null || c.oneTimeValue != null) && (
                <span className="text-white/40 text-xs shrink-0">
                  {[c.monthlyValue != null ? `${currency(c.monthlyValue)}/mês` : null, c.oneTimeValue != null ? `${currency(c.oneTimeValue)} único` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              )}
              <Badge tone={statusTone[c.status]}>{c.status}</Badge>
              <button onClick={() => remove(c.id)} className="text-white/20 hover:text-[#e93e8f] transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </Panel>

      {detailOpen && (
        <ClienteDetail
          initial={editingClient}
          transactions={transactions}
          contracts={contracts}
          statusHistory={statusHistory}
          onSave={handleSave}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </div>
  );
}
