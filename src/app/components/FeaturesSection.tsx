import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const items = [
  {
    num: "01",
    color: "#c7d300",
    title: "Com ou Sem Código",
    desc: "Você escolhe o tipo de desenvolvimento. Flexibilidade total, do no-code ao código puro.",
    tags: ["No-code", "React", "Next.js"],
  },
  {
    num: "02",
    color: "#5252A8",
    title: "Layouts Autorais",
    desc: "Focados na sua identidade visual. Nenhum template pronto: cada pixel pensado para a sua marca.",
    tags: ["UI/UX", "Branding", "Design"],
  },
  {
    num: "03",
    color: "#e93e8f",
    title: "Controle Total",
    desc: "Facilidade de alteração em qualquer etapa. Você tem propriedade completa do projeto.",
    tags: ["CMS", "Autonomia", "Edição fácil"],
  },
  {
    num: "04",
    color: "#c7d300",
    title: "Suporte Contínuo",
    desc: "Acompanhamos sua empresa durante e pós-entrega. Não desaparecemos depois do deploy.",
    tags: ["Suporte", "Manutenção", "Crescimento"],
  },
];

function GlassCard({ item, i }: { item: typeof items[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: i * 0.09 }}
      className="group relative rounded-3xl overflow-hidden cursor-default"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: `0 4px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      {/* Colored orb that bleeds through the glass */}
      <div
        className="absolute pointer-events-none transition-all duration-500 group-hover:opacity-100"
        style={{
          width: 240,
          height: 240,
          borderRadius: "50%",
          background: item.color,
          filter: "blur(80px)",
          opacity: 0.07,
          top: -60,
          right: -60,
        }}
      />
      <div
        className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: item.color,
          filter: "blur(60px)",
          opacity: 0.12,
          bottom: -40,
          left: -40,
        }}
      />

      {/* Specular highlight — top edge shimmer */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.25) 30%, ${item.color}88 55%, rgba(255,255,255,0.1) 80%, transparent 95%)`,
        }}
      />

      {/* Inner glass sheen — diagonal light streak */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] group-hover:opacity-[0.055] transition-opacity duration-500"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 50%)",
          borderRadius: "inherit",
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Top row */}
        <div className="flex items-start justify-between mb-8">
          <span
            className="text-5xl leading-none select-none"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              color: "rgba(255,255,255,0.07)",
              letterSpacing: "-0.04em",
            }}
          >
            {item.num}
          </span>

          {/* Glass dot badge */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), 0 0 12px ${item.color}44`,
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}` }} />
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-white mb-3"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.01em" }}
        >
          {item.title}
        </h3>

        {/* Desc */}
        <p
          className="text-white/45 text-sm leading-relaxed mb-7"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {item.desc}
        </p>

        {/* Tags — glass pills */}
        <div className="flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <span
              key={t}
              className="px-3 py-1 text-xs text-white/50 rounded-full"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom edge highlight */}
      <div
        className="absolute bottom-0 left-8 right-8 h-px pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${item.color}50, transparent)` }}
      />
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section id="diferenciais" className="py-32 relative overflow-hidden">
      {/* Background orbs for glass refraction context */}
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #5252A814 0%, transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #e93e8f14 0%, transparent 70%)", filter: "blur(40px)" }} />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e93e8f]/25 bg-[#e93e8f]/08 px-4 py-1.5 mb-6"
              style={{ backdropFilter: "blur(12px)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#e93e8f]" />
              <span className="text-[#e93e8f] text-xs tracking-widest uppercase"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>Nossos diferenciais</span>
            </span>
            <h2 className="text-white leading-tight"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2.2rem,4.5vw,3.5rem)" }}>
              O que nos torna<br />
              <span style={{ color: "#5252A8" }}>diferentes</span>.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
            className="flex-1 flex flex-col justify-end"
          >
            <p className="text-white/40 text-sm leading-relaxed mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Criamos <span className="text-white/70 font-semibold">sites exclusivos</span> e oferecemos{" "}
              <span style={{ color: "#c7d300" }} className="font-semibold">suporte</span> antes, durante e depois da entrega.
            </p>
            <p className="text-white/40 text-sm leading-relaxed mb-8"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>
              O projeto não termina quando o site vai ao ar. Continuamos ao seu lado para apoiar,
              ajustar e evoluir o que foi construído.
            </p>
            <button
              onClick={() => window.open("https://wa.me/5547996258977", "_blank")}
              className="self-start inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-black text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 4px 24px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              Seja atendido <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </motion.div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <GlassCard key={item.num} item={item} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
