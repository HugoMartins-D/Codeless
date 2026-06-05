import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { LogoMarkLarge } from "./Logo";

/* Brand palette */
const P  = "#5252A8"; /* purple  */
const PK = "#e93e8f"; /* pink    */
const LM = "#c7d300"; /* lime    */

/* ── Floating stat card ─────────────────────────────────────────────── */
function StatCard({
  label, value, sub, color, style, delay,
}: {
  label: string; value: string; sub: string;
  color: string; style?: React.CSSProperties; delay: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 4 + delay, ease: "easeInOut", delay }}
      className="absolute bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 min-w-[140px]"
      style={style}
    >
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(circle at 0% 0%, ${color}18 0%, transparent 70%)` }} />
      <div className="flex items-center gap-1.5 mb-3">
        <motion.div
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 + delay * 0.4 }}
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: color }}
        />
        <p className="text-white/35 text-[9px] tracking-[0.2em] uppercase"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>{label}</p>
      </div>
      <p className="leading-none mb-1"
        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: 22, color }}>
        {value}
      </p>
      <p className="text-white/70 text-xs tracking-wide"
        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>{sub}</p>
    </motion.div>
  );
}

/* ── Cinematic visual ───────────────────────────────────────────────── */
function CinematicVisual() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
  }, []);

  const handleMouseLeave = useCallback(() => setMouse({ x: 0.5, y: 0.5 }), []);

  const px = (mouse.x - 0.5) * 22;
  const py = (mouse.y - 0.5) * 14;

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: 560, height: 580 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Glow layers — parallax no hover ── */}
      <motion.div
        animate={{ x: px, y: py }}
        transition={{ type: "spring", stiffness: 75, damping: 20 }}
        className="absolute rounded-full pointer-events-none"
        style={{ inset: "10%", background: `radial-gradient(circle, ${P} 0%, transparent 65%)`, filter: "blur(55px)", opacity: 0.55 }}
      />
      <motion.div
        animate={{ x: -px * 0.6, y: -py * 0.6 }}
        transition={{ type: "spring", stiffness: 75, damping: 20 }}
        className="absolute rounded-full pointer-events-none"
        style={{ inset: "18%", background: `radial-gradient(circle at 35% 65%, ${PK} 0%, transparent 60%)`, filter: "blur(50px)", opacity: 0.28 }}
      />
      <div className="absolute rounded-full pointer-events-none"
        style={{ inset: "25%", background: `radial-gradient(circle at 65% 35%, ${LM} 0%, transparent 55%)`, filter: "blur(60px)", opacity: 0.16 }} />

      {/* ── Rotating outer ring ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="absolute rounded-full border border-dashed border-white/10"
        style={{ inset: "4%" }}
      >
        {[0, 90, 180, 270].map((deg) => (
          <div key={deg} className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: `${P}99`, top: "50%", left: "50%", transform: `rotate(${deg}deg) translateX(260px) translateY(-50%)` }} />
        ))}
      </motion.div>

      {/* ── Rotating inner ring ── */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
        className="absolute rounded-full"
        style={{ inset: "15%", border: `1px solid ${PK}20` }}
      >
        {[45, 135, 225, 315].map((deg) => (
          <div key={deg} className="absolute w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: `${PK}80`, top: "50%", left: "50%", transform: `rotate(${deg}deg) translateX(210px) translateY(-50%)` }} />
        ))}
      </motion.div>

      {/* ── Static ring ── */}
      <div className="absolute rounded-full border border-white/[0.04]" style={{ inset: "22%" }} />

      {/* ── VERTICAL SLATS — sobrepostos aos glows ── */}
      <div className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
        style={{ inset: "4%" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent 0px,
              transparent 11px,
              rgba(0,0,0,0.38) 11px,
              rgba(0,0,0,0.38) 13px
            )`,
            borderRadius: "50%",
          }}
        />
      </div>

      {/* ── Interface grid ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${P}0a 1px, transparent 1px),
            linear-gradient(90deg, ${P}0a 1px, transparent 1px)
          `,
          backgroundSize: "34px 34px",
        }}
      />

      {/* ── Scanning line ── */}
      <motion.div
        animate={{ top: ["20%", "80%", "20%"] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute left-[15%] right-[15%] h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${P}, ${PK}, transparent)`, opacity: 0.4 }}
      />

      {/* ── Corner brackets ── */}
      {([
        { top: "8%", left: "8%", borderTop: `2px solid ${P}55`, borderLeft: `2px solid ${P}55` },
        { top: "8%", right: "8%", borderTop: `2px solid ${P}55`, borderRight: `2px solid ${P}55` },
        { bottom: "8%", left: "8%", borderBottom: `2px solid ${P}55`, borderLeft: `2px solid ${P}55` },
        { bottom: "8%", right: "8%", borderBottom: `2px solid ${P}55`, borderRight: `2px solid ${P}55` },
      ] as React.CSSProperties[]).map((s, i) => (
        <div key={i} className="absolute w-6 h-6" style={s} />
      ))}

      {/* ── Central logo ── */}
      <div className="relative z-10 drop-shadow-2xl" style={{ width: 260, height: 305 }}>
        <div className="absolute inset-[-20%] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${P}35 0%, transparent 70%)`, filter: "blur(20px)" }} />
        <LogoMarkLarge color="white" />
      </div>

      {/* ── Floating stat cards ── */}
      <StatCard label="Projetos" value="Com & Sem" sub="código"
        color={LM} delay={0} style={{ top: "4%", right: "-4%" }} />
      <StatCard label="Satisfação" value="100%" sub="dos clientes"
        color={PK} delay={1.2} style={{ bottom: "12%", left: "-6%" }} />
      <StatCard label="Templates" value="Zero" sub="tudo autoral"
        color={P} delay={0.7} style={{ top: "42%", right: "-8%" }} />
    </div>
  );
}

/* ── Stats row ──────────────────────────────────────────────────────── */
const stats = [
  { value: "Com & Sem", label: "Código" },
  { value: "100%", label: "Exclusivos" },
  { value: "0", label: "Templates" },
];

/* ── Section ────────────────────────────────────────────────────────── */
export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Ambient purple leak — lado direito */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 65% 55% at 78% 50%, ${P}0a 0%, transparent 70%)` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* ── LEFT ── */}
          <div className="flex-1 lg:pr-8 max-w-xl">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8"
              style={{ borderColor: `${P}40`, background: `${P}10` }}
            >
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: P }}
              />
              <span style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                fontSize: 11, color: P, letterSpacing: "0.14em", textTransform: "uppercase",
              }}>
                Agência Digital
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-white leading-[1.1] mb-6"
              style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 900,
                fontSize: "clamp(2rem,3.2vw,3.5rem)", letterSpacing: "-0.025em",
              }}
            >
              Construímos<br />
              experiências digitais<br />
              <span style={{
                background: `linear-gradient(135deg, #7b7de8 0%, ${P} 35%, ${PK} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: `drop-shadow(0 0 28px ${P}aa)`,
              }}>
                que posicionam<br />sua marca.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="leading-relaxed mb-10 max-w-[360px]"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: "rgba(255,255,255,0.40)",
                fontSize: "clamp(0.85rem,1.05vw,0.95rem)",
              }}
            >
              Sites institucionais, landing pages e sistemas personalizados
              desenvolvidos com ou sem código, focados em performance, conversão
              e crescimento.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-wrap gap-3 mb-14"
            >
              <button
                onClick={() => window.open("https://wa.me/5547996258977", "_blank")}
                className="px-7 py-3.5 rounded-full text-black text-sm hover:scale-105 active:scale-95 transition-transform"
                style={{
                  fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
                  background: LM,
                  boxShadow: `0 0 30px ${LM}35, 0 4px 20px rgba(0,0,0,0.4)`,
                }}
              >
                Quero meu site
              </button>
              <button
                onClick={() =>
                  document.querySelector("#projetos")?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-7 py-3.5 rounded-full border border-white/12 text-white/55 text-sm hover:border-white/30 hover:text-white transition-all"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 500 }}
              >
                Ver projetos →
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex gap-8 pt-8"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-white text-2xl mb-0.5"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}>
                    {s.value}
                  </p>
                  <p className="text-[10px] tracking-widest uppercase"
                    style={{ fontFamily: "'Montserrat', sans-serif", color: "rgba(255,255,255,0.25)" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT visual ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:flex flex-1 justify-end items-center"
          >
            <CinematicVisual />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
