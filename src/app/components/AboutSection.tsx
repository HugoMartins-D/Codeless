import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const steps = [
  { n: "01", t: "Briefing",          d: "Entendemos sua empresa, público e objetivos",      color: "#5252A8" },
  { n: "02", t: "Design",            d: "UI/UX autoral alinhado à sua identidade visual",    color: "#e93e8f" },
  { n: "03", t: "Desenvolvimento",   d: "Código limpo ou no-code, conforme sua necessidade", color: "#c7d300" },
  { n: "04", t: "Entrega & Suporte", d: "Deploy, treinamento e acompanhamento contínuo",     color: "#5252A8" },
];

export function AboutSection() {
  return (
    <section id="quem-somos" className="py-32 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #5252A810 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #e93e8f0a 0%, transparent 70%)", filter: "blur(60px)" }} />

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
            style={{ background: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.15) 40%, #5252A8aa 60%, transparent 90%)" }} />
          {/* Inner sheen */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, transparent 45%)", borderRadius: "inherit" }} />

          <div className="relative z-10 p-10 md:p-14">

            {/* ── Header row ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-10"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-5 h-px bg-white/20" />
                  <span className="text-white/30 text-xs tracking-[0.3em] uppercase"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>Quem somos e como trabalhamos</span>
                </div>
                {/* Headline */}
                <p className="text-white/60 text-base leading-relaxed max-w-xl"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Criamos{" "}
                  <span className="text-white font-semibold">sites exclusivos</span>{" "}
                  com a identidade da sua empresa, fortalecendo sua presença
                  no mercado e impulsionando sua{" "}
                  <span style={{ color: "#e93e8f" }} className="font-semibold">marca</span>.
                </p>
              </div>

              {/* Stats chips — right-aligned in header */}
              <div className="flex gap-3 shrink-0">
                {[
                  { v: "100%", l: "Exclusivos", c: "#c7d300" },
                  { v: "0",    l: "Templates",  c: "#e93e8f" },
                  { v: "24/7", l: "Suporte",    c: "#5252A8" },
                ].map(s => (
                  <div key={s.l}
                    className="flex flex-col items-center px-4 py-3 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.07), 0 0 20px ${s.c}10`,
                    }}
                  >
                    <p className="leading-none mb-1"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 18, color: s.c }}>
                      {s.v}
                    </p>
                    <p className="text-white/25 text-[10px] tracking-widest uppercase"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Two columns ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

              {/* LEFT */}
              <div>
                {/* Quote block */}
                <div
                  className="relative rounded-2xl p-5 mb-6 overflow-hidden"
                  style={{
                    background: "rgba(82,82,168,0.10)",
                    border: "1px solid rgba(82,82,168,0.18)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="absolute top-0 left-0 bottom-0 w-0.5 rounded-l-2xl"
                    style={{ background: "linear-gradient(180deg, #5252A8, #e93e8f)" }} />
                  <p className="text-white/55 text-sm leading-relaxed pl-3"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Na <span className="text-white font-semibold">CODE LESS</span>, cada projeto é
                    planejado de maneira <span className="text-white font-semibold">exclusiva</span>.
                    Não trabalhamos com <span className="text-white font-semibold">templates</span> prontos.
                  </p>
                </div>

                <p className="text-white/30 text-sm leading-relaxed mb-8"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Nosso objetivo é transformar seu site em uma porta de entrada
                  para novas oportunidades de negócio.
                </p>

                <button
                  onClick={() => window.open("https://wa.me/5547996258977", "_blank")}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-black text-sm transition-all hover:scale-105 active:scale-95"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 700,
                    background: "rgba(199,211,0,0.90)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.50), 0 8px 24px rgba(199,211,0,0.20)",
                  }}
                >
                  Quero meu site <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>

              {/* RIGHT — steps */}
              <div className="flex flex-col gap-2">
                {steps.map((s, i) => (
                  <motion.div
                    key={s.n}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="group relative flex items-center gap-4 rounded-xl px-5 py-4 overflow-hidden cursor-default transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(circle at 0% 50%, ${s.color}10 0%, transparent 60%)` }} />
                    <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `linear-gradient(90deg, ${s.color}50, transparent)` }} />

                    <span className="w-2 h-2 rounded-full shrink-0 transition-all duration-300 group-hover:scale-125"
                      style={{ backgroundColor: s.color }} />
                    <span className="text-white/20 text-xs w-5 shrink-0 tabular-nums"
                      style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>{s.n}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm leading-none mb-1"
                        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>{s.t}</p>
                      <p className="text-white/35 text-xs"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}>{s.d}</p>
                    </div>
                    <ArrowRight className="text-white/15 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" size={14} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
