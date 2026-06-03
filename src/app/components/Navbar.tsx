import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import svgPaths from "../../imports/Home/svg-rk6ni7pcck";

const glass = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)",
} as React.CSSProperties;

function LogoMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div style={{ width: 28, height: 34 }}>
        <svg className="w-full h-full" fill="none" viewBox="0 0 38.071 44.6781">
          <path d={svgPaths.p11087c80} fill="white" />
          <path d={svgPaths.p13dda600} fill="white" />
          <path d={svgPaths.p3efdf4f0} fill="white" />
        </svg>
      </div>
      <div className="flex flex-col gap-0.5">
        <svg style={{ height: 12 }} fill="none" viewBox="0 0 85.6121 25.4885">
          <path d={svgPaths.p37b92600} fill="white" />
          <path d={svgPaths.p1dd1b3c0} fill="white" />
          <path d={svgPaths.p1a77cf00} fill="white" />
          <path d={svgPaths.p2802420} fill="white" />
        </svg>
        <svg style={{ height: 12 }} fill="none" viewBox="0 0 66.9549 25.4885">
          <path d="M0 0H5.4946V24.7794H0V0Z" fill="white" />
          <path d={svgPaths.p2c28ecc0} fill="white" />
          <path d={svgPaths.p22c02c00} fill="white" />
          <path d={svgPaths.p31370372} fill="white" />
        </svg>
      </div>
    </div>
  );
}

const links = [
  { label: "Home",      href: "#home"     },
  { label: "Projetos",  href: "#projetos" },
  { label: "Code Less", href: "#codeless" },
  { label: "Contato",   href: "#contato"  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState("Home");
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (href: string, label: string) => {
    setActive(label);
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => go("#home", "Home")} className="focus:outline-none">
          <LogoMark />
        </button>

        {/* Centre pill — liquid glass */}
        <div
          className="hidden md:flex items-center gap-1 rounded-full px-2 py-2 transition-all duration-500"
          style={glass}
        >
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => go(l.href, l.label)}
              className="px-5 py-1.5 rounded-full text-sm transition-all duration-200"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                ...(active === l.label
                  ? {
                      background: "rgba(255,255,255,0.90)",
                      color: "#000",
                      fontWeight: 700,
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 8px rgba(0,0,0,0.3)",
                    }
                  : { color: "rgba(255,255,255,0.60)" }),
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden md:block w-[100px]" />

        {/* Mobile toggle */}
        <button className="md:hidden text-white" onClick={() => setOpen(v => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu — glass */}
      {open && (
        <div
          className="md:hidden mt-2 mx-4 rounded-2xl px-5 py-4 flex flex-col gap-2"
          style={glass}
        >
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => go(l.href, l.label)}
              className="text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: active === l.label ? "#fff" : "rgba(255,255,255,0.50)",
                background: active === l.label ? "rgba(255,255,255,0.08)" : "transparent",
                fontWeight: active === l.label ? 700 : 400,
              }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => go("#contato", "Contato")}
            className="mt-2 px-4 py-3 rounded-xl text-white text-sm text-center font-semibold transition-all hover:scale-105"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              background: "rgba(233,62,143,0.25)",
              border: "1px solid rgba(233,62,143,0.35)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
          >
            Fale conosco
          </button>
        </div>
      )}
    </nav>
  );
}
