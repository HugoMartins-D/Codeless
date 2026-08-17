import { useState } from "react";
import { Plus, Trash2, Copy, Download } from "lucide-react";
import { useLocalStorage, uid } from "../lib/storage";
import { DEFAULT_TEMPLATE, generateContractText, downloadTextFile } from "../lib/contract";
import type { Contract, ContractStatus, PaymentMethod } from "../types";
import { Panel, Field, TextInput, SelectInput, TextArea, Button, Badge } from "../ui/primitives";
import { Modal } from "../ui/Modal";
import { currency, headingFont } from "../ui/tokens";

const emptyForm = {
  clientName: "",
  cpf: "",
  address: "",
  totalValue: "",
  paymentMethod: "pix" as PaymentMethod,
  installments: "1",
  validity: "",
  scope: "",
};

const statusTone: Record<ContractStatus, "neutral" | "warn" | "accent"> = {
  rascunho: "neutral",
  enviado: "warn",
  assinado: "accent",
};

export function ContratosPage() {
  const [contracts, setContracts] = useLocalStorage<Contract[]>("admin_contratos_list", []);
  const [template, setTemplate] = useLocalStorage("admin_contratos_template", DEFAULT_TEMPLATE);

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [viewing, setViewing] = useState<Contract | null>(null);

  function submit() {
    const totalValue = Number(form.totalValue.replace(",", "."));
    if (!form.clientName || !totalValue) return;

    const contract: Contract = {
      id: uid(),
      clientName: form.clientName,
      cpf: form.cpf,
      address: form.address,
      totalValue,
      paymentMethod: form.paymentMethod,
      installments: form.paymentMethod === "parcelado" ? Number(form.installments) || 1 : undefined,
      validity: form.validity,
      scope: form.scope,
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
        <p className="text-white/30 text-xs mt-2">
          Placeholders disponíveis: {"{{nome}}"} {"{{cpf}}"} {"{{endereco}}"} {"{{valor}}"} {"{{forma_pagamento}}"} {"{{vigencia}}"} {"{{escopo}}"} {"{{data}}"}
        </p>
      </Panel>

      <Panel>
        <p className="text-white/50 text-[11px] tracking-widest uppercase mb-4">Contratos</p>
        {contracts.length === 0 && <p className="text-white/30 text-sm">Nenhum contrato ainda.</p>}
        <div className="flex flex-col gap-1">
          {contracts.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 py-2.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors group">
              <button className="flex items-center gap-3 flex-1 min-w-0 text-left" onClick={() => setViewing(c)}>
                <span className="text-white/70 text-sm truncate">{c.clientName}</span>
                <span className="text-white/30 text-xs shrink-0">{currency(c.totalValue)}</span>
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
        <div className="flex flex-col gap-4">
          <Field label="Nome do cliente">
            <TextInput value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="CPF">
              <TextInput value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
            </Field>
            <Field label="Valor total (R$)">
              <TextInput value={form.totalValue} onChange={(e) => setForm({ ...form, totalValue: e.target.value })} inputMode="decimal" />
            </Field>
          </div>
          <Field label="Endereço">
            <TextInput value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Forma de pagamento">
              <SelectInput value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as PaymentMethod })}>
                <option value="pix">Pix</option>
                <option value="parcelado">Parcelado</option>
              </SelectInput>
            </Field>
            {form.paymentMethod === "parcelado" && (
              <Field label="Parcelas">
                <TextInput value={form.installments} onChange={(e) => setForm({ ...form, installments: e.target.value })} inputMode="numeric" />
              </Field>
            )}
          </div>
          <Field label="Vigência">
            <TextInput value={form.validity} onChange={(e) => setForm({ ...form, validity: e.target.value })} placeholder="Ex: 6 meses" />
          </Field>
          <Field label="Escopo do projeto">
            <TextArea rows={4} value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={submit}>
              Criar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!viewing} onOpenChange={(o) => !o && setViewing(null)} title={viewing?.clientName ?? ""}>
        {viewing && (
          <div className="flex flex-col gap-4">
            <pre className="whitespace-pre-wrap text-white/70 text-xs leading-relaxed bg-white/[0.03] border border-white/10 rounded-lg p-4">
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
                onClick={() => downloadTextFile(`contrato-${viewing.clientName}.txt`, generateContractText(template, viewing))}
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
