import { QrFormValues, QrType } from "@/types/qr";
import { sanitizeHttpUrl, sanitizeMail, sanitizePhone, sanitizePlainText } from "@/lib/qr/security";

const buildVCard = (v: QrFormValues) =>
  [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${sanitizePlainText(v.vcardName)}`,
    `FN:${sanitizePlainText(v.vcardName)}`,
    v.vcardOrg ? `ORG:${sanitizePlainText(v.vcardOrg)}` : "",
    v.vcardTitle ? `TITLE:${sanitizePlainText(v.vcardTitle)}` : "",
    v.vcardPhone ? `TEL:${sanitizePhone(v.vcardPhone)}` : "",
    v.vcardEmail ? `EMAIL:${sanitizeMail(v.vcardEmail)}` : "",
    v.vcardWebsite ? `URL:${sanitizeHttpUrl(v.vcardWebsite)}` : "",
    "END:VCARD"
  ]
    .filter(Boolean)
    .join("\n");

const buildEvent = (v: QrFormValues) =>
  [
    "BEGIN:VEVENT",
    `SUMMARY:${sanitizePlainText(v.eventTitle)}`,
    v.eventLocation ? `LOCATION:${sanitizePlainText(v.eventLocation)}` : "",
    v.eventStart ? `DTSTART:${v.eventStart.replace(/[-:]/g, "").replace("T", "")}` : "",
    v.eventEnd ? `DTEND:${v.eventEnd.replace(/[-:]/g, "").replace("T", "")}` : "",
    v.eventDescription ? `DESCRIPTION:${sanitizePlainText(v.eventDescription)}` : "",
    "END:VEVENT"
  ]
    .filter(Boolean)
    .join("\n");

export const buildPayload = (type: QrType, v: QrFormValues): string => {
  switch (type) {
    case "link":
      return sanitizeHttpUrl(v.link);
    case "text":
      return sanitizePlainText(v.text);
    case "email":
      return `mailto:${sanitizeMail(v.emailAddress)}?subject=${encodeURIComponent(sanitizePlainText(v.emailSubject))}&body=${encodeURIComponent(sanitizePlainText(v.emailBody))}`;
    case "call":
      return `tel:${sanitizePhone(v.phone)}`;
    case "sms":
      return `SMSTO:${sanitizePhone(v.phone)}:${sanitizePlainText(v.smsMessage)}`;
    case "vcard":
      return buildVCard(v);
    case "whatsapp":
      return `https://wa.me/${sanitizePhone(v.whatsappPhone)}?text=${encodeURIComponent(sanitizePlainText(v.whatsappMessage))}`;
    case "wifi":
      return `WIFI:T:${sanitizePlainText(v.wifiSecurity)};S:${sanitizePlainText(v.wifiSsid)};P:${sanitizePlainText(v.wifiPassword)};;`;
    case "pdf":
      return sanitizeHttpUrl(v.pdfUrl);
    case "app":
      return sanitizeHttpUrl(v.appUrl);
    case "images":
      return sanitizeHttpUrl(v.imageUrl);
    case "video":
      return sanitizeHttpUrl(v.videoUrl);
    case "social":
      return sanitizeHttpUrl(v.socialUrl);
    case "event":
      return buildEvent(v);
    case "barcode2d":
      return sanitizePlainText(v.barcode2dText);
    default:
      return "";
  }
};
