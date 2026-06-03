import { motion } from "motion/react";
import svgPaths from "../../imports/Projetos/svg-ahqjqlyip3";
import imgIPhone from "../../imports/Projetos/c3bc4f628aa6440f3a17b8acf698d3bc722160d7.png";
import imgPointer from "../../imports/Projetos/a23646f847943e49b732804bf5832658ef125d53.png";

function HelpSmartIcon() {
  return (
    <svg viewBox="0 0 31.0866 19.5402" fill="none" className="w-8 h-8">
      <path d={svgPaths.p1212c300} fill="black" />
      <path d={svgPaths.p2aeef00}  fill="black" />
      <path d={svgPaths.p38109700} fill="black" />
      <path d={svgPaths.pd653700}  fill="black" />
      <path d={svgPaths.p23c4e300} fill="black" />
      <path d={svgPaths.p7b1bdc0}  fill="black" />
      <path d={svgPaths.p39356f30} fill="black" />
      <path d={svgPaths.pf14a000}  fill="black" />
      <path d={svgPaths.p2beb8280} fill="black" />
    </svg>
  );
}

function PointerIcon() {
  return (
    <svg viewBox="0 0 26.9092 36.5772" fill="none" className="w-6 h-8">
      <path d={svgPaths.p1123ac80} fill="black" />
      <path d={svgPaths.p2180a600} fill="black" />
    </svg>
  );
}

interface PillCardProps {
  accentColor: string;
  topLabel: React.ReactNode;
  image: string;
  imageAlt: string;
  badgeIcon: React.ReactNode;
  caption: string;
  delay: number;
}

function PillCard({ accentColor, topLabel, image, imageAlt, badgeIcon, caption, delay }: PillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center"
    >
      {/* Pill — glass overlay on coloured bg */}
      <div
        className="relative overflow-hidden flex flex-col"
        style={{
          width: 240,
          height: 390,
          borderRadius: 120,
          backgroundColor: accentColor,
          boxShadow: `0 24px 60px ${accentColor}55, 0 4px 16px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Top specular sheen */}
        <div
          className="absolute top-0 left-0 right-0 h-1/2 pointer-events-none z-10"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)",
            borderRadius: "120px 120px 0 0",
          }}
        />
        {/* Edge highlight */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            borderRadius: 120,
            border: "1px solid rgba(255,255,255,0.30)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.15)",
          }}
        />

        {/* Top label */}
        <div className="relative z-20 flex items-center justify-center pt-7 pb-3 px-4 shrink-0">
          {topLabel}
        </div>

        {/* Image */}
        <div className="flex-1 relative overflow-hidden z-0">
          <img src={image} alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover object-top" />
        </div>
      </div>

      {/* Badge — liquid glass circle */}
      <div
        className="relative -mt-[46px] z-10 rounded-full flex items-center justify-center"
        style={{
          width: 92,
          height: 92,
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.60)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.70)",
        }}
      >
        {badgeIcon}
      </div>

      {/* Caption */}
      <p className="mt-4 text-white/40 text-xs tracking-[0.2em] uppercase"
        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
        {caption}
      </p>
    </motion.div>
  );
}

function PlaceholderPill({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center"
    >
      <div
        className="flex items-center justify-center"
        style={{
          width: 240,
          height: 390,
          borderRadius: 120,
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <span className="text-white/20 text-xs tracking-[0.2em] uppercase rotate-90 select-none"
          style={{ fontFamily: "'Montserrat', sans-serif" }}>Em breve</span>
      </div>
      <div
        className="relative -mt-[46px] z-10 rounded-full flex items-center justify-center"
        style={{
          width: 92,
          height: 92,
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <span className="text-white/25 text-3xl font-light">+</span>
      </div>
      <p className="mt-4 text-white/20 text-xs tracking-[0.2em] uppercase"
        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
        Próximo projeto
      </p>
    </motion.div>
  );
}

export function ProjetosSection() {
  return (
    <section id="projetos" className="bg-black py-28 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #F5C40018 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #B5D40015 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{
              background: "rgba(233,62,143,0.10)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(233,62,143,0.20)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e93e8f]" />
            <span className="text-[#e93e8f] text-xs tracking-widest uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>Nosso portfólio</span>
          </div>
          <h2 className="text-white"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(3rem,8vw,6rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}>
            PROJETOS
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
          <PillCard accentColor="#F5C400"
            topLabel={<span className="text-black text-sm tracking-widest uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>HELP SMART</span>}
            image={imgIPhone} imageAlt="HelpSmart – aplicativo no iPhone"
            badgeIcon={<HelpSmartIcon />} caption="HelpSmart" delay={0.1} />

          <PillCard accentColor="#B5D400"
            topLabel={<span className="text-black text-sm tracking-widest uppercase text-center"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>POINTER SPORTS</span>}
            image={imgPointer} imageAlt="Pointer Sports"
            badgeIcon={<PointerIcon />} caption="Pointer Sports" delay={0.2} />

          <PlaceholderPill delay={0.3} />
        </div>

        {/* CTA — glass button */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <button
            onClick={() => document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" })}
            className="px-10 py-4 rounded-full text-white text-sm tracking-widest transition-all hover:scale-105 active:scale-95"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              background: "rgba(199,211,0,0.10)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(199,211,0,0.30)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 24px rgba(199,211,0,0.08)",
              color: "#c7d300",
            }}
          >
            QUERO UM SITE PARA MINHA EMPRESA
          </button>
        </motion.div>
      </div>
    </section>
  );
}
