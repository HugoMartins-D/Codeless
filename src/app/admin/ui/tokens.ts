export const ACCENT = "#c7d300";
export const DANGER = "#e93e8f";
export const BG = "#050505";

export const panelStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
} as const;

export const headingFont = {
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 800,
} as const;

export function currency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
}

export function monthLabelFull(key: string): string {
  const [y, m] = key.split("-").map(Number);
  const label = new Date(y, m - 1, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
