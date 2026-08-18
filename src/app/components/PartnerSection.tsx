import { motion } from "motion/react";
import { Clock, MessageCircle, Wrench } from "lucide-react";

const items = [
  {
    icon: Clock,
    title: "7 dias de suporte pós-entrega",
    desc: "Após o go-live, nossa equipe permanece disponível para ajustes e correções.",
  },
  {
    icon: MessageCircle,
    title: "Canal direto no WhatsApp",
    desc: "Fale diretamente com quem criou seu projeto, sem tickets ou chamados.",
  },
  {
    icon: Wrench,
    title: "Correções em até 24h",
    desc: "Qualquer ajuste no período de suporte é atendido em até 24 horas úteis.",
  },
];

export function PartnerSection() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
            style={{ background: "rgba(233,62,143,0.10)", border: "1px solid rgba(233,62,143,0.22)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e93e8f]" />
            <span className="text-[#e93e8f] text-xs tracking-widest uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>Parceria, não fornecimento</span>
          </div>
          <h2 className="text-white leading-tight mb-6" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 800,
            fontSize: "clamp(2.2rem,4.5vw,3.5rem)",
          }}>
            Entregamos e <span style={{ color: "#e93e8f" }}>ficamos</span> ao seu lado.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto"
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            A maioria das agências desaparece depois da entrega. Nós acreditamos
            que o go-live é só o começo, e estamos lá para garantir que tudo funcione.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title}
                className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <Icon size={18} color="rgba(255,255,255,0.6)" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-white text-base mb-1.5"
                    style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>{item.title}</p>
                  <p className="text-white/40 text-sm leading-relaxed"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
