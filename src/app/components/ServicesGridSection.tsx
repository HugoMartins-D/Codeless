import { motion } from "motion/react";
import { Globe2, LayoutTemplate, ShoppingCart } from "lucide-react";

const services = [
  { icon: Globe2, title: "Sites Institucionais", desc: "Presença digital sólida para apresentar sua empresa com credibilidade.", color: "#5252A8" },
  { icon: LayoutTemplate, title: "Web design & desenvolvimento", desc: "Design autoral e código sob medida, do zero ao ar.", color: "#e93e8f" },
  { icon: ShoppingCart, title: "E-commerces", desc: "Lojas online pensadas para converter visitantes em clientes.", color: "#c7d300" },
];

export function ServicesGridSection() {
  return (
    <section id="servicos" className="py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{ background: "rgba(82,82,168,0.10)", border: "1px solid rgba(82,82,168,0.20)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#5252A8]" />
            <span className="text-[#5252A8] text-xs tracking-widest uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>O que fazemos</span>
          </div>
          <h2 className="text-white" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 900,
            fontSize: "clamp(2.2rem,4.5vw,3.5rem)", letterSpacing: "-0.02em",
          }}>
            Potência em <span style={{ color: "#c7d300" }}>design digital</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="relative overflow-hidden rounded-3xl p-8"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "0 4px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.10)",
                }}
              >
                <div className="absolute pointer-events-none" style={{
                  width: 220, height: 220, borderRadius: "50%", top: -80, right: -80,
                  background: s.color, filter: "blur(80px)", opacity: 0.12,
                }} />
                <div
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}
                >
                  <Icon size={22} color={s.color} />
                </div>
                <h3 className="relative text-white mb-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: "1.15rem" }}>
                  {s.title}
                </h3>
                <p className="relative text-white/45 text-sm leading-relaxed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
