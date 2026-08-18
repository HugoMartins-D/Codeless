import { useState } from "react";
import { Plus, Trash2, Copy, Download } from "lucide-react";
import { uid } from "../lib/storage";
import { useSupabaseTable, useSupabaseSetting } from "../lib/supabaseData";
import { fromContractRow, toContractRow } from "../lib/mappers";
import { DEFAULT_TEMPLATE, TEAM_ROSTER, generateContractText, downloadTextFile } from "../lib/contract";
import type { Contract, ContractStatus } from "../types";
import { Panel, Field, TextInput, SelectInput, TextArea, Button, Badge } from "../ui/primitives";
import { Modal } from "../ui/Modal";
import { currency, headingFont } from "../ui/tokens";

const emptyForm = {
  clientCompanyName: "",
  clientCnpj: "",
  clientAddress: "",
  clientRepresentative: "",
  projectObject: "",
  implementationValue: "",
  implementationDueDate: "",
  monthlyValue: "",
  monthlyDueDay: "25",
  signatories: [] as string[],
  city: "Balneário Camboriú",
};

const statusTone: Record<ContractStatus, "neutral" | "warn" | "accent"> = {
  rascunho: "neutral",
  enviado: "warn",
  assinado: "accent",
};

export function ContratosPage() {
  const [contracts, setContracts] = useSupabaseTable<Contract>("contracts", fromContractRow, toContractRow);
  const [template, setTemplate] = useSupabaseSetting("contratos_template", DEFAULT_TEMPLATE);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [viewing, setViewing] = useState<Contract | null>(null);

  function toggleSignatory(name: string) {
    setForm((f) => ({
      ...f,
      signatories: f.signatories.includes(name) ? f.signatories.filter((s) => s !== name) : [...f.signatories, name],
    }));
  }

  function submit() {
    const implementationValue = Number(form.implementationValue.replace(",", "."));
    const monthlyValue = Number(form.monthlyValue.replace(",", "."));
    if (!form.clientCompanyName || !implementationValue || form.signatories.length === 0) return;

    const contract: Contract = {
      id: uid(),
      clientCompanyName: form.clientCompanyName,
      clientCnpj: form.clientCnpj,
      clientAddress: form.clientAddress,
      clientRepresentative: form.clientRepresentative,
      projectObject: form.projectObject,
      implementationValue,
      implementationDueDate: form.implementationDueDate || undefined,
      monthlyValue,
      monthlyDueDay: Number(form.monthlyDueDay) || 25,
      signatories: form.signatories,
      city: form.city,
      status: "rascunho",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setContracts((prev) => [contract, ...prev]);
    setForm(emptyForm);
    setFormOpen(false);
  }

  function setStatus(id: string, status: ContractStatus) {
    setContracts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  function remove(id: string) {
    setContracts((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl" style={headingFont}>
          Contratos
        </h1>
        <Button variant="primary" onClick={() => setFormOpen(true)} className="inline-flex items-center gap-1.5">
          <Plus size={14} /> Novo contrato
        </Button>
      </div>

      <Panel className="mb-6">
        <p className="text-white/50 text-[11px] tracking-widest uppercase mb-3">Template do contrato</p>
        <TextArea rows={8} value={template} onChange={(e) => setTemplate(e.target.value)} className="text-xs font-mono" />
        <p className="text-white/30 text-xs mt-2 leading-relaxed">
          Placeholders: {"{{contratante_nome}}"} {"{{contratante_cnpj}}"} {"{{contratante_endereco}}"} {"{{contratante_representante}}"}{" "}
          {"{{projeto_objeto}}"} {"{{valor_implantacao}}"} {"{{data_vencimento_implantacao}}"} {"{{valor_mensal}}"} {"{{dia_vencimento_mensal}}"}{" "}
          {"{{contratados_qualificacao}}"} {"{{contratados_assinaturas}}"} {"{{cidade}}"} {"{{data_assinatura}}"}
        </p>
      </Panel>

      <Panel>
        <p className="text-white/50 text-[11px] tracking-widest uppercase mb-4">Contratos</p>
        {contracts.length === 0 && <p className="text-white/30 text-sm">Nenhum contrato ainda.</p>}
        <div className="flex flex-col gap-1">
          {contracts.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 py-2.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors group">
              <button className="flex items-center gap-3 flex-1 min-w-0 text-left" onClick={() => setViewing(c)}>
                <span className="text-white/70 text-sm truncate">{c.clientCompanyName}</span>
                <span className="text-white/30 text-xs shrink-0">{currency(c.implementationValue)}</span>
              </button>
              <SelectInput
                value={c.status}
                onChange={(e) => setStatus(c.id, e.target.value as ContractStatus)}
                className="!w-32 !py-1 !text-xs shrink-0"
              >
                <option value="rascunho">Rascunho</option>
                <option value="enviado">Enviado</option>
                <option value="assinado">Assinado</option>
              </SelectInput>
              <Badge tone={statusTone[c.status]}>{c.status}</Badge>
              <span className="text-white/40 text-xs shrink-0">{c.createdAt}</span>
              <button onClick={() => remove(c.id)} className="text-white/20 hover:text-[#e93e8f] transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </Panel>

      <Modal open={formOpen} onOpenChange={setFormOpen} title="Novo contrato">
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">Cliente</p>
            <div className="flex flex-col gap-4">
              <Field label="Nome da empresa">
                <TextInput value={form.clientCompanyName} onChange={(e) => setForm({ ...form, clientCompanyName: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="CNPJ">
                  <TextInput value={form.clientCnpj} onChange={(e) => setForm({ ...form, clientCnpj: e.target.value })} />
                </Field>
                <Field label="Representante legal">
                  <TextInput value={form.clientRepresentative} onChange={(e) => setForm({ ...form, clientRepresentative: e.target.value })} />
                </Field>
              </div>
              <Field label="Endereço">
                <TextInput value={form.clientAddress} onChange={(e) => setForm({ ...form, clientAddress: e.target.value })} />
              </Field>
            </div>
          </div>

          <div>
            <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">Projeto</p>
            <Field label="Objeto do contrato">
              <TextArea
                rows={3}
                value={form.projectObject}
                onChange={(e) => setForm({ ...form, projectObject: e.target.value })}
                placeholder="Ex: um sistema de gestão interna e uma página de e-commerce"
              />
            </Field>
          </div>

          <div>
            <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">Valor</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Valor de implantação (R$)">
                <TextInput value={form.implementationValue} onChange={(e) => setForm({ ...form, implementationValue: e.target.value })} inputMode="decimal" />
              </Field>
              <Field label="Vencimento da implantação">
                <TextInput type="date" value={form.implementationDueDate} onChange={(e) => setForm({ ...form, implementationDueDate: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Mensalidade de manutenção (R$)">
                <TextInput value={form.monthlyValue} onChange={(e) => setForm({ ...form, monthlyValue: e.target.value })} inputMode="decimal" />
              </Field>
              <Field label="Dia do vencimento mensal">
                <TextInput value={form.monthlyDueDay} onChange={(e) => setForm({ ...form, monthlyDueDay: e.target.value })} inputMode="numeric" />
              </Field>
            </div>
          </div>

          <div>
            <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">Quem vai trabalhar e assinar o contrato</p>
            <div className="flex flex-wrap gap-2">
              {TEAM_ROSTER.map((m) => {
                const active = form.signatories.includes(m.name);
                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => toggleSignatory(m.name)}
                    className="px-3 py-1.5 rounded-full text-xs transition-colors"
                    style={{
                      background: active ? "rgba(199,211,0,0.10)" : "rgba(255,255,255,0.03)",
                      border: active ? "1px solid rgba(199,211,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
                      color: active ? "#c7d300" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>

          <Field label="Cidade do contrato">
            <TextInput value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </Field>

          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={submit}>
              Criar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!viewing} onOpenChange={(o) => !o && setViewing(null)} title={viewing?.clientCompanyName ?? ""}>
        {viewing && (
          <div className="flex flex-col gap-4">
            <pre className="whitespace-pre-wrap text-white/70 text-xs leading-relaxed bg-white/[0.03] border border-white/10 rounded-lg p-4 max-h-[50vh] overflow-y-auto">
              {generateContractText(template, viewing)}
            </pre>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => navigator.clipboard.writeText(generateContractText(template, viewing))}
                className="inline-flex items-center gap-1.5"
              >
                <Copy size={13} /> Copiar
              </Button>
              <Button
                variant="primary"
                onClick={() => downloadTextFile(`contrato-${viewing.clientCompanyName}.txt`, generateContractText(template, viewing))}
                className="inline-flex items-center gap-1.5"
              >
                <Download size={13} /> Baixar .txt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
