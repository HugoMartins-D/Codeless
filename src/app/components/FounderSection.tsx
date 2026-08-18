import { motion } from "motion/react";
import { LogoMarkLarge } from "./Logo";

const tools = [
  { label: "Photoshop", src: "/photoshop.avif" },
  { label: "Illustrator", src: "/ILUSTRATOR.svg" },
  { label: "Figma", src: "/figma.avif" },
  { label: "Antigravity IDE", src: "/antigravity-color.png" },
];

function ToolBadge({ tool }: { tool: typeof tools[0] }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 p-3.5 transition-transform hover:scale-110"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        title={tool.label}
      >
        <img src={tool.src} alt={tool.label} className="w-full h-full object-contain" />
      </div>
      <span className="text-white/25 text-[10px] tracking-wider uppercase"
        style={{ fontFamily: "'Montserrat', sans-serif" }}>{tool.label}</span>
    </div>
  );
}

export function FounderSection() {
  return (
    <section id="ceo" className="py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.10)",
          }}
        >
          {/* Top specular */}
          <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.15) 40%, #e93e8faa 60%, transparent 90%)" }} />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[320px_1fr_320px]">

            {/* ── Photo card ── */}
            <div className="relative p-6 md:p-8">
              <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <img src="/foto-ceo.png" alt="Hugo Martins" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
                  style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 100%)" }} />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white text-xl mb-1" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}>
                    Hugo Martins
                  </p>
                  <p className="text-white/60 text-[11px] tracking-[0.2em] uppercase"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
                    Web Designer e Dev Front-end
                  </p>
                </div>
              </div>
            </div>

            {/* ── Middle text ── */}
            <div className="p-6 md:p-8 flex flex-col justify-center border-t lg:border-t-0 lg:border-l lg:border-r border-white/6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-white/30 text-xs tracking-[0.3em] uppercase"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>Quem está por trás</span>
              </div>
              <h3 className="text-white mb-4" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "1.6rem" }}>
                Do briefing ao deploy, com o time certo
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-3"
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Cada projeto é acompanhado por mim, que coordeno as etapas e, quando necessário,
                conto com desenvolvedores especializados de acordo com as necessidades do projeto.
              </p>
              <p className="text-white font-semibold text-sm leading-relaxed"
                style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Uma estrutura flexível, mas com o mesmo cuidado em cada etapa.
              </p>
            </div>

            {/* ── Decorative panel ── */}
            <div className="relative hidden lg:flex items-center justify-center p-8 overflow-hidden" style={{ background: "rgba(0,0,0,0.3)" }}>
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 50%, #5252A825 0%, transparent 70%)" }} />
              <div className="relative" style={{ width: 150, height: 176 }}>
                <div className="absolute inset-[-30%] rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, #e93e8f30 0%, transparent 70%)", filter: "blur(30px)" }} />
                <LogoMarkLarge color="white" />
              </div>
            </div>
          </div>

          {/* ── Tools used ── */}
          <div className="relative z-10 px-8 md:px-14 py-10 border-t border-white/6 text-center">
            <p className="text-white/25 text-xs tracking-[0.2em] uppercase mb-7"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>Ferramentas que uso</p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {tools.map((t) => <ToolBadge key={t.label} tool={t} />)}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
