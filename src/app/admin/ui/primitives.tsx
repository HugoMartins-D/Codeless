import { Children, isValidElement, useEffect, useRef, useState } from "react";
import type { ButtonHTMLAttributes, CSSProperties, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { ACCENT, DANGER, panelStyle } from "./tokens";

export function Panel({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`rounded-2xl p-6 ${className}`} style={{ ...panelStyle, ...style }}>
      {children}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-white/50 text-xs tracking-wide">{label}</span>
      {children}
    </label>
  );
}

const inputBase =
  "w-full rounded-lg px-3 py-2.5 text-white text-sm outline-none placeholder:text-white/25 bg-white/[0.04] border border-white/10 focus:border-white/25 transition-colors";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputBase} ${props.className ?? ""}`} />;
}

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

function optionsFromChildren(children: ReactNode): SelectOption[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child) || child.type !== "option") return [];
    const optionProps = child.props as { value?: string; children?: ReactNode; disabled?: boolean };
    return [
      {
        value: String(optionProps.value ?? ""),
        label: typeof optionProps.children === "string" ? optionProps.children : String(optionProps.children ?? ""),
        disabled: optionProps.disabled,
      },
    ];
  });
}

/**
 * O <select> nativo delega o dropdown ao SO/navegador, e o Opera GX (e outros
 * Chromium) ignora color-scheme e renderiza as opções com fundo claro do
 * sistema, deixando o texto branco do app ilegível. Por isso o dropdown é
 * inteiramente próprio (botão + lista posicionada), sempre no tema do app.
 */
export function SelectInput({ value, onChange, children, className = "", disabled }: SelectHTMLAttributes<HTMLSelectElement>) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const options = optionsFromChildren(children);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function selectOption(optionValue: string) {
    setOpen(false);
    onChange?.({ target: { value: optionValue } } as unknown as React.ChangeEvent<HTMLSelectElement>);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`${inputBase} flex items-center justify-between gap-2 text-left disabled:opacity-50 disabled:pointer-events-none ${className}`}
      >
        <span className={`truncate ${selected ? "" : "text-white/25"}`}>{selected?.label ?? ""}</span>
        <ChevronDown size={14} className="text-white/30 shrink-0 transition-transform" style={{ transform: open ? "rotate(180deg)" : undefined }} />
      </button>
      {open && (
        <div
          className="absolute left-0 right-0 mt-1.5 rounded-lg py-1 max-h-56 overflow-y-auto z-50"
          style={{ background: "#141416", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 12px 32px rgba(0,0,0,0.5)" }}
        >
          {options.map((o) => (
            <div
              key={o.value}
              onClick={() => !o.disabled && selectOption(o.value)}
              className={`px-3 py-2 text-sm transition-colors ${o.disabled ? "opacity-30" : "cursor-pointer hover:bg-white/[0.06]"}`}
              style={{ color: o.value === value ? ACCENT : "rgba(255,255,255,0.8)" }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputBase} resize-y ${props.className ?? ""}`} />;
}

type ButtonVariant = "primary" | "ghost" | "danger";

const variantStyle: Record<ButtonVariant, { background: string; border: string; color: string }> = {
  primary: { background: "rgba(199,211,0,0.10)", border: "1px solid rgba(199,211,0,0.30)", color: ACCENT },
  ghost: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" },
  danger: { background: "rgba(233,62,143,0.08)", border: "1px solid rgba(233,62,143,0.25)", color: DANGER },
};

export function Button({
  variant = "ghost",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg text-xs tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none ${className}`}
      style={{ fontWeight: 700, ...variantStyle[variant] }}
    />
  );
}

const badgeColors: Record<string, string> = {
  neutral: "rgba(255,255,255,0.4)",
  accent: ACCENT,
  danger: DANGER,
  warn: "#f5c400",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: keyof typeof badgeColors }) {
  const color = badgeColors[tone];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] tracking-widest uppercase"
      style={{ color, background: `${color}1a`, border: `1px solid ${color}40` }}
    >
      {children}
    </span>
  );
}

const statIconTone = {
  neutral: "rgba(255,255,255,0.6)",
  accent: ACCENT,
  warn: "#f5c400",
  danger: DANGER,
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  tone?: keyof typeof statIconTone;
}) {
  if (Icon) {
    const color = statIconTone[tone];
    return (
      <Panel className="!p-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${color}1a`, border: `1px solid ${color}40` }}
          >
            <Icon size={18} style={{ color }} />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xl" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}>
              {value}
            </p>
            <p className="text-white/40 text-xs truncate">{label}</p>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <Panel className="!p-5">
      <p className="text-white/40 text-[11px] tracking-widest uppercase mb-2">{label}</p>
      <p className="text-white text-2xl" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}>
        {value}
      </p>
      {hint && <p className="text-white/30 text-xs mt-1">{hint}</p>}
    </Panel>
  );
}

export function Avatar({ name, avatarUrl, size = 32 }: { name: string; avatarUrl?: string; size?: number }) {
  const initials = (name.trim() || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size, border: "1px solid rgba(255,255,255,0.12)" }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 text-white/60"
      style={{
        width: size,
        height: size,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        fontSize: size * 0.4,
        fontWeight: 700,
      }}
    >
      {initials}
    </div>
  );
}
