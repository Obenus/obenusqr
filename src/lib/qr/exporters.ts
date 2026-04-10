import QRCodeStyling from "qr-code-styling";
import { logoSizePercent } from "@/lib/qr/validators";
import { QrStyleConfig } from "@/types/qr";

export const canLoadLogo = (url: string, timeoutMs = 4500): Promise<boolean> =>
  new Promise((resolve) => {
    if (!url) {
      resolve(false);
      return;
    }

    const img = new Image();
    let done = false;

    const finish = (result: boolean) => {
      if (done) return;
      done = true;
      resolve(result);
    };

    const timer = window.setTimeout(() => finish(false), timeoutMs);

    img.crossOrigin = "anonymous";
    img.onload = () => {
      window.clearTimeout(timer);
      finish(true);
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      finish(false);
    };
    img.src = url;
  });

const buildQrInstance = (payload: string, style: QrStyleConfig, size: number, margin = 0, withLogo = true) =>
  new QRCodeStyling({
    width: size,
    height: size,
    margin,
    data: payload,
    qrOptions: {
      errorCorrectionLevel: style.errorCorrectionLevel
    },
    image: withLogo && style.centerLogoUrl ? style.centerLogoUrl : undefined,
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 8,
      imageSize: logoSizePercent(style.errorCorrectionLevel, style.logoScale)
    },
    dotsOptions: {
      type: style.dotsStyle,
      color: style.gradientEnabled ? undefined : style.dotsColor,
      gradient: style.gradientEnabled
        ? {
            type: "linear",
            rotation: Math.PI / 4,
            colorStops: [
              { offset: 0, color: style.gradientStart },
              { offset: 1, color: style.gradientEnd }
            ]
          }
        : undefined
    },
    cornersSquareOptions: {
      type: style.cornerSquareStyle,
      color: style.cornerSquareColor
    },
    cornersDotOptions: {
      type: style.cornerDotStyle,
      color: style.cornerDotColor
    },
    backgroundOptions: {
      color: style.backgroundTransparent ? "transparent" : style.backgroundColor
    }
  });

export const exportQr = async (
  payload: string,
  style: QrStyleConfig,
  size: number,
  ext: "png" | "svg",
  fileNameBase: string,
  margin = 0
) => {
  const squareSize = Math.max(size, 2000);
  try {
    const qr = buildQrInstance(payload, style, squareSize, margin, true);
    await qr.download({
      name: `${fileNameBase}-${squareSize}`,
      extension: ext
    });
  } catch {
    // Fallback: if logo URL fails (often CORS), export QR without logo.
    const qr = buildQrInstance(payload, style, squareSize, margin, false);
    await qr.download({
      name: `${fileNameBase}-${squareSize}`,
      extension: ext
    });
  }
};

export const mountQr = (payload: string, style: QrStyleConfig, element: HTMLElement, size: number, margin = 0) => {
  try {
    const qr = buildQrInstance(payload, style, size, margin, true);
    qr.append(element);
    return qr;
  } catch {
    // Fallback: keep preview visible even if logo cannot be loaded.
    const qr = buildQrInstance(payload, style, size, margin, false);
    qr.append(element);
    return qr;
  }
};
