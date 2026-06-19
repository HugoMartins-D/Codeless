import { motion } from "motion/react";
import { LogoMarkLarge } from "./Logo";

/* ── Floating stat card ───────────────────────────────────────────── */
function StatCard({
  label, value, sub, color, style, delay,
}: {
  label: string; value: string; sub: string;
  color: string; style?: React.CSSProperties; delay: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ repeat: Infinity, duration: 4 + delay, ease: "easeInOut", delay }}
      className="absolute bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 min-w-[140px]"
      style={style}
    >
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(circle at 0% 0%, ${color}18 0%, transparent 70%)` }} />

      {/* Eyebrow: dot + label */}
      <div className="flex items-center gap-1.5 mb-3">
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <p className="text-white/35 text-[9px] tracking-[0.2em] uppercase"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>{label}</p>
      </div>

      {/* Main value */}
      <p className="leading-none mb-1"
        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 22, color }}>
        {value}
      </p>

      {/* Sub — visually tied to value, not a footnote */}
      <p className="text-white/70 text-xs tracking-wide"
        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>{sub}</p>
    </motion.div>
  );
}

/* ── Hero visual ──────────────────────────────────────────────────── */
function HeroVisual() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 560, height: 580 }}>

      {/* ── Glow layers ── */}
      <div className="absolute rounded-full pointer-events-none"
        style={{ inset: "10%", background: "radial-gradient(circle, #5252A8 0%, transparent 65%)", filter: "blur(55px)", opacity: 0.55 }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ inset: "18%", background: "radial-gradient(circle at 35% 65%, #e93e8f 0%, transparent 60%)", filter: "blur(50px)", opacity: 0.3 }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ inset: "25%", background: "radial-gradient(circle at 65% 35%, #c7d300 0%, transparent 55%)", filter: "blur(60px)", opacity: 0.18 }} />

      {/* ── Rotating outer ring ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute rounded-full border border-dashed border-white/10"
        style={{ inset: "4%" }}
      >
        {[0, 90, 180, 270].map((deg) => (
          <div key={deg} className="absolute w-2 h-2 rounded-full bg-[#5252A8]/60"
            style={{ top: "50%", left: "50%", transform: `rotate(${deg}deg) translateX(260px) translateY(-50%)` }} />
        ))}
      </motion.div>

      {/* ── Rotating inner ring ── */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
        className="absolute rounded-full border border-[#e93e8f]/15"
        style={{ inset: "15%" }}
      >
        {[45, 135, 225, 315].map((deg) => (
          <div key={deg} className="absolute w-1.5 h-1.5 rounded-full bg-[#e93e8f]/50"
            style={{ top: "50%", left: "50%", transform: `rotate(${deg}deg) translateX(210px) translateY(-50%)` }} />
        ))}
      </motion.div>

      {/* ── Static ring ── */}
      <div className="absolute rounded-full border border-white/[0.04]" style={{ inset: "22%" }} />

      {/* ── Scanning line ── */}
      <motion.div
        animate={{ top: ["20%", "80%", "20%"] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute left-[15%] right-[15%] h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #5252A8, #e93e8f, transparent)", opacity: 0.4 }}
      />

      {/* ── Corner brackets ── */}
      {[
        { top: "8%", left: "8%", borderTop: "2px solid", borderLeft: "2px solid" },
        { top: "8%", right: "8%", borderTop: "2px solid", borderRight: "2px solid" },
        { bottom: "8%", left: "8%", borderBottom: "2px solid", borderLeft: "2px solid" },
        { bottom: "8%", right: "8%", borderBottom: "2px solid", borderRight: "2px solid" },
      ].map((s, i) => (
        <div key={i} className="absolute w-6 h-6 border-[#5252A8]/40" style={s as React.CSSProperties} />
      ))}

      {/* ── Central logo ── */}
      <div className="relative z-10 drop-shadow-2xl" style={{ width: 260, height: 305 }}>
        <div className="absolute inset-[-20%] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, #5252A830 0%, transparent 70%)", filter: "blur(20px)" }} />
        <LogoMarkLarge color="white" />
      </div>

      {/* ── Floating stat cards ── */}
      <StatCard label="Projetos" value="Com & Sem" sub="código"
        color="#c7d300" delay={0} style={{ top: "4%", right: "-4%" }} />
      <StatCard label="Satisfação" value="100%" sub="dos clientes"
        color="#e93e8f" delay={1.2} style={{ bottom: "12%", left: "-6%" }} />
      <StatCard label="Templates" value="Zero" sub="tudo autoral"
        color="#5252A8" delay={0.7} style={{ top: "42%", right: "-8%" }} />
    </div>
  );
}

/* ── Stats row ────────────────────────────────────────────────────── */
const stats = [
  { value: "Com & Sem", label: "Código" },
  { value: "100%", label: "Exclusivos" },
  { value: "0", label: "Templates" },
];

/* ── Section ──────────────────────────────────────────────────────── */
export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Global ambient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 70% 50%, #5252A80a 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* ── LEFT ── */}
          <div className="flex-1 lg:pr-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#5252A8]/40 bg-[#5252A8]/10 px-4 py-1.5 mb-8"
            >
              <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                className="w-1.5 h-1.5 rounded-full bg-[#5252A8]" />
              <span className="text-[#5252A8] text-xs tracking-widest uppercase"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>Agência Digital</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white leading-[1.15] mb-6"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2rem,3.5vw,3.5rem)" }}
            >
              Criação<br />
              de Sites<br />
              <span
                style={{
                  background: "linear-gradient(135deg, #7b7de8 0%, #5252A8 40%, #e93e8f 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 32px #5252A8aa)",
                  fontSize: "clamp(2.5rem,4vw,4rem)",
                }}
              >SOB MEDIDA</span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/45 text-base leading-relaxed mb-10 max-w-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Inovação que transforma sua presença digital, sem complicação. Cada projeto pensado do zero para a sua marca.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-14"
            >
              <button
                onClick={() => window.open("https://wa.me/5547996258977", "_blank")}
                className="relative overflow-hidden px-7 py-3.5 rounded-full text-black text-sm
                           hover:scale-105 active:scale-95 transition-transform"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, background: "#c7d300" }}
              >
                Quero meu site
              </button>
              <button
                onClick={() => document.querySelector("#projetos")?.scrollIntoView({ behavior: "smooth" })}
                className="px-7 py-3.5 rounded-full border border-white/12 text-white/60 text-sm
                           hover:border-white/30 hover:text-white transition-all"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                Ver projetos →
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-8 border-t border-white/8 pt-8"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-white text-2xl mb-0.5"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}>{s.value}</p>
                  <p className="text-white/30 text-[10px] tracking-widest uppercase"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT visual ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex flex-1 justify-end items-center"
          >
            <HeroVisual />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
