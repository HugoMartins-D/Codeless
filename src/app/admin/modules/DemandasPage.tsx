import { useMemo, useState } from "react";
import { Plus, Trash2, ArrowRight, ArrowLeft, List, KanbanSquare } from "lucide-react";
import { useLocalStorage, uid } from "../lib/storage";
import type { Client, Task, TaskStatus } from "../types";
import { Panel, Field, TextInput, SelectInput, Button, Badge } from "../ui/primitives";
import { Modal } from "../ui/Modal";
import { headingFont } from "../ui/tokens";

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

const emptyForm = { title: "", client: "", assignee: "", dueDate: "", status: "todo" as TaskStatus };

export function DemandasPage() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("admin_demandas_list", []);
  const [clients] = useLocalStorage<Client[]>("admin_clientes_list", []);
  const [view, setView] = useLocalStorage<"lista" | "kanban">("admin_demandas_view", "lista");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(t: Task) {
    setEditingId(t.id);
    setForm({ title: t.title, client: t.client, assignee: t.assignee ?? "", dueDate: t.dueDate ?? "", status: t.status });
    setModalOpen(true);
  }

  function submit() {
    if (!form.title.trim()) return;
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

  const grouped = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((t) => {
      const key = t.client || "Sem cliente";
      map.set(key, [...(map.get(key) ?? []), t]);
    });
    return Array.from(map.entries());
  }, [tasks]);

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
          <Button variant="primary" onClick={openNew} className="inline-flex items-center gap-1.5">
            <Plus size={14} /> Nova demanda
          </Button>
        </div>
      </div>

      {tasks.length === 0 && (
        <Panel>
          <p className="text-white/30 text-sm">Nenhuma demanda ainda.</p>
        </Panel>
      )}

      {view === "lista" && tasks.length > 0 && (
        <div className="flex flex-col gap-4">
          {grouped.map(([client, items]) => (
            <Panel key={client}>
              <p className="text-white/50 text-[11px] tracking-widest uppercase mb-3">{client}</p>
              <div className="flex flex-col gap-1">
                {items.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-3 py-2 px-2 rounded-lg hover:bg-white/[0.03] transition-colors group">
                    <button className="flex items-center gap-3 flex-1 min-w-0 text-left" onClick={() => openEdit(t)}>
                      <span className="text-white/70 text-sm truncate">{t.title}</span>
                      {t.assignee && <span className="text-white/30 text-xs shrink-0">{t.assignee}</span>}
                    </button>
                    {t.dueDate && <span className="text-white/40 text-xs shrink-0">{t.dueDate}</span>}
                    <Badge tone={statusTone[t.status]}>{COLUMNS.find((c) => c.status === t.status)?.label}</Badge>
                    <button onClick={() => remove(t.id)} className="text-white/20 hover:text-[#e93e8f] transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      )}

      {view === "kanban" && tasks.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {COLUMNS.map((col) => (
            <div key={col.status}>
              <p className="text-white/50 text-[11px] tracking-widest uppercase mb-3">
                {col.label} · {tasks.filter((t) => t.status === col.status).length}
              </p>
              <div className="flex flex-col gap-2">
                {tasks
                  .filter((t) => t.status === col.status)
                  .map((t) => (
                    <Panel key={t.id} className="!p-4">
                      <button className="text-left w-full" onClick={() => openEdit(t)}>
                        <p className="text-white/80 text-sm mb-1">{t.title}</p>
                        <p className="text-white/30 text-xs">{t.client || "Sem cliente"}</p>
                        {t.assignee && <p className="text-white/30 text-xs">{t.assignee}</p>}
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
                  ))}
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
            <TextInput value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} list="clientes-list" placeholder="Nome do cliente" />
            <datalist id="clientes-list">
              {clients.map((c) => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Responsável">
              <TextInput value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} />
            </Field>
            <Field label="Prazo">
              <TextInput type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </Field>
          </div>
          <Field label="Status">
            <SelectInput value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}>
              {COLUMNS.map((c) => (
                <option key={c.status} value={c.status}>
                  {c.label}
                </option>
              ))}
            </SelectInput>
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
