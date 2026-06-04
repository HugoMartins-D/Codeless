export function FluidBackground() {
  return (
    <div
      className="fixed inset-0"
      style={{
        zIndex: 0,
        background: "linear-gradient(-45deg, #000000, #1a0a2e, #3d0a2e, #0a1a00, #1a0a2e, #000000)",
        backgroundSize: "400% 400%",
        animation: "fluidGradient 12s ease infinite",
      }}
    />
  )
}
