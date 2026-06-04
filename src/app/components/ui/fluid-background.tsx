export function FluidBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0, background: "#000" }}>
      {/* blob purple */}
      <div style={{
        position: "absolute",
        top: "20%", left: "15%",
        width: 700, height: 700,
        borderRadius: "50%",
        background: "radial-gradient(circle, #5252A8cc 0%, transparent 70%)",
        filter: "blur(80px)",
        animation: "blob1 18s ease-in-out infinite",
        opacity: 0.55,
      }} />
      {/* blob pink */}
      <div style={{
        position: "absolute",
        bottom: "10%", right: "10%",
        width: 600, height: 600,
        borderRadius: "50%",
        background: "radial-gradient(circle, #e93e8fcc 0%, transparent 70%)",
        filter: "blur(90px)",
        animation: "blob2 22s ease-in-out infinite",
        opacity: 0.45,
      }} />
      {/* blob lime */}
      <div style={{
        position: "absolute",
        top: "55%", left: "55%",
        width: 500, height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, #c7d300aa 0%, transparent 70%)",
        filter: "blur(100px)",
        animation: "blob3 26s ease-in-out infinite",
        opacity: 0.3,
      }} />
      {/* blob purple secondary */}
      <div style={{
        position: "absolute",
        top: "5%", right: "25%",
        width: 450, height: 450,
        borderRadius: "50%",
        background: "radial-gradient(circle, #7b7de8bb 0%, transparent 70%)",
        filter: "blur(70px)",
        animation: "blob4 20s ease-in-out infinite",
        opacity: 0.35,
      }} />
      {/* overlay escuro para manter legibilidade */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.55)",
      }} />
    </div>
  )
}
