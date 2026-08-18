import { motion } from "motion/react";
import { ArrowDownRight } from "lucide-react";
import TextPressure from "./ui/TextPressure";

/* ── Wavy line-art background ────────────────────────────────────── */
function WavyBackground() {
  const rows = [
    { y: 60, opacity: 0.10, dur: 22 },
    { y: 110, opacity: 0.16, dur: 26 },
    { y: 160, opacity: 0.22, dur: 19 },
    { y: 210, opacity: 0.14, dur: 24 },
    { y: 260, opacity: 0.08, dur: 30 },
  ];
  return (
    <svg className="absolute inset-x-0 bottom-0 w-full" height="320" viewBox="0 0 1440 320" preserveAspectRatio="none">
      {rows.map((r, i) => (
        <motion.path
          key={i}
          d={`M-100,${r.y} C 260,${r.y - 60} 500,${r.y + 60} 760,${r.y} C 1020,${r.y - 60} 1260,${r.y + 60} 1540,${r.y}`}
          fill="none"
          stroke="white"
          strokeWidth="1"
          strokeOpacity={r.opacity}
          animate={{ x: [0, -100, 0] }}
          transition={{ repeat: Infinity, duration: r.dur, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

/* ── Stats row ────────────────────────────────────────────────────── */
const stats = [
  { value: "Com & Sem", label: "Código", color: "#c7d300" },
  { value: "100%", label: "Exclusivos", color: "#e93e8f" },
  { value: "0", label: "Templates", color: "#5252A8" },
];

/* ── Section ──────────────────────────────────────────────────────── */
export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-16">
      {/* Global ambient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 30%, #5252A80a 0%, transparent 70%)" }} />

      {/* Wavy texture */}
      <WavyBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <span className="text-white/35 text-[11px] tracking-[0.3em] uppercase whitespace-nowrap"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
            Soluções digitais para empresas &nbsp;·&nbsp; 2026
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="leading-[1.1]" style={{ textTransform: "uppercase" }}
        >
          <span className="block text-white" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
            fontSize: "clamp(1.6rem,3.4vw,2.75rem)", letterSpacing: "-0.01em",
          }}>
            Construímos
          </span>
          <div
            className="w-full"
            style={{
              height: "clamp(70px, 12vw, 150px)",
              margin: "0.1em 0",
              filter: "drop-shadow(0 0 40px #e93e8f55)",
            }}
          >
            <TextPressure
              text="Experiências Digitais"
              flex={true}
              width={true}
              weight={true}
              italic={false}
              alpha={false}
              textColor="#e93e8f"
              minFontSize={40}
            />
          </div>
          <span className="block text-white" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
            fontSize: "clamp(1.6rem,3.4vw,2.75rem)", letterSpacing: "-0.01em",
          }}>
            que posicionam sua marca.
          </span>
        </motion.div>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/45 text-base leading-relaxed mt-8 mb-10 max-w-xl mx-auto"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Sites, landing pages e e-commerces sob medida para marcas que
          levam a sério a primeira impressão digital.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <button
            onClick={() => document.querySelector("#projetos")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-black text-sm tracking-wide
                       hover:scale-105 active:scale-95 transition-transform"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, background: "#c7d300" }}
          >
            Ver projetos <ArrowDownRight size={16} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => window.open("https://wa.me/5547996258977", "_blank")}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-white/70 text-sm tracking-wide
                       hover:border-white/30 hover:text-white transition-all"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
          >
            Falar com a equipe <ArrowDownRight size={16} strokeWidth={2.5} />
          </button>
        </motion.div>

        {/* ── Stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center gap-4"
        >
          {stats.map((s) => (
            <div key={s.label}
              className="flex items-center gap-4 px-7 py-5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${s.color}35`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.35), 0 0 32px ${s.color}18`,
              }}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: s.color, boxShadow: `0 0 10px ${s.color}` }} />
              <div className="text-left">
                <p className="leading-none mb-1.5"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "1.6rem", color: s.color }}>
                  {s.value}
                </p>
                <p className="text-white/50 text-[10px] tracking-widest uppercase"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
