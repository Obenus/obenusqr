import QRCodeStyling from "qr-code-styling";
import { logoSizePercent } from "@/lib/qr/validators";
import { QrStyleConfig } from "@/types/qr";

const buildQrInstance = (payload: string, style: QrStyleConfig, size: number, margin = 0) =>
  new QRCodeStyling({
    width: size,
    height: size,
    margin,
    data: payload,
    qrOptions: {
      errorCorrectionLevel: style.errorCorrectionLevel
    },
    image: style.centerLogoUrl || undefined,
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 8,
      imageSize: logoSizePercent(style.errorCorrectionLevel)
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
  const qr = buildQrInstance(payload, style, squareSize, margin);
  await qr.download({
    name: `${fileNameBase}-${squareSize}`,
    extension: ext
  });
};

export const mountQr = (payload: string, style: QrStyleConfig, element: HTMLElement, size: number, margin = 0) => {
  const qr = buildQrInstance(payload, style, size, margin);
  qr.append(element);
  return qr;
};
