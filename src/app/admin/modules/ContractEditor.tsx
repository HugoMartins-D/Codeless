import { useMemo, useState } from "react";
import { X, Eye, EyeOff, Download, Save } from "lucide-react";
import { uid } from "../lib/storage";
import { generateContractText, downloadTextFile } from "../lib/contract";
import { renderContractBlocks } from "../lib/contractFormat";
import type { Client, Contract, ContractSignatory } from "../types";
import { Field, TextInput, SelectInput, TextArea, Button } from "../ui/primitives";
import { headingFont } from "../ui/tokens";

function formFromContract(c: Contract | null) {
  return {
    clientCompanyName: c?.clientCompanyName ?? "",
    clientCnpj: c?.clientCnpj ?? "",
    clientAddress: c?.clientAddress ?? "",
    clientRepresentative: c?.clientRepresentative ?? "",
    projectObject: c?.projectObject ?? "",
    implementationValue: c ? String(c.implementationValue) : "",
    implementationDueDate: c?.implementationDueDate ?? "",
    monthlyValue: c ? String(c.monthlyValue) : "",
    monthlyDueDay: c ? String(c.monthlyDueDay) : "25",
    signatoryNames: c?.signatories.map((s) => s.name) ?? ([] as string[]),
    city: c?.city ?? "Balneário Camboriú",
  };
}

export function ContractEditor({
  initial,
  template,
  roster,
  clients,
  onAddRosterMember,
  onRemoveRosterMember,
  onSave,
  onClose,
}: {
  initial: Contract | null;
  template: string;
  roster: ContractSignatory[];
  clients: Client[];
  onAddRosterMember: (m: ContractSignatory) => void;
  onRemoveRosterMember: (name: string) => void;
  onSave: (contract: Contract) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(formFromContract(initial));
  const [selectedClientId, setSelectedClientId] = useState("");
  const [newMember, setNewMember] = useState({ name: "", cpf: "" });
  const [previewOpen, setPreviewOpen] = useState(true);

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
    onAddRosterMember({ name, cpf });
    setNewMember({ name: "", cpf: "" });
  }

  function removeRosterMember(name: string) {
    onRemoveRosterMember(name);
    setForm((f) => ({ ...f, signatoryNames: f.signatoryNames.filter((s) => s !== name) }));
  }

  function applyClientAutofill(clientId: string) {
    setSelectedClientId(clientId);
    const client = clients.find((c) => c.id === clientId);
    if (client) setForm((f) => ({ ...f, clientCompanyName: client.name }));
  }

  const draft: Contract = useMemo(() => {
    const implementationValue = Number(form.implementationValue.replace(",", ".")) || 0;
    const monthlyValue = Number(form.monthlyValue.replace(",", ".")) || 0;
    return {
      id: initial?.id ?? "draft",
      clientCompanyName: form.clientCompanyName || "—",
      clientCnpj: form.clientCnpj,
      clientAddress: form.clientAddress,
      clientRepresentative: form.clientRepresentative,
      projectObject: form.projectObject,
      implementationValue,
      implementationDueDate: form.implementationDueDate || undefined,
      monthlyValue,
      monthlyDueDay: Number(form.monthlyDueDay) || 25,
      signatories: roster.filter((m) => form.signatoryNames.includes(m.name)),
      city: form.city,
      status: initial?.status ?? "rascunho",
      createdAt: initial?.createdAt ?? new Date().toISOString().slice(0, 10),
    };
  }, [form, roster, initial]);

  const previewText = useMemo(() => generateContractText(template, draft), [template, draft]);

  function handleSave() {
    if (!form.clientCompanyName || !draft.implementationValue || draft.signatories.length === 0) return;
    onSave({ ...draft, id: initial?.id ?? uid() });
  }

  function handleDownload() {
    downloadTextFile(`contrato-${draft.clientCompanyName}.txt`, previewText);
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <h2 className="text-white text-lg" style={headingFont}>
          {initial ? "Editar contrato" : "Novo contrato"}
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPreviewOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            {previewOpen ? <EyeOff size={14} /> : <Eye size={14} />}
            {previewOpen ? "Ocultar prévia" : "Mostrar prévia"}
          </button>
          <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        <div className={`overflow-y-auto p-6 ${previewOpen ? "w-full md:w-[440px] shrink-0" : "flex-1"}`}>
          <div className="flex flex-col gap-5 max-w-lg mx-auto md:mx-0">
            {clients.length > 0 && (
              <Field label="Cliente (autofill)">
                <SelectInput value={selectedClientId} onChange={(e) => applyClientAutofill(e.target.value)}>
                  <option value="">Em branco / sem cliente</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            )}

            <div>
              <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">Contratante</p>
              <div className="flex flex-col gap-4">
                <Field label="Nome da empresa">
                  <TextInput value={form.clientCompanyName} onChange={(e) => setForm({ ...form, clientCompanyName: e.target.value })} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="CPF/CNPJ">
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
              <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">Objeto e serviços</p>
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
              <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">Honorários</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Field label="Valor de implantação (R$)">
                  <TextInput
                    value={form.implementationValue}
                    onChange={(e) => setForm({ ...form, implementationValue: e.target.value })}
                    inputMode="decimal"
                  />
                </Field>
                <Field label="Vencimento da implantação">
                  <TextInput
                    type="date"
                    value={form.implementationDueDate}
                    onChange={(e) => setForm({ ...form, implementationDueDate: e.target.value })}
                  />
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
                        <X size={11} />
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
          </div>
        </div>

        {previewOpen && (
          <div className="flex-1 overflow-y-auto p-8 hidden md:block" style={{ background: "#0a0a0a" }}>
            <div
              className="max-w-2xl mx-auto rounded-lg overflow-hidden"
              style={{ background: "#fff", color: "#111", boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}
            >
              <div style={{ height: 4, background: "#c7d300" }} />
              <div className="p-10" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {renderContractBlocks(previewText)}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 px-6 py-4 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <Button onClick={handleDownload} className="inline-flex items-center gap-1.5">
          <Download size={14} /> Só baixar
        </Button>
        <Button variant="primary" onClick={handleSave} className="inline-flex items-center gap-1.5">
          <Save size={14} /> {initial ? "Salvar alterações" : "Gerar e salvar"}
        </Button>
      </div>
    </div>
  );
}
