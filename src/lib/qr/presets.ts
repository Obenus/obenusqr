import { QrStyleConfig } from "@/types/qr";

export const stylePresets: Array<{ name: string; style: Partial<QrStyleConfig> }> = [
  {
    name: "Mínimo",
    style: {
      dotsColor: "#111827",
      cornerSquareColor: "#111827",
      cornerDotColor: "#111827",
      centerColor: "#111827",
      dotsStyle: "square",
      gradientEnabled: false,
      backgroundColor: "#ffffff"
    }
  },
  {
    name: "Intenso",
    style: {
      dotsColor: "#0b132b",
      cornerSquareColor: "#0b132b",
      cornerDotColor: "#1c2541",
      centerColor: "#1c2541",
      dotsStyle: "classy-rounded",
      gradientEnabled: false
    }
  },
  {
    name: "Neon",
    style: {
      gradientEnabled: true,
      gradientStart: "#22d3ee",
      gradientEnd: "#a855f7",
      dotsStyle: "dots",
      cornerSquareStyle: "extra-rounded",
      cornerDotStyle: "dot",
      backgroundColor: "#050816"
    }
  },
  {
    name: "Corporativo",
    style: {
      dotsColor: "#0f4c81",
      cornerSquareColor: "#0f4c81",
      cornerDotColor: "#0b3a61",
      centerColor: "#0f4c81",
      dotsStyle: "rounded",
      backgroundColor: "#f8fafc",
      gradientEnabled: false
    }
  }
];
