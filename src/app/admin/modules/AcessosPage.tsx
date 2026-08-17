import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { uid } from "../lib/storage";
import { useSupabaseTable } from "../lib/supabaseData";
import { fromCollaboratorRow, toCollaboratorRow, fromClientRow, toClientRow } from "../lib/mappers";
import type { Client, Collaborator } from "../types";
import { adminModules } from "../modules";
import { Panel, Field, TextInput, Button } from "../ui/primitives";
import { Modal } from "../ui/Modal";
import { headingFont } from "../ui/tokens";

const emptyForm = { name: "", email: "" };

export function AcessosPage() {
  const [collaborators, setCollaborators] = useSupabaseTable<Collaborator>("collaborators", fromCollaboratorRow, toCollaboratorRow);
  const [clients] = useSupabaseTable<Client>("clients", fromClientRow, toClientRow);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function submit() {
    if (!form.name.trim()) return;
    setCollaborators((prev) => [{ id: uid(), name: form.name, email: form.email, moduleAccess: [], clientAccess: "all" }, ...prev]);
    setForm(emptyForm);
    setModalOpen(false);
  }

  function remove(id: string) {
    setCollaborators((prev) => prev.filter((c) => c.id !== id));
  }

  function toggleModule(id: string, slug: string) {
    setCollaborators((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, moduleAccess: c.moduleAccess.includes(slug) ? c.moduleAccess.filter((m) => m !== slug) : [...c.moduleAccess, slug] }
          : c,
      ),
    );
  }

  function setClientAccessMode(id: string, mode: "all" | "custom") {
    setCollaborators((prev) => prev.map((c) => (c.id === id ? { ...c, clientAccess: mode === "all" ? "all" : [] } : c)));
  }

  function toggleClient(id: string, clientId: string) {
    setCollaborators((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.clientAccess === "all") return c;
        const list = c.clientAccess.includes(clientId) ? c.clientAccess.filter((cid) => cid !== clientId) : [...c.clientAccess, clientId];
        return { ...c, clientAccess: list };
      }),
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-white text-2xl" style={headingFont}>
          Acessos
        </h1>
        <Button variant="primary" onClick={() => setModalOpen(true)} className="inline-flex items-center gap-1.5">
          <Plus size={14} /> Novo colaborador
        </Button>
      </div>
      <p className="text-white/30 text-xs mb-6">
        Isso define o que cada pessoa deve ver — hoje o painel usa uma senha única, então essas permissões ainda não são aplicadas
        automaticamente no login. Serve para já deixar mapeado para quando o time tiver acesso individual.
      </p>

      {collaborators.length === 0 && (
        <Panel>
          <p className="text-white/30 text-sm">Nenhum colaborador cadastrado ainda.</p>
        </Panel>
      )}

      <div className="flex flex-col gap-4">
        {collaborators.map((c) => (
          <Panel key={c.id}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white text-sm font-medium">{c.name}</p>
                {c.email && <p className="text-white/30 text-xs">{c.email}</p>}
              </div>
              <button onClick={() => remove(c.id)} className="text-white/20 hover:text-[#e93e8f] transition-colors">
                <Trash2 size={14} />
              </button>
            </div>

            <p className="text-white/40 text-[11px] tracking-widest uppercase mb-2">Abas visíveis</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {adminModules.map((m) => {
                const active = c.moduleAccess.includes(m.slug);
                return (
                  <button
                    key={m.slug}
                    onClick={() => toggleModule(c.id, m.slug)}
                    className="px-3 py-1.5 rounded-full text-xs transition-colors"
                    style={{
                      background: active ? "rgba(199,211,0,0.10)" : "rgba(255,255,255,0.03)",
                      border: active ? "1px solid rgba(199,211,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
                      color: active ? "#c7d300" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {m.title}
                  </button>
                );
              })}
            </div>

            <p className="text-white/40 text-[11px] tracking-widest uppercase mb-2">Clientes visíveis</p>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setClientAccessMode(c.id, "all")}
                className="px-3 py-1.5 rounded-full text-xs transition-colors"
                style={{
                  background: c.clientAccess === "all" ? "rgba(199,211,0,0.10)" : "rgba(255,255,255,0.03)",
                  border: c.clientAccess === "all" ? "1px solid rgba(199,211,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
                  color: c.clientAccess === "all" ? "#c7d300" : "rgba(255,255,255,0.5)",
                }}
              >
                Todos os clientes
              </button>
              <button
                onClick={() => setClientAccessMode(c.id, "custom")}
                className="px-3 py-1.5 rounded-full text-xs transition-colors"
                style={{
                  background: c.clientAccess !== "all" ? "rgba(199,211,0,0.10)" : "rgba(255,255,255,0.03)",
                  border: c.clientAccess !== "all" ? "1px solid rgba(199,211,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
                  color: c.clientAccess !== "all" ? "#c7d300" : "rgba(255,255,255,0.5)",
                }}
              >
                Selecionados
              </button>
            </div>
            {c.clientAccess !== "all" && (
              <div className="flex flex-wrap gap-2">
                {clients.length === 0 && <p className="text-white/30 text-xs">Cadastre clientes no módulo Clientes primeiro.</p>}
                {clients.map((cl) => {
                  const active = c.clientAccess !== "all" && c.clientAccess.includes(cl.id);
                  return (
                    <button
                      key={cl.id}
                      onClick={() => toggleClient(c.id, cl.id)}
                      className="px-3 py-1.5 rounded-full text-xs transition-colors"
                      style={{
                        background: active ? "rgba(199,211,0,0.10)" : "rgba(255,255,255,0.03)",
                        border: active ? "1px solid rgba(199,211,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
                        color: active ? "#c7d300" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {cl.name}
                    </button>
                  );
                })}
              </div>
            )}
          </Panel>
        ))}
      </div>

      <Modal open={modalOpen} onOpenChange={setModalOpen} title="Novo colaborador">
        <div className="flex flex-col gap-4">
          <Field label="Nome">
            <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="E-mail">
            <TextInput value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" />
          </Field>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button variant="primary" onClick={submit}>
              Adicionar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
