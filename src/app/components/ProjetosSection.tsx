import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import ScrollFloat from "./ui/ScrollFloat";

interface ShowcaseProject {
  title: string;
  year: string;
  tags: string[];
  image: string;
  /** Caminho de um .mp4/.webm em /public. Se vazio, mostra a imagem. */
  video?: string;
  /** Site do projeto. Se vazio, "Ver projeto" abre o WhatsApp. */
  link?: string;
  glow: string;
}

const projects: ShowcaseProject[] = [
  {
    title: "HelpSmart",
    year: "2026",
    tags: ["Site institucional", "UI/UX", "Performance"],
    image: "/BANNERHELP.png",
    video: "/helpsmart.mp4",
    glow: "#c7d300",
  },
  {
    title: "Soarts Films",
    year: "2026",
    tags: ["Site institucional", "Portifolio", "Sistema Interno", "Automação"],
    image: "/BANNERSOARTS.png",
    video: "/soarts.mp4",
    link: "https://www.soartsfilms.com.br/",
    glow: "#e93e8f",
  },
  {
    title: "Dra. Helena Cristina Martins",
    year: "2026",
    tags: ["Landing Page", "Em breve"],
    image: "",
    glow: "#4fd1c5",
  },
];

/* ── Diagonal stripe texture — brand-colored glow bleeding into the dark ── */
function StripedBackdrop({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(115deg, ${color}22 0px, ${color}22 1px, transparent 1px, transparent 7px)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse 60% 90% at 0% 30%, ${color}30 0%, transparent 60%)` }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 45%, #050505 90%)" }} />
    </div>
  );
}

/* ── Full-bleed media — fills the whole card, cropping is fine ── */
function CardMedia({ project }: { project: ShowcaseProject }) {
  if (project.video) {
    return (
      <video
        src={project.video}
        poster={project.image}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  if (project.image) {
    return <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <StripedBackdrop color={project.glow} />
      <p className="relative z-10 text-white/25 text-sm tracking-[0.3em] uppercase"
        style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
        {project.title} em breve
      </p>
    </div>
  );
}

/* ── Wide banner card — media fills the card edge-to-edge, text overlaid bottom-left ── */
function FeaturedCard({ project, delay }: { project: ShowcaseProject; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group relative overflow-hidden rounded-3xl"
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        minHeight: 540,
      }}
    >
      <CardMedia project={project} />
      <div className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.92) 100%)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(90deg, ${project.glow}20 0%, transparent 45%)` }} />

      <div className="relative z-10 p-6 pt-40 md:p-10 md:pt-0 h-full flex flex-col justify-end" style={{ minHeight: 540 }}>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((t) => (
            <span key={t}
              className="px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase text-white/70"
              style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
              {t}
            </span>
          ))}
        </div>
        <p className="text-white/40 text-xs tracking-widest mb-1">{project.year}</p>
        <div className="flex items-center gap-6">
          <p className="text-white text-2xl" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}>
            {project.title}
          </p>
          <button
            onClick={() => window.open(project.link || "https://wa.me/5547996258977", "_blank")}
            className="inline-flex items-center gap-1.5 text-white/50 text-xs group-hover:text-[#c7d300] transition-colors"
          >
            Ver projeto <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Same card shape as FeaturedCard, but as an open invitation slot ── */
function PlaceholderCard({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group relative overflow-hidden rounded-3xl cursor-pointer"
      style={{
        background: "#050505",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        minHeight: 540,
      }}
      onClick={() => window.open("https://wa.me/5547996258977", "_blank")}
    >
      <StripedBackdrop color="#ffffff" />

      <div className="absolute inset-6 md:inset-8 flex items-center justify-center">
        <div
          className="w-full h-full rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:border-[#c7d300]/40"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1.5px dashed rgba(255,255,255,0.15)",
          }}
        >
          <span
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-[#c7d300]/15 group-hover:border-[#c7d300]/40"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <span className="text-white/40 text-2xl font-light group-hover:text-[#c7d300]/80 transition-colors duration-300">+</span>
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 100%)" }} />
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10" style={{ minHeight: 540 }}>
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase text-white/40"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
            O seu projeto aqui
          </span>
        </div>
        <p className="text-white/30 text-xs tracking-widest mb-1">EM BREVE</p>
        <div className="flex items-center gap-6">
          <p className="text-white/60 text-2xl" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}>
            Próximo projeto
          </p>
          <span className="inline-flex items-center gap-1.5 text-white/25 text-xs group-hover:text-[#c7d300] transition-colors">
            Fale com a gente <ArrowRight size={14} strokeWidth={2.5} />
          </span>
        </div>
      </div>
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
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{
              background: "rgba(233,62,143,0.10)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(233,62,143,0.20)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e93e8f]" />
            <span className="text-[#e93e8f] text-xs tracking-widest uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>Nosso portfólio</span>
          </motion.div>
          <ScrollFloat
            containerClassName="text-center"
            textClassName="text-white"
            textStyle={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(3rem,8vw,6rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            PROJETOS
          </ScrollFloat>
        </div>

        {/* Featured — large cards, each with a video/screenshot slot */}
        <div className="flex flex-col gap-6">
          {projects.map((p, i) => (
            <FeaturedCard key={p.title} project={p} delay={i * 0.1} />
          ))}
          <PlaceholderCard delay={projects.length * 0.1} />
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
