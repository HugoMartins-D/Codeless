import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqs = [
  {
    q: "Quanto tempo leva para o site ficar pronto?",
    a: "O prazo varia conforme o escopo do projeto. Definimos um cronograma claro logo no briefing, para você acompanhar cada etapa até a entrega.",
  },
  {
    q: "Preciso saber programar para gerenciar o site depois?",
    a: "Não. O projeto é entregue com um fluxo de edição pensado para você, e explicamos tudo durante o processo de entrega.",
  },
  {
    q: "Vocês fazem manutenção depois que o site vai ao ar?",
    a: "Sim. Continuamos acompanhando o projeto após o lançamento, ajustando o que for necessário conforme sua empresa cresce.",
  },
  {
    q: "O site é feito do zero ou usa templates prontos?",
    a: "Cada projeto é desenhado do zero, pensado para a identidade da sua marca — sem templates genéricos.",
  },
  {
    q: "Como funciona o primeiro contato?",
    a: "Você fala com a gente pelo WhatsApp, entendemos sua necessidade e alinhamos escopo e prazo antes de começar.",
  },
];

export function FaqSection() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-white leading-tight" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 900,
            fontSize: "clamp(2.2rem,4.5vw,3.5rem)",
          }}>
            Perguntas que <span style={{ color: "#5252A8" }}>todo mundo</span> faz.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl px-6 md:px-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Accordion type="single" collapsible>
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-white/8">
                <AccordionTrigger className="text-white text-sm md:text-base hover:no-underline"
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/45 text-sm leading-relaxed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
