import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { ProjetosSection } from "./components/ProjetosSection";
import { AboutSection } from "./components/AboutSection";
import { CtaSection } from "./components/CtaSection";
import { ShaderAnimation } from "./components/ui/shader-lines";

export default function App() {
  return (
    <div className="relative bg-black min-h-screen">
      {/* Full-site shader background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <ShaderAnimation />
      </div>
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ProjetosSection />
        <FeaturesSection />
        <AboutSection />
        <CtaSection />
      </div>
    </div>
  );
}
