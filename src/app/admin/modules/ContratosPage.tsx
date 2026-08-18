import { useMemo, useState } from "react";
import { FileText, Wallet, FileClock, Send, CheckCircle2, Download, Pencil, Trash2, Plus } from "lucide-react";
import { useSupabaseTable, useSupabaseSetting } from "../lib/supabaseData";
import { fromContractRow, toContractRow, fromClientRow, toClientRow } from "../lib/mappers";
import { DEFAULT_TEMPLATE, DEFAULT_TEAM_ROSTER, generateContractText, downloadTextFile } from "../lib/contract";
import type { Client, Contract, ContractSignatory, ContractStatus } from "../types";
import { ContractEditor } from "./ContractEditor";
import { Panel, SelectInput, TextArea, Button, Badge, StatCard } from "../ui/primitives";
import { currency, headingFont, monthKey, monthLabelFull } from "../ui/tokens";

const statusTone: Record<ContractStatus, "neutral" | "warn" | "accent"> = {
  rascunho: "neutral",
  enviado: "warn",
  assinado: "accent",
};

export function ContratosPage() {
  const [contracts, setContracts] = useSupabaseTable<Contract>("contracts", fromContractRow, toContractRow);
  const [template, setTemplate] = useSupabaseSetting("contratos_template", DEFAULT_TEMPLATE);
  const [roster, setRoster] = useSupabaseSetting<ContractSignatory[]>("contratos_equipe", DEFAULT_TEAM_ROSTER);
  const [clients] = useSupabaseTable<Client>("clients", fromClientRow, toClientRow);

  const [selectedMonth, setSelectedMonth] = useState(() => monthKey(new Date()));
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  const monthOptions = useMemo(() => {
    const keys = new Set(contracts.map((c) => c.createdAt.slice(0, 7)));
    keys.add(monthKey(new Date()));
    return Array.from(keys).sort((a, b) => b.localeCompare(a));
  }, [contracts]);

  const monthContracts = useMemo(() => contracts.filter((c) => c.createdAt.slice(0, 7) === selectedMonth), [contracts, selectedMonth]);

  const stats = useMemo(() => {
    const valor = monthContracts.reduce((s, c) => s + c.implementationValue, 0);
    return {
      valor,
      rascunhos: monthContracts.filter((c) => c.status === "rascunho").length,
      enviados: monthContracts.filter((c) => c.status === "enviado").length,
      assinados: monthContracts.filter((c) => c.status === "assinado").length,
    };
  }, [monthContracts]);

  function openNew() {
    setEditingContract(null);
    setEditorOpen(true);
  }

  function openEdit(c: Contract) {
    setEditingContract(c);
    setEditorOpen(true);
  }

  function handleSave(contract: Contract) {
    setContracts((prev) => (prev.some((c) => c.id === contract.id) ? prev.map((c) => (c.id === contract.id ? contract : c)) : [contract, ...prev]));
    setEditorOpen(false);
  }

  function remove(id: string) {
    setContracts((prev) => prev.filter((c) => c.id !== id));
  }

  function handleQuickDownload(c: Contract) {
    downloadTextFile(`contrato-${c.clientCompanyName}.txt`, generateContractText(template, c));
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <FileText size={20} className="text-white/60" />
          </div>
          <div>
            <h1 className="text-white text-2xl" style={headingFont}>
              Contratos
            </h1>
            <p className="text-white/40 text-xs">
              {monthContracts.length} contrato{monthContracts.length === 1 ? "" : "s"} em {monthLabelFull(selectedMonth)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SelectInput value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="!w-44 !py-2">
            {monthOptions.map((k) => (
              <option key={k} value={k}>
                {monthLabelFull(k)}
              </option>
            ))}
          </SelectInput>
          <Button variant="primary" onClick={openNew} className="inline-flex items-center gap-1.5">
            <Plus size={14} /> Novo contrato
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Valor no mês" value={currency(stats.valor)} icon={Wallet} tone="accent" />
        <StatCard label="Rascunhos" value={String(stats.rascunhos)} icon={FileClock} tone="warn" />
        <StatCard label="Enviados" value={String(stats.enviados)} icon={Send} tone="neutral" />
        <StatCard label="Assinados" value={String(stats.assinados)} icon={CheckCircle2} tone="accent" />
      </div>

      <Panel className="mb-6">
        {monthContracts.length === 0 && <p className="text-white/30 text-sm">Nenhum contrato neste mês.</p>}
        <div className="flex flex-col gap-1">
          {monthContracts.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 py-2.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors group">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <FileText size={14} className="text-white/50" />
                </div>
                <div className="min-w-0">
                  <p className="text-white/80 text-sm truncate">{c.clientCompanyName.toUpperCase()}</p>
                  <p className="text-white/30 text-xs truncate">
                    {c.projectObject ? `${c.projectObject.slice(0, 40)}${c.projectObject.length > 40 ? "…" : ""} · ` : ""}
                    {currency(c.implementationValue)}
                  </p>
                </div>
              </div>
              <Badge tone={statusTone[c.status]}>{c.status}</Badge>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleQuickDownload(c)} className="p-1.5 text-white/30 hover:text-white/70 transition-colors" title="Baixar">
                  <Download size={14} />
                </button>
                <button onClick={() => openEdit(c)} className="p-1.5 text-white/30 hover:text-white/70 transition-colors" title="Editar">
                  <Pencil size={14} />
                </button>
                <button onClick={() => remove(c.id)} className="p-1.5 text-white/30 hover:text-[#e93e8f] transition-colors" title="Excluir">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <p className="text-white/50 text-[11px] tracking-widest uppercase mb-3">Template do contrato</p>
        <TextArea rows={6} value={template} onChange={(e) => setTemplate(e.target.value)} className="text-xs font-mono" />
        <p className="text-white/30 text-xs mt-2 leading-relaxed">
          Placeholders: {"{{contratante_nome}}"} {"{{contratante_cnpj}}"} {"{{contratante_endereco}}"} {"{{contratante_representante}}"}{" "}
          {"{{projeto_objeto}}"} {"{{valor_implantacao}}"} {"{{data_vencimento_implantacao}}"} {"{{valor_mensal}}"} {"{{dia_vencimento_mensal}}"}{" "}
          {"{{contratados_qualificacao}}"} {"{{contratados_assinaturas}}"} {"{{cidade}}"} {"{{data_assinatura}}"}
        </p>
      </Panel>

      {editorOpen && (
        <ContractEditor
          initial={editingContract}
          template={template}
          roster={roster}
          clients={clients}
          onAddRosterMember={(m) => setRoster([...roster, m])}
          onRemoveRosterMember={(name) => setRoster(roster.filter((m) => m.name !== name))}
          onSave={handleSave}
          onClose={() => setEditorOpen(false)}
        />
      )}
    </div>
  );
}
