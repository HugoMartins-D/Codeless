import type { AdminModule } from "./modules";

export function ModulePlaceholder({ module }: { module: AdminModule }) {
  const Icon = module.icon;
  return (
    <div className="max-w-2xl">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <Icon size={20} className="text-white/60" />
      </div>
      <h1
        className="text-white text-2xl mb-2"
        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}
      >
        {module.title}
      </h1>
      <p className="text-white/40 text-sm leading-relaxed mb-5">{module.description}</p>
      <span
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase text-white/40"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
        Em construção
      </span>
    </div>
  );
}
