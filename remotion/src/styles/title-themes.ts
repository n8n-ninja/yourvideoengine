// Title themes and animation presets for Title components

export const titleThemes: Record<string, React.CSSProperties> = {
  minimal: {
    color: "#ffffff",
    fontFamily: "Inter, sans-serif",
    fontSize: 90,
    fontWeight: 500,
    letterSpacing: "0.05em",
  },
  impact: {
    color: "#ffffff",
    fontFamily: "Impact, sans-serif",
    fontSize: 100,
    fontWeight: 800,
    textTransform: "uppercase" as const,
    letterSpacing: "0.03em",
    textShadow: "2px 2px 0 #000",
  },
  elegant: {
    color: "#ffffff",
    fontFamily: "Playfair Display, serif",
    fontSize: 85,
    fontWeight: 400,
    fontStyle: "italic",
    letterSpacing: "0.05em",
    textShadow: "0 2px 20px rgba(0,0,0,0.5)",
  },
  neon: {
    color: "#00fff7",
    fontFamily: "Montserrat, sans-serif",
    fontSize: 80,
    fontWeight: 700,
    textShadow:
      "0 0 5px #00fff7, 0 0 10px #00fff7, 0 0 20px #00fff7, 0 0 30px #00fff7",
    letterSpacing: "0.08em",
  },
  shadow: {
    color: "#ffffff",
    fontFamily: "Roboto, sans-serif",
    fontSize: 90,
    fontWeight: 900,
    textShadow:
      "0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)",
  },
  outline: {
    color: "transparent",
    fontFamily: "Oswald, sans-serif",
    fontSize: 95,
    fontWeight: 800,
    WebkitTextStroke: "2px white",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  },
  gradient: {
    fontFamily: "Montserrat, sans-serif",
    fontSize: 90,
    fontWeight: 800,
    background: "linear-gradient(to right, #ff8a00, #da1b60, #8a16ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 2px 15px rgba(0,0,0,0.2)",
  },
  retro: {
    color: "#ffde59",
    fontFamily: "Press Start 2P, cursive",
    fontSize: 60,
    textShadow: "5px 5px 0px #ff00a2",
    letterSpacing: "0.05em",
    lineHeight: 1.5,
  },
  cinematic: {
    color: "#ffffff",
    fontFamily: "Cinzel, serif",
    fontSize: 85,
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    textShadow: "0 2px 30px rgba(0,0,0,0.8)",
  },
}

export const themeNames = Object.keys(titleThemes) as [string, ...string[]]
