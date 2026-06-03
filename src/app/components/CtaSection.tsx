import { motion } from "motion/react";
import svgPaths from "../../imports/Home/svg-rk6ni7pcck";

export function CtaSection() {
  return (
    <section id="contato" className="bg-black py-32 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at 80% 20%, #e93e8f12 0%, transparent 65%)", filter: "blur(40px)" }} />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at 20% 80%, #c7d30010 0%, transparent 65%)", filter: "blur(40px)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, #5252A80a 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Main CTA card — liquid glass */}
        <motion.div
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl p-12 md:p-20 mb-6"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 8px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Top specular — tricolor */}
          <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent 5%, #5252A8 25%, #e93e8f 50%, #c7d300 75%, transparent 95%)" }} />

          {/* Inner sheen */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, transparent 50%)", borderRadius: "inherit" }} />

          {/* Ghost logo */}
          <div className="absolute right-[-60px] bottom-[-80px] opacity-[0.03] pointer-events-none" style={{ width: 480, height: 560 }}>
            <svg className="w-full h-full" fill="none" viewBox="0 0 862 1011.6">
              <path d={svgPaths.p38c6900}  fill="white" />
              <path d={svgPaths.p36d8de80} fill="white" />
              <path d={svgPaths.p2722bc00} fill="white" />
            </svg>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
            style={{
              background: "rgba(199,211,0,0.08)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(199,211,0,0.22)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}>
            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}
              className="w-1.5 h-1.5 rounded-full bg-[#c7d300]" />
            <span className="text-[#c7d300] text-xs tracking-widest uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>
              Disponível para novos projetos
            </span>
          </div>

          <h2 className="text-white mb-6 max-w-2xl"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "clamp(2.5rem,5vw,4.5rem)", lineHeight: 1.05 }}>
            Pronto para transformar sua{" "}
            <span style={{
              background: "linear-gradient(135deg, #e8e840 0%, #c7d300 60%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", filter: "drop-shadow(0 0 20px #c7d30066)",
            }}>presença digital?</span>
          </h2>

          <p className="text-white/40 text-base max-w-lg mb-12 leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Entre em contato e descubra como a CODE LESS cria o site ideal para o seu negócio. Sem templates, sem complicação.
          </p>

          <div className="flex flex-wrap gap-4">
            {/* Primary — solid glass */}
            <button
              className="px-8 py-4 rounded-full text-black text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
                background: "rgba(199,211,0,0.90)",
                backdropFilter: "blur(12px)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55), 0 8px 32px rgba(199,211,0,0.22)",
              }}>
              Quero meu site agora
            </button>
            {/* Secondary — transparent glass */}
            <button
              onClick={() => document.querySelector("#projetos")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 rounded-full text-white/60 text-sm transition-all hover:scale-105 hover:text-white"
              style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
              }}>
              Ver projetos →
            </button>
          </div>
        </motion.div>

        {/* Footer strip */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-between gap-5 border-t border-white/6 pt-8"
        >
          <div className="flex items-center gap-3">
            <div style={{ width: 22, height: 26 }}>
              <svg className="w-full h-full" fill="none" viewBox="0 0 38.071 44.6781">
                <path d={svgPaths.p11087c80} fill="rgba(255,255,255,0.4)" />
                <path d={svgPaths.p13dda600} fill="rgba(255,255,255,0.4)" />
                <path d={svgPaths.p3efdf4f0} fill="rgba(255,255,255,0.4)" />
              </svg>
            </div>
            <span className="text-white/25 text-xs tracking-widest"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>CODE LESS © 2024</span>
          </div>

          {["Instagram"].map((s) => (
            <a key={s} href="#"
              className="text-white/25 hover:text-[#e93e8f] text-sm tracking-wider transition-colors duration-200"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>{s}</a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
