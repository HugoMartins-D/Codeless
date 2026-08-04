import { StaggeredMenu } from "./components/ui/StaggeredMenu";
import { HeroSection } from "./components/HeroSection";
import { ProjetosSection } from "./components/ProjetosSection";
import { ServicesGridSection } from "./components/ServicesGridSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { SolutionsSection } from "./components/SolutionsSection";
import { AboutSection } from "./components/AboutSection";
import { FounderSection } from "./components/FounderSection";
import { VendorSection } from "./components/VendorSection";
import { ProofSection } from "./components/ProofSection";
import { PartnerSection } from "./components/PartnerSection";
import { FaqSection } from "./components/FaqSection";
import { CtaSection } from "./components/CtaSection";
import { WebGLShader } from "./components/ui/web-gl-shader";

const menuItems = [
  { label: "Home", ariaLabel: "Ir para o início", link: "#home" },
  { label: "Projetos", ariaLabel: "Ver projetos", link: "#projetos" },
  { label: "Code Less", ariaLabel: "Sobre a Code Less", link: "#codeless" },
  { label: "Contato", ariaLabel: "Falar com a equipe", link: "#contato" },
];

const socialItems = [
  { label: "WhatsApp", link: "https://wa.me/5547996258977" },
  { label: "Instagram", link: "#" },
];

export default function App() {
  return (
    <div className="min-h-screen">
      <WebGLShader />
      <div className="fixed inset-0" style={{ zIndex: 1, background: "rgba(0,0,0,0.75)" }} />
      <div className="relative" style={{ zIndex: 2 }}>
        <StaggeredMenu
          isFixed
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          logoUrl="/logobranca.png"
          menuButtonColor="#fff"
          openMenuButtonColor="#fff"
          changeMenuColorOnOpen={true}
          colors={["#5252A8", "#e93e8f"]}
          accentColor="#e93e8f"
        />
        <HeroSection />
        <ProjetosSection />
        <ServicesGridSection />
        <FeaturesSection />
        <SolutionsSection />
        <AboutSection />
        <FounderSection />
        <VendorSection />
        <ProofSection />
        <PartnerSection />
        <FaqSection />
        <CtaSection />
      </div>
    </div>
  );
}
