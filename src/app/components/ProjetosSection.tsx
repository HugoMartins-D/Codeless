import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { GlowCard } from "./ui/spotlight-card";

const glowHex: Record<string, string> = {
  purple: "#5252A8",
  blue:   "#4A90D9",
  red:    "#FF2D55",
  green:  "#c7d300",
  orange: "#FF7A00",
};

interface BannerCardProps {
  image: string;
  alt: string;
  caption: string;
  delay: number;
  glowColor: keyof typeof glowHex;
}

function BannerCard({ image, alt, caption, delay, glowColor }: BannerCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [intensity, setIntensity] = useState(0);
  const color = glowHex[glowColor];

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const maxD = Math.hypot(r.width, r.height) * 0.75;
      setIntensity(Math.max(0, 1 - dist / maxD));
    };
    document.addEventListener("pointermove", onMove);
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  const glow = intensity;
  const borderAlpha = Math.round((0.15 + glow * 0.7) * 255).toString(16).padStart(2, "0");
  const shadowBlur  = 12 + glow * 28;
  const shadowSpread = glow * 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center gap-4"
    >
      <div
        ref={ref}
        style={{
          width: 240,
          height: 390,
          borderRadius: 120,
          border: `1.5px solid ${color}${borderAlpha}`,
          boxShadow: `0 0 ${shadowBlur}px ${shadowSpread}px ${color}${Math.round(glow * 180).toString(16).padStart(2, "0")}`,
          transition: "box-shadow 0.12s ease, border-color 0.12s ease",
          overflow: "hidden",
        }}
      >
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>
      <p className="text-white/40 text-xs tracking-[0.2em] uppercase"
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
      className="flex flex-col items-center cursor-pointer group"
      onClick={() => window.open("https://wa.me/5547996258977", "_blank")}
    >
      <GlowCard
        glowColor="green"
        width={240}
        height={390}
        borderRadius={120}
      >
        <div className="flex items-center justify-center w-full h-full">
          <span
            className="text-white/30 text-[10px] tracking-[0.15em] uppercase font-bold text-center px-6 group-hover:text-[#c7d300]/70 transition-colors duration-300"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            O SEU PODE SER O PRÓXIMO
          </span>
        </div>
      </GlowCard>

      <div
        className="relative -mt-[46px] z-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#c7d300]/20"
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
        <span className="text-white/25 text-3xl font-light group-hover:text-[#c7d300]/60 transition-colors duration-300">+</span>
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
    <section id="projetos" className="py-28 relative overflow-hidden">
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
        <div className="flex flex-wrap justify-center gap-12 md:gap-20 items-end">
          <BannerCard image="/BANNERHELP.png" alt="HelpSmart" caption="HelpSmart" delay={0.1} glowColor="purple" />
          <BannerCard image="/BANNERPOINTERSPORT.png" alt="Pointer Sports" caption="Pointer Sports" delay={0.2} glowColor="blue" />
          <BannerCard image="/BANNERSOARTS.png" alt="This Is Soarts Films" caption="Soarts Films" delay={0.3} glowColor="red" />
          <PlaceholderPill delay={0.4} />
        </div>

        {/* CTA — glass button */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <button
            onClick={() => window.open("https://wa.me/5547996258977", "_blank")}
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
