export type QrType =
  | "link"
  | "text"
  | "email"
  | "call"
  | "sms"
  | "vcard"
  | "whatsapp"
  | "wifi"
  | "pdf"
  | "app"
  | "images"
  | "video"
  | "social"
  | "event"
  | "barcode2d";

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export type DotStyle = "square" | "dots" | "rounded" | "classy" | "classy-rounded" | "extra-rounded";
export type CornerSquareStyle = "square" | "dot" | "extra-rounded";
export type CornerDotStyle = "square" | "dot";

export interface QrFormValues {
  link: string;
  text: string;
  emailAddress: string;
  emailSubject: string;
  emailBody: string;
  phone: string;
  smsMessage: string;
  whatsappPhone: string;
  whatsappMessage: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiSecurity: "WPA" | "WEP" | "nopass";
  pdfUrl: string;
  appUrl: string;
  imageUrl: string;
  videoUrl: string;
  socialUrl: string;
  eventTitle: string;
  eventLocation: string;
  eventStart: string;
  eventEnd: string;
  eventDescription: string;
  barcode2dText: string;
  vcardName: string;
  vcardOrg: string;
  vcardTitle: string;
  vcardPhone: string;
  vcardEmail: string;
  vcardWebsite: string;
}

export interface QrStyleConfig {
  dotsColor: string;
  backgroundColor: string;
  backgroundTransparent: boolean;
  gradientEnabled: boolean;
  gradientStart: string;
  gradientEnd: string;
  cornerSquareColor: string;
  cornerDotColor: string;
  centerColor: string;
  dotsStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerDotStyle: CornerDotStyle;
  errorCorrectionLevel: ErrorCorrectionLevel;
}

export interface QrTemplate {
  id: string;
  name: string;
  type: QrType;
  apply: (values: QrFormValues) => Partial<QrFormValues>;
}
