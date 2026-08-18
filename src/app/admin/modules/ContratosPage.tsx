import { useState } from "react";
import { Plus, Trash2, Copy, Download, X as XIcon } from "lucide-react";
import { uid } from "../lib/storage";
import { useSupabaseTable, useSupabaseSetting } from "../lib/supabaseData";
import { fromContractRow, toContractRow } from "../lib/mappers";
import { DEFAULT_TEMPLATE, DEFAULT_TEAM_ROSTER, generateContractText, downloadTextFile } from "../lib/contract";
import type { Contract, ContractSignatory, ContractStatus } from "../types";
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
  signatoryNames: [] as string[],
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
  const [roster, setRoster] = useSupabaseSetting<ContractSignatory[]>("contratos_equipe", DEFAULT_TEAM_ROSTER);
  const [newMember, setNewMember] = useState({ name: "", cpf: "" });

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [viewing, setViewing] = useState<Contract | null>(null);

  function toggleSignatory(name: string) {
    setForm((f) => ({
      ...f,
      signatoryNames: f.signatoryNames.includes(name) ? f.signatoryNames.filter((s) => s !== name) : [...f.signatoryNames, name],
    }));
  }

  function addRosterMember() {
    const name = newMember.name.trim();
    const cpf = newMember.cpf.trim();
    if (!name || !cpf || roster.some((m) => m.name === name)) return;
    setRoster([...roster, { name, cpf }]);
    setNewMember({ name: "", cpf: "" });
  }

  function removeRosterMember(name: string) {
    setRoster(roster.filter((m) => m.name !== name));
    setForm((f) => ({ ...f, signatoryNames: f.signatoryNames.filter((s) => s !== name) }));
  }

  function submit() {
    const implementationValue = Number(form.implementationValue.replace(",", "."));
    const monthlyValue = Number(form.monthlyValue.replace(",", "."));
    const signatories = roster.filter((m) => form.signatoryNames.includes(m.name));
    if (!form.clientCompanyName || !implementationValue || signatories.length === 0) return;

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
      signatories,
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
            <div className="flex flex-wrap gap-2 mb-3">
              {roster.map((m) => {
                const active = form.signatoryNames.includes(m.name);
                return (
                  <span
                    key={m.name}
                    onClick={() => toggleSignatory(m.name)}
                    className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full text-xs transition-colors cursor-pointer"
                    style={{
                      background: active ? "rgba(199,211,0,0.10)" : "rgba(255,255,255,0.03)",
                      border: active ? "1px solid rgba(199,211,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
                      color: active ? "#c7d300" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {m.name}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRosterMember(m.name);
                      }}
                      className="text-white/20 hover:text-[#e93e8f]"
                    >
                      <XIcon size={11} />
                    </button>
                  </span>
                );
              })}
            </div>
            <div className="flex gap-2">
              <TextInput
                placeholder="Nome"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="!py-1.5"
              />
              <TextInput
                placeholder="CPF"
                value={newMember.cpf}
                onChange={(e) => setNewMember({ ...newMember, cpf: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && addRosterMember()}
                className="!py-1.5 !w-40"
              />
              <Button onClick={addRosterMember}>Add</Button>
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
