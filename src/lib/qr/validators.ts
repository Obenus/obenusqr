import { ErrorCorrectionLevel } from "@/types/qr";

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return null;
  const bigint = Number.parseInt(normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
};

const luminance = (r: number, g: number, b: number) => {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

export const contrastRatio = (foreground: string, background: string): number => {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  if (!fg || !bg) return 1;
  const l1 = luminance(fg.r, fg.g, fg.b);
  const l2 = luminance(bg.r, bg.g, bg.b);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
};

export const readabilityLabel = (ratio: number): string => {
  if (ratio >= 7) return "Excelente";
  if (ratio >= 4.5) return "Buena";
  if (ratio >= 3) return "Riesgo medio";
  return "Riesgo alto";
};

export const logoSizePercent = (level: ErrorCorrectionLevel, scale = 1): number => {
  const safeScale = Math.min(Math.max(scale, 0.6), 3);
  const clamp = (value: number) => Math.min(Math.max(value, 0.12), 0.5);

  switch (level) {
    case "H":
      return clamp(0.24 * safeScale);
    case "Q":
      return clamp(0.2 * safeScale);
    case "M":
      return clamp(0.18 * safeScale);
    case "L":
      return clamp(0.16 * safeScale);
    default:
      return clamp(0.18 * safeScale);
  }
};
