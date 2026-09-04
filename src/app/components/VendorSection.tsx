import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function VendorSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-white leading-tight mb-10"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,3.25rem)" }}
        >
          Seu site é o seu <span style={{ color: "#e93e8f" }}>vendedor</span> mais importante.
        </motion.h2>

        <motion.button
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
          onClick={() => window.open("https://wa.me/5547996258977", "_blank")}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-black text-sm font-bold tracking-widest uppercase transition-all hover:scale-105 active:scale-95"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            background: "#c7d300",
            boxShadow: "0 8px 32px rgba(199,211,0,0.30)",
          }}
        >
          Falar com a gente <ArrowRight size={16} strokeWidth={2.5} />
        </motion.button>
      </div>
    </section>
  );
}
