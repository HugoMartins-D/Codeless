import { motion } from "motion/react";

const solutions = [
  { n: "01", t: "Sites Institucionais", d: "Para empresas que precisam de credibilidade e presença digital sólida." },
  { n: "02", t: "Landing Pages", d: "Focadas em conversão, feitas para uma campanha ou um objetivo específico." },
  { n: "03", t: "E-commerce", d: "Loja online completa, do catálogo ao checkout, pronta para vender." },
];

export function SolutionsSection() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-white leading-tight" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 900,
            fontSize: "clamp(2.2rem,4.5vw,3.5rem)", letterSpacing: "-0.02em",
          }}>
            Três soluções. <span style={{ color: "#e93e8f" }}>Um único objetivo:</span> resultado.
          </h2>
        </motion.div>

        <div className="flex flex-col">
          {solutions.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col md:flex-row md:items-center gap-3 md:gap-10 py-8"
              style={{ borderBottom: i < solutions.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
            >
              <span className="text-white/15 shrink-0" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: "2.5rem" }}>
                {s.n}
              </span>
              <h3 className="text-white shrink-0 md:w-64" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1.4rem" }}>
                {s.t}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {s.d}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
