import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function ProofSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl px-10 py-14 flex flex-col items-center gap-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{
              background: "rgba(82,82,168,0.15)",
              border: "1px solid rgba(82,82,168,0.30)",
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1.5 h-1.5 rounded-full bg-[#5252A8]"
            />
            <span
              className="text-[#5252A8] text-xs tracking-widest uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}
            >
              Prova real
            </span>
          </div>

          {/* Headline */}
          <div>
            <h2
              className="text-white mb-4"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                lineHeight: 1.15,
              }}
            >
              O site que você está vendo agora
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #7b7de8 0%, #5252A8 40%, #e93e8f 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                foi criado 100% pela Code Less.
              </span>
            </h2>
            <p
              className="text-white/45 text-base max-w-xl mx-auto leading-relaxed"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Do zero ao ar. Sem templates, sem enrolação. Se você quer um site assim para o seu negócio, fale com a gente agora.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => window.open("https://wa.me/5547996258977", "_blank")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-black text-sm font-bold tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              background: "#c7d300",
              boxShadow: "0 8px 32px rgba(199,211,0,0.30)",
            }}
          >
            Quero um site assim <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
