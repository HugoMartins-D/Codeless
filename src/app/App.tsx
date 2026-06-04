import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { ProjetosSection } from "./components/ProjetosSection";
import { AboutSection } from "./components/AboutSection";
import { CtaSection } from "./components/CtaSection";
import { FluidBackground } from "./components/ui/fluid-background";

export default function App() {
  return (
    <div className="bg-black min-h-screen">
      <FluidBackground />
      <div className="relative" style={{ zIndex: 1 }}>
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
