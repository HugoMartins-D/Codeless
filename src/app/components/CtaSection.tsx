import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { LogoMarkGhost } from "./Logo";

export function CtaSection() {
  return (
    <section id="contato" className="py-32 relative overflow-hidden">
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
            <LogoMarkGhost color="white" />
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
              onClick={() => window.open("https://wa.me/5547996258977", "_blank")}
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
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white/60 text-sm transition-all hover:scale-105 hover:text-white"
              style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
              }}>
              Ver projetos <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </motion.div>

        {/* Footer strip */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-between gap-5 border-t border-white/6 pt-8"
        >
          <div className="flex items-center gap-3" style={{ opacity: 0.3 }}>
            <svg width="19" height="22" viewBox="0 0 38.071 44.6781" fill="none">
              <path d="M32.9298 40.5628C32.3374 40.5628 31.7431 40.4567 31.174 40.2426L9.71228 32.1694C7.67099 31.4014 6.35221 29.4057 6.43378 27.2037L7.25729 4.9052C7.3175 3.2552 8.17014 1.73288 9.53748 0.829312C10.9048 -0.0742576 12.6256 -0.251043 14.1445 0.35592L34.8837 8.64126C36.8298 9.41912 38.0806 11.2891 38.0709 13.4046L37.968 35.491C37.9602 37.1548 37.1484 38.7125 35.7946 39.6573C34.942 40.2544 33.9378 40.5608 32.9279 40.5608L32.9298 40.5628ZM12.2896 4.11556C12.0546 4.11556 11.8721 4.20788 11.7652 4.27859C11.6099 4.3827 11.3438 4.62038 11.3282 5.06038L10.5047 27.3589C10.4892 27.7812 10.7417 28.1643 11.134 28.3116L32.5958 36.3848C33.0056 36.54 33.328 36.3809 33.4814 36.2728C33.6368 36.1648 33.8951 35.9173 33.899 35.4734L34.0019 13.387C34.0019 12.9804 33.763 12.6229 33.3901 12.4736L12.6509 4.18823C12.5227 4.13716 12.4023 4.11752 12.2916 4.11752L12.2896 4.11556Z" fill="white" fillRule="evenodd"/>
              <path d="M0.00302353 30.9987C0.191421 25.5793 0.447797 20.1107 0.655616 14.6755C0.727479 12.7761 0.694461 10.7548 0.84984 8.87501C1.09456 5.93252 3.59617 3.79341 6.5173 4.14698L6.32113 8.3309C5.69379 8.02644 4.98293 8.4409 4.92078 9.13822C4.82949 10.1596 4.86445 11.2714 4.82366 12.3027C4.58671 18.4725 4.30703 24.6443 4.14 30.818C4.12446 31.3719 3.96325 31.9121 4.49931 32.2971C11.7808 35.0942 19.0972 37.8285 26.4078 40.549C26.9205 40.606 27.4022 40.2446 27.4799 39.728L31.308 41.1639C30.4962 43.8196 27.5382 45.3144 24.9278 44.4167L3.02126 36.1667C1.5976 35.5244 0.504121 34.2162 0.15646 32.6723C0.0981933 32.411 0.0865399 32.1419 0.00302353 31.8885C0.0107925 31.5939 -0.00668767 31.2934 0.00302353 30.9987Z" fill="white"/>
              <path d="M27.5343 33.5975C27.5343 31.5075 27.5207 29.4155 27.5285 27.3236C27.5362 25.0018 27.5479 22.6662 27.5615 20.3386C27.5673 19.3977 27.6644 18.4136 27.5964 17.4727C27.5634 17.015 27.3323 16.7125 26.9089 16.5534L11.9886 10.5898L12.1207 6.22324L28.6258 12.8075C30.3602 13.5539 31.5334 15.2413 31.6674 17.1446L31.5955 35.0648L31.5334 35.1041L27.5323 33.5975H27.5343Z" fill="white"/>
            </svg>
            <span className="text-white text-xs tracking-widest"
              style={{ fontFamily: "'Montserrat', sans-serif" }}>CODE LESS © 2026. Todos os direitos reservados</span>
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
