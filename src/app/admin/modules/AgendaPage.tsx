import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Plus, Trash2, Pencil, Link as LinkIcon, CheckCircle2, XCircle } from "lucide-react";
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

  function openNewEvent() {
    setEditingId(null);
    setForm(emptyForm(connectedProviders));
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

  const providerLabel = { google: "Google", apple: "iCloud" } as const;

  return (
    <div className="max-w-5xl">
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
        <Button variant="primary" onClick={openNewEvent} disabled={connectedProviders.length === 0} className="inline-flex items-center gap-1.5">
          <Plus size={14} /> Novo evento
        </Button>
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

      <Panel>
        {loading && <p className="text-white/30 text-sm">Carregando…</p>}
        {!loading && connectedProviders.length === 0 && (
          <p className="text-white/30 text-sm">Conecte o Google ou o iCloud acima pra ver seus compromissos aqui.</p>
        )}
        {!loading && connectedProviders.length > 0 && events.length === 0 && (
          <p className="text-white/30 text-sm">Nenhum evento nos próximos dias.</p>
        )}
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
