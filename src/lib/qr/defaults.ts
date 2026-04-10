import { QrFormValues, QrStyleConfig } from "@/types/qr";

export const defaultFormValues: QrFormValues = {
  link: "https://qr.obenus.com",
  text: "Obenus QR - Generador gratuito",
  emailAddress: "",
  emailSubject: "",
  emailBody: "",
  phone: "",
  smsMessage: "",
  whatsappPhone: "",
  whatsappMessage: "",
  wifiSsid: "",
  wifiPassword: "",
  wifiSecurity: "WPA",
  pdfUrl: "",
  appUrl: "",
  imageUrl: "",
  videoUrl: "",
  socialUrl: "",
  eventTitle: "",
  eventLocation: "",
  eventStart: "",
  eventEnd: "",
  eventDescription: "",
  barcode2dText: "",
  vcardName: "",
  vcardOrg: "",
  vcardTitle: "",
  vcardPhone: "",
  vcardEmail: "",
  vcardWebsite: ""
};

export const defaultStyleConfig: QrStyleConfig = {
  dotsColor: "#0f172a",
  backgroundColor: "#ffffff",
  backgroundTransparent: false,
  gradientEnabled: false,
  gradientStart: "#0f172a",
  gradientEnd: "#334155",
  cornerSquareColor: "#0f172a",
  cornerDotColor: "#0f172a",
  centerColor: "#0f172a",
  dotsStyle: "square",
  cornerSquareStyle: "square",
  cornerDotStyle: "square",
  errorCorrectionLevel: "M"
};
