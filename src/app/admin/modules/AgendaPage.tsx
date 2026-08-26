import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  Trash2,
  Pencil,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  List,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  listAccounts,
  disconnectAccount,
  getGoogleAuthUrl,
  connectApple,
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  type CalendarAccount,
  type CalendarEvent,
} from "../lib/calendarApi";
import { useSupabaseTable } from "../lib/supabaseData";
import { fromContractRow, toContractRow, fromTaskRow, toTaskRow } from "../lib/mappers";
import type { Contract, Task } from "../types";
import { Panel, Field, TextInput, TextArea, SelectInput, Button, Badge } from "../ui/primitives";
import { Modal } from "../ui/Modal";
import { headingFont } from "../ui/tokens";

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string): string {
  return new Date(value).toISOString();
}

function dateKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const WEEKDAY_LABELS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

/** 6 semanas (42 dias) começando no domingo da semana do dia 1, pra grade de calendário sempre completa. */
function buildMonthGrid(monthCursor: Date): Date[] {
  const firstOfMonth = new Date(monthCursor.getFullYear(), monthCursor.getMonth(), 1);
  const start = new Date(firstOfMonth);
  start.setDate(start.getDate() - firstOfMonth.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function emptyForm(providers: ("google" | "apple")[]) {
  const now = new Date();
  const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
  return {
    provider: providers[0] ?? "google",
    title: "",
    description: "",
    start: toLocalInput(now.toISOString()),
    end: toLocalInput(inOneHour.toISOString()),
    contractId: "",
    taskId: "",
  };
}

export function AgendaPage() {
  const [accounts, setAccounts] = useState<CalendarAccount[] | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [appleModalOpen, setAppleModalOpen] = useState(false);
  const [appleForm, setAppleForm] = useState({ icloudEmail: "", appSpecificPassword: "" });
  const [appleError, setAppleError] = useState<string | null>(null);
  const [appleLoading, setAppleLoading] = useState(false);

  const [viewMode, setViewMode] = useState<"list" | "month">("month");
  const [monthCursor, setMonthCursor] = useState(() => new Date());

  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const connectedProviders = useMemo(() => (accounts ?? []).map((a) => a.provider), [accounts]);
  const [form, setForm] = useState(emptyForm([]));

  const [contracts] = useSupabaseTable<Contract>("contracts", fromContractRow, toContractRow);
  const [tasks] = useSupabaseTable<Task>("tasks", fromTaskRow, toTaskRow);

  async function reload() {
    setLoading(true);
    setError(null);
    try {
      const [accs, evs] = await Promise.all([listAccounts(), listEvents()]);
      setAccounts(accs);
      setEvents(evs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao carregar a agenda.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const google = params.get("google");
    if (google === "connected") setNotice("Google Agenda conectada.");
    if (google === "error") setError("Não deu pra conectar o Google Agenda. Tente de novo.");
    if (google) {
      params.delete("google");
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params}` : ""}`;
      window.history.replaceState({}, "", newUrl);
    }
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleConnectGoogle() {
    try {
      const url = await getGoogleAuthUrl();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao iniciar conexão com o Google.");
    }
  }

  async function handleDisconnect(provider: "google" | "apple") {
    try {
      await disconnectAccount(provider);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao desconectar.");
    }
  }

  async function handleConnectApple() {
    setAppleError(null);
    setAppleLoading(true);
    try {
      await connectApple(appleForm.icloudEmail, appleForm.appSpecificPassword);
      setAppleModalOpen(false);
      setAppleForm({ icloudEmail: "", appSpecificPassword: "" });
      await reload();
    } catch (err) {
      setAppleError(err instanceof Error ? err.message : "Falha ao conectar o iCloud.");
    } finally {
      setAppleLoading(false);
    }
  }

  function openNewEvent(prefillDate?: Date) {
    setEditingId(null);
    const base = emptyForm(connectedProviders);
    if (prefillDate) {
      const start = new Date(prefillDate);
      start.setHours(9, 0, 0, 0);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      base.start = toLocalInput(start.toISOString());
      base.end = toLocalInput(end.toISOString());
    }
    setForm(base);
    setEventModalOpen(true);
  }

  function openEditEvent(ev: CalendarEvent) {
    setEditingId(ev.id);
    setForm({
      provider: ev.provider,
      title: ev.title,
      description: ev.description ?? "",
      start: toLocalInput(ev.start),
      end: toLocalInput(ev.end),
      contractId: ev.contractId ?? "",
      taskId: ev.taskId ?? "",
    });
    setEventModalOpen(true);
  }

  async function handleSaveEvent() {
    const input = {
      title: form.title,
      description: form.description || undefined,
      start: fromLocalInput(form.start),
      end: fromLocalInput(form.end),
      contractId: form.contractId || undefined,
      taskId: form.taskId || undefined,
    };
    try {
      if (editingId) {
        await updateEvent(editingId, input);
      } else {
        await createEvent({ ...input, provider: form.provider as "google" | "apple" });
      }
      setEventModalOpen(false);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar o evento.");
    }
  }

  async function handleDeleteEvent(id: string) {
    try {
      await deleteEvent(id);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao excluir o evento.");
    }
  }

  const eventsByDay = useMemo(() => {
    const groups = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const day = new Date(ev.start).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
      if (!groups.has(day)) groups.set(day, []);
      groups.get(day)!.push(ev);
    }
    return Array.from(groups.entries());
  }, [events]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const key = dateKey(new Date(ev.start));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return map;
  }, [events]);

  const monthGrid = useMemo(() => buildMonthGrid(monthCursor), [monthCursor]);
  const today = dateKey(new Date());

  const providerLabel = { google: "Google", apple: "iCloud" } as const;
  const providerDot = { google: "#4285f4", apple: "#a2aaad" } as const;

  return (
    <div className={viewMode === "month" ? "max-w-6xl" : "max-w-5xl"}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <CalendarDays size={20} className="text-white/60" />
          </div>
          <div>
            <h1 className="text-white text-2xl" style={headingFont}>
              Agenda
            </h1>
            <p className="text-white/40 text-xs">Google e iCloud sincronizados num só lugar</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            {(["month", "list"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs transition-colors"
                style={{
                  background: viewMode === mode ? "rgba(199,211,0,0.10)" : "transparent",
                  color: viewMode === mode ? "#c7d300" : "rgba(255,255,255,0.5)",
                }}
              >
                {mode === "month" ? <LayoutGrid size={13} /> : <List size={13} />}
                {mode === "month" ? "Calendário" : "Lista"}
              </button>
            ))}
          </div>
          <Button variant="primary" onClick={() => openNewEvent()} disabled={connectedProviders.length === 0} className="inline-flex items-center gap-1.5">
            <Plus size={14} /> Novo evento
          </Button>
        </div>
      </div>

      {notice && <p className="text-[#c7d300] text-xs mb-4">{notice}</p>}
      {error && <p className="text-[#e93e8f] text-xs mb-4">{error}</p>}

      <Panel className="mb-6">
        <p className="text-white/40 text-[11px] tracking-widest uppercase mb-3">Contas conectadas</p>
        <div className="flex flex-wrap gap-3">
          {(["google", "apple"] as const).map((provider) => {
            const account = accounts?.find((a) => a.provider === provider);
            return (
              <div
                key={provider}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {account ? <CheckCircle2 size={14} className="text-[#c7d300]" /> : <XCircle size={14} className="text-white/25" />}
                <div>
                  <p className="text-white/80 text-xs">{providerLabel[provider]}</p>
                  {account && <p className="text-white/30 text-[11px]">{account.email}</p>}
                </div>
                {account ? (
                  <button onClick={() => handleDisconnect(provider)} className="text-white/30 hover:text-[#e93e8f] text-[11px] ml-2">
                    Desconectar
                  </button>
                ) : (
                  <button
                    onClick={() => (provider === "google" ? handleConnectGoogle() : setAppleModalOpen(true))}
                    className="text-[#c7d300] text-[11px] ml-2"
                  >
                    Conectar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </Panel>

      {loading && (
        <Panel>
          <p className="text-white/30 text-sm">Carregando…</p>
        </Panel>
      )}
      {!loading && connectedProviders.length === 0 && (
        <Panel>
          <p className="text-white/30 text-sm">Conecte o Google ou o iCloud acima pra ver seus compromissos aqui.</p>
        </Panel>
      )}

      {!loading && connectedProviders.length > 0 && viewMode === "list" && (
        <Panel>
          {events.length === 0 && <p className="text-white/30 text-sm">Nenhum evento nos próximos dias.</p>}
          <div className="flex flex-col gap-5">
            {eventsByDay.map(([day, dayEvents]) => (
              <div key={day}>
                <p className="text-white/40 text-[11px] tracking-widest uppercase mb-2">{day}</p>
                <div className="flex flex-col gap-1">
                  {dayEvents.map((ev) => (
                    <div key={ev.id} className="flex items-center justify-between gap-3 py-2.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors group">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="text-white/40 text-xs w-12 shrink-0">
                          {new Date(ev.start).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white/80 text-sm truncate">{ev.title}</p>
                          {(ev.contractId || ev.taskId) && (
                            <p className="text-white/30 text-xs truncate flex items-center gap-1">
                              <LinkIcon size={10} />
                              {ev.contractId && contracts.find((c) => c.id === ev.contractId)?.clientCompanyName}
                              {ev.taskId && tasks.find((t) => t.id === ev.taskId)?.title}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge tone="neutral">{providerLabel[ev.provider]}</Badge>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => openEditEvent(ev)} className="p-1.5 text-white/30 hover:text-white/70 transition-colors" title="Editar">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDeleteEvent(ev.id)} className="p-1.5 text-white/30 hover:text-[#e93e8f] transition-colors" title="Excluir">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {!loading && connectedProviders.length > 0 && viewMode === "month" && (
        <Panel className="!p-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              className="p-1.5 text-white/40 hover:text-white/80 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-3">
              <p className="text-white/80 text-sm" style={headingFont}>
                {monthCursor.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }).replace(/^\w/, (c) => c.toUpperCase())}
              </p>
              <button onClick={() => setMonthCursor(new Date())} className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
                Hoje
              </button>
            </div>
            <button
              onClick={() => setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              className="p-1.5 text-white/40 hover:text-white/80 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="text-white/30 text-[10px] tracking-widest uppercase text-center py-1.5">
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {monthGrid.map((day) => {
              const key = dateKey(day);
              const dayEvents = eventsByDate.get(key) ?? [];
              const isCurrentMonth = day.getMonth() === monthCursor.getMonth();
              const isToday = key === today;
              const visible = dayEvents.slice(0, 3);
              const overflow = dayEvents.length - visible.length;
              return (
                <div
                  key={key}
                  onClick={() => openNewEvent(day)}
                  className="rounded-lg p-1.5 min-h-[92px] cursor-pointer transition-colors hover:bg-white/[0.03] flex flex-col gap-1"
                  style={{
                    background: isToday ? "rgba(199,211,0,0.06)" : "transparent",
                    border: isToday ? "1px solid rgba(199,211,0,0.25)" : "1px solid rgba(255,255,255,0.04)",
                    opacity: isCurrentMonth ? 1 : 0.35,
                  }}
                >
                  <span className="text-[11px] text-white/50">{day.getDate()}</span>
                  <div className="flex flex-col gap-0.5">
                    {visible.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditEvent(ev);
                        }}
                        title={ev.title}
                        className="flex items-center gap-1 px-1 py-0.5 rounded text-[10px] text-white/70 truncate hover:bg-white/[0.06]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: providerDot[ev.provider] }} />
                        <span className="truncate">{ev.title}</span>
                      </div>
                    ))}
                    {overflow > 0 && <p className="text-[10px] text-white/30 px-1">+{overflow} mais</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      <Modal open={appleModalOpen} onOpenChange={setAppleModalOpen} title="Conectar iCloud">
        <div className="flex flex-col gap-4">
          <p className="text-white/40 text-xs">
            Gere uma senha específica de app em{" "}
            <span className="text-white/60">appleid.apple.com → Segurança → Senhas para apps</span> e cole abaixo. Sua senha normal do
            Apple ID não funciona aqui.
          </p>
          <Field label="E-mail do iCloud">
            <TextInput
              type="email"
              value={appleForm.icloudEmail}
              onChange={(e) => setAppleForm({ ...appleForm, icloudEmail: e.target.value })}
            />
          </Field>
          <Field label="Senha específica de app">
            <TextInput
              type="password"
              value={appleForm.appSpecificPassword}
              onChange={(e) => setAppleForm({ ...appleForm, appSpecificPassword: e.target.value })}
              placeholder="xxxx-xxxx-xxxx-xxxx"
            />
          </Field>
          {appleError && <p className="text-[#e93e8f] text-xs">{appleError}</p>}
          <Button variant="primary" onClick={handleConnectApple} disabled={appleLoading}>
            {appleLoading ? "Conectando…" : "Conectar"}
          </Button>
        </div>
      </Modal>

      <Modal open={eventModalOpen} onOpenChange={setEventModalOpen} title={editingId ? "Editar evento" : "Novo evento"}>
        <div className="flex flex-col gap-4">
          {!editingId && (
            <Field label="Agenda">
              <SelectInput value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value as "google" | "apple" })}>
                {connectedProviders.map((p) => (
                  <option key={p} value={p}>
                    {providerLabel[p]}
                  </option>
                ))}
              </SelectInput>
            </Field>
          )}
          <Field label="Título">
            <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Descrição">
            <TextArea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Início">
              <TextInput type="datetime-local" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} />
            </Field>
            <Field label="Fim">
              <TextInput type="datetime-local" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} />
            </Field>
          </div>
          <Field label="Vincular a contrato (opcional)">
            <SelectInput value={form.contractId} onChange={(e) => setForm({ ...form, contractId: e.target.value })}>
              <option value="">Nenhum</option>
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.clientCompanyName}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Vincular a demanda (opcional)">
            <SelectInput value={form.taskId} onChange={(e) => setForm({ ...form, taskId: e.target.value })}>
              <option value="">Nenhuma</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Button variant="primary" onClick={handleSaveEvent}>
            {editingId ? "Salvar alterações" : "Criar evento"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
