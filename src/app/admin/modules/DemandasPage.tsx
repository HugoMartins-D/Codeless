import { useMemo, useState } from "react";
import { Plus, Trash2, ArrowRight, ArrowLeft, List, KanbanSquare, Link as LinkIcon, FileText, AlertCircle, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLocalStorage, uid } from "../lib/storage";
import { useSupabaseTable } from "../lib/supabaseData";
import {
  fromTaskRow,
  toTaskRow,
  fromClientRow,
  toClientRow,
  fromCollaboratorRow,
  toCollaboratorRow,
  fromContractRow,
  toContractRow,
} from "../lib/mappers";
import { getTaskUrgency, isSafeUrl, type TaskUrgency } from "../lib/demandas";
import type { Client, Collaborator, Contract, Task, TaskStatus } from "../types";
import { ADMIN_EMAIL, allowedClientIds, useMyAccess } from "../lib/access";
import { useSession } from "../auth";
import { Panel, Field, TextInput, TextArea, SelectInput, Button, Badge } from "../ui/primitives";
import { Modal } from "../ui/Modal";
import { DANGER, headingFont } from "../ui/tokens";

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "A fazer" },
  { status: "doing", label: "Em andamento" },
  { status: "done", label: "Concluído" },
];

const statusTone: Record<TaskStatus, "neutral" | "warn" | "accent"> = {
  todo: "neutral",
  doing: "warn",
  done: "accent",
};

const urgencyStyle: Record<TaskUrgency, { color: string; Icon: LucideIcon | null }> = {
  overdue: { color: DANGER, Icon: AlertCircle },
  soon: { color: "#f5c400", Icon: Clock },
  normal: { color: "rgba(255,255,255,0.4)", Icon: null },
};

const emptyForm = {
  title: "",
  client: "",
  clientId: "",
  description: "",
  assignees: [] as string[],
  dueDate: "",
  status: "todo" as TaskStatus,
  deliverableUrl: "",
  contractId: "",
};

export function DemandasPage() {
  const access = useMyAccess(useSession() ?? null);
  const clientIds = allowedClientIds(access);
  const [tasks, setTasks] = useSupabaseTable<Task>(
    "tasks",
    fromTaskRow,
    toTaskRow,
    clientIds ? { column: "client_id", values: clientIds } : null,
  );
  const [clients] = useSupabaseTable<Client>(
    "clients",
    fromClientRow,
    toClientRow,
    clientIds ? { column: "id", values: clientIds } : null,
  );
  const [collaborators] = useSupabaseTable<Collaborator>("collaborators", fromCollaboratorRow, toCollaboratorRow);
  const [contracts] = useSupabaseTable<Contract>(
    "contracts",
    fromContractRow,
    toContractRow,
    clientIds ? { column: "client_id", values: clientIds } : null,
  );
  const [view, setView] = useLocalStorage<"lista" | "kanban">("admin_demandas_view", "lista");

  const assigneeOptions = [
    "Você (admin)",
    ...collaborators.filter((c) => c.status === "approved" && c.email !== ADMIN_EMAIL).map((c) => c.name),
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);

  const contractsForClient = useMemo(
    () => contracts.filter((c) => c.clientCompanyName.trim().toLowerCase() === form.client.trim().toLowerCase()),
    [contracts, form.client],
  );

  function contractLabel(contractId?: string) {
    if (!contractId) return null;
    const c = contracts.find((x) => x.id === contractId);
    if (!c) return null;
    const scope = c.projectObject ? (c.projectObject.length > 30 ? `${c.projectObject.slice(0, 30)}…` : c.projectObject) : "Contrato";
    return scope;
  }

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(t: Task) {
    setEditingId(t.id);
    setForm({
      title: t.title,
      client: t.client,
      clientId: t.clientId ?? "",
      description: t.description ?? "",
      assignees: t.assignees ?? [],
      dueDate: t.dueDate ?? "",
      status: t.status,
      deliverableUrl: t.deliverableUrl ?? "",
      contractId: t.contractId ?? "",
    });
    setModalOpen(true);
  }

  function submit() {
    if (!form.title.trim()) return;
    if (form.deliverableUrl.trim() && !isSafeUrl(form.deliverableUrl.trim())) return;
    if (editingId) {
      setTasks((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...form } : t)));
    } else {
      setTasks((prev) => [{ id: uid(), ...form }, ...prev]);
    }
    setModalOpen(false);
  }

  function remove(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function moveStatus(id: string, dir: 1 | -1) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const idx = COLUMNS.findIndex((c) => c.status === t.status);
        const next = COLUMNS[Math.min(COLUMNS.length - 1, Math.max(0, idx + dir))];
        return { ...t, status: next.status };
      }),
    );
  }

  const workload = useMemo(() => {
    const counts = new Map<string, number>();
    tasks
      .filter((t) => t.status !== "done")
      .forEach((t) => {
        const names = t.assignees.length > 0 ? t.assignees : ["Sem responsável"];
        names.forEach((name) => counts.set(name, (counts.get(name) ?? 0) + 1));
      });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [tasks]);

  const visibleTasks = useMemo(
    () =>
      assigneeFilter
        ? tasks.filter((t) => (t.assignees.length > 0 ? t.assignees : ["Sem responsável"]).includes(assigneeFilter))
        : tasks,
    [tasks, assigneeFilter],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Task[]>();
    visibleTasks.forEach((t) => {
      const key = t.client || "Sem cliente";
      map.set(key, [...(map.get(key) ?? []), t]);
    });
    return Array.from(map.entries());
  }, [visibleTasks]);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl" style={headingFont}>
          Demandas
        </h1>
        <div className="flex gap-2">
          <div className="flex rounded-lg overflow-hidden border border-white/10">
            <button
              onClick={() => setView("lista")}
              className="px-3 py-2 text-xs inline-flex items-center gap-1.5"
              style={{ background: view === "lista" ? "rgba(199,211,0,0.10)" : "transparent", color: view === "lista" ? "#c7d300" : "rgba(255,255,255,0.5)" }}
            >
              <List size={13} /> Lista
            </button>
            <button
              onClick={() => setView("kanban")}
              className="px-3 py-2 text-xs inline-flex items-center gap-1.5"
              style={{ background: view === "kanban" ? "rgba(199,211,0,0.10)" : "transparent", color: view === "kanban" ? "#c7d300" : "rgba(255,255,255,0.5)" }}
            >
              <KanbanSquare size={13} /> Kanban
            </button>
          </div>
          {access.canCreateDemandas && (
            <Button variant="primary" onClick={openNew} className="inline-flex items-center gap-1.5">
              <Plus size={14} /> Nova demanda
            </Button>
          )}
        </div>
      </div>

      {workload.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {workload.map(([name, count]) => {
            const active = assigneeFilter === name;
            return (
              <button
                key={name}
                onClick={() => setAssigneeFilter(active ? null : name)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors"
                style={{
                  background: active ? "rgba(199,211,0,0.10)" : "rgba(255,255,255,0.03)",
                  border: active ? "1px solid rgba(199,211,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
                  color: active ? "#c7d300" : "rgba(255,255,255,0.5)",
                }}
              >
                {name} <span style={{ opacity: 0.6 }}>· {count} em aberto</span>
              </button>
            );
          })}
        </div>
      )}

      {visibleTasks.length === 0 && (
        <Panel>
          <p className="text-white/30 text-sm">{assigneeFilter ? "Nenhuma demanda em aberto para essa pessoa." : "Nenhuma demanda ainda."}</p>
        </Panel>
      )}

      {view === "lista" && visibleTasks.length > 0 && (
        <div className="flex flex-col gap-4">
          {grouped.map(([client, items]) => (
            <Panel key={client}>
              <p className="text-white/50 text-[11px] tracking-widest uppercase mb-3">{client}</p>
              <div className="flex flex-col gap-1">
                {items.map((t) => {
                  const urgency = getTaskUrgency(t.dueDate, t.status);
                  const uStyle = urgencyStyle[urgency];
                  const scope = contractLabel(t.contractId);
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-3 py-2 px-2 rounded-lg hover:bg-white/[0.03] transition-colors group"
                      style={urgency !== "normal" ? { borderLeft: `2px solid ${uStyle.color}` } : undefined}
                    >
                      <button className="flex items-center gap-3 flex-1 min-w-0 text-left" onClick={() => openEdit(t)}>
                        <span className="text-white/70 text-sm truncate">{t.title}</span>
                        {t.assignees.length > 0 && <span className="text-white/30 text-xs shrink-0">{t.assignees.join(", ")}</span>}
                        {scope && (
                          <span className="inline-flex items-center gap-1 text-white/25 text-xs shrink-0">
                            <FileText size={11} /> {scope}
                          </span>
                        )}
                      </button>
                      {t.deliverableUrl && isSafeUrl(t.deliverableUrl) && (
                        <a
                          href={t.deliverableUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#c7d300]/70 hover:text-[#c7d300] shrink-0"
                          title="Ver entregável"
                        >
                          <LinkIcon size={14} />
                        </a>
                      )}
                      {t.dueDate && (
                        <span className="inline-flex items-center gap-1 text-xs shrink-0" style={{ color: uStyle.color }}>
                          {uStyle.Icon && <uStyle.Icon size={12} />}
                          {t.dueDate}
                        </span>
                      )}
                      <Badge tone={statusTone[t.status]}>{COLUMNS.find((c) => c.status === t.status)?.label}</Badge>
                      <button onClick={() => remove(t.id)} className="text-white/20 hover:text-[#e93e8f] transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </Panel>
          ))}
        </div>
      )}

      {view === "kanban" && visibleTasks.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <div key={col.status}>
              <p className="text-white/50 text-[11px] tracking-widest uppercase mb-3">
                {col.label} · {visibleTasks.filter((t) => t.status === col.status).length}
              </p>
              <div className="flex flex-col gap-2">
                {visibleTasks
                  .filter((t) => t.status === col.status)
                  .map((t) => {
                    const urgency = getTaskUrgency(t.dueDate, t.status);
                    const uStyle = urgencyStyle[urgency];
                    const scope = contractLabel(t.contractId);
                    return (
                      <Panel key={t.id} className="!p-4" style={urgency !== "normal" ? { borderLeft: `3px solid ${uStyle.color}` } : undefined}>
                        <button className="text-left w-full" onClick={() => openEdit(t)}>
                          <p className="text-white/80 text-sm mb-1">{t.title}</p>
                          <p className="text-white/30 text-xs">{t.client || "Sem cliente"}</p>
                          {t.assignees.length > 0 && <p className="text-white/30 text-xs">{t.assignees.join(", ")}</p>}
                          {scope && (
                            <p className="inline-flex items-center gap-1 text-white/25 text-xs mt-1">
                              <FileText size={11} /> {scope}
                            </p>
                          )}
                          {t.dueDate && (
                            <p className="inline-flex items-center gap-1 text-xs mt-1" style={{ color: uStyle.color }}>
                              {uStyle.Icon && <uStyle.Icon size={11} />} {t.dueDate}
                            </p>
                          )}
                          {t.deliverableUrl && (
                            <span className="inline-flex items-center gap-1 text-[#c7d300]/70 text-xs mt-1">
                              <LinkIcon size={11} /> entregue
                            </span>
                          )}
                        </button>
                        <div className="flex items-center justify-between mt-3">
                          <button
                            disabled={col.status === "todo"}
                            onClick={() => moveStatus(t.id, -1)}
                            className="text-white/30 hover:text-white/70 disabled:opacity-20"
                          >
                            <ArrowLeft size={14} />
                          </button>
                          <button onClick={() => remove(t.id)} className="text-white/20 hover:text-[#e93e8f]">
                            <Trash2 size={13} />
                          </button>
                          <button
                            disabled={col.status === "done"}
                            onClick={() => moveStatus(t.id, 1)}
                            className="text-white/30 hover:text-white/70 disabled:opacity-20"
                          >
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </Panel>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen} title={editingId ? "Editar demanda" : "Nova demanda"}>
        <div className="flex flex-col gap-4">
          <Field label="Título">
            <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Cliente">
            <TextInput
              value={form.client}
              onChange={(e) => {
                const client = e.target.value;
                const match = clients.find((c) => c.name.trim().toLowerCase() === client.trim().toLowerCase());
                setForm({ ...form, client, clientId: match?.id ?? "", contractId: "" });
              }}
              list="clientes-list"
              placeholder="Nome do cliente"
            />
            <datalist id="clientes-list">
              {clients.map((c) => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>
          </Field>
          <Field label="Contrato / escopo">
            <SelectInput
              value={form.contractId}
              onChange={(e) => setForm({ ...form, contractId: e.target.value })}
              disabled={contractsForClient.length === 0}
            >
              <option value="">{contractsForClient.length === 0 ? "Nenhum contrato para esse cliente" : "Sem contrato vinculado"}</option>
              {contractsForClient.map((c) => (
                <option key={c.id} value={c.id}>
                  {(c.projectObject || "Contrato").slice(0, 50)} · {c.status}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Descrição">
            <TextArea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="O que a pessoa responsável precisa fazer"
            />
          </Field>
          <Field label="Responsáveis">
            <div className="flex flex-wrap gap-2">
              {assigneeOptions.map((name) => {
                const active = form.assignees.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        assignees: active ? f.assignees.filter((a) => a !== name) : [...f.assignees, name],
                      }))
                    }
                    className="px-3 py-1.5 rounded-full text-xs transition-colors"
                    style={{
                      background: active ? "rgba(199,211,0,0.10)" : "rgba(255,255,255,0.03)",
                      border: active ? "1px solid rgba(199,211,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
                      color: active ? "#c7d300" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Prazo">
            <TextInput type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </Field>
          <Field label="Status">
            <SelectInput value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}>
              {COLUMNS.map((c) => (
                <option key={c.status} value={c.status}>
                  {c.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Link do entregável">
            <TextInput
              type="url"
              value={form.deliverableUrl}
              onChange={(e) => setForm({ ...form, deliverableUrl: e.target.value })}
              placeholder="https://drive.google.com/..."
            />
          </Field>
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
