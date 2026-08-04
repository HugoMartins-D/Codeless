import { motion } from "motion/react";

const stats = [
  { value: "100%", label: "Exclusivos", color: "#c7d300" },
  { value: "0", label: "Templates", color: "#e93e8f" },
  { value: "24/7", label: "Suporte", color: "#5252A8" },
];

export function VendorSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-white leading-tight mb-14"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,3.25rem)" }}
        >
          Seu site é o seu <span style={{ color: "#e93e8f" }}>vendedor</span> mais importante.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {stats.map((s) => (
            <div key={s.label}
              className="flex items-center gap-4 px-7 py-5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${s.color}35`,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.10), 0 0 32px ${s.color}18`,
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
