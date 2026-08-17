import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
import { ACCENT, DANGER, panelStyle } from "./tokens";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-6 ${className}`} style={panelStyle}>
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

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputBase} ${props.className ?? ""}`} />;
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

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
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
