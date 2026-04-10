import { QrTemplate } from "@/types/qr";

export const qrTemplates: QrTemplate[] = [
  {
    id: "restaurant",
    name: "Restaurante",
    type: "link",
    apply: () => ({ link: "https://mi-restaurante.com/menu" })
  },
  {
    id: "event",
    name: "Evento",
    type: "event",
    apply: () => ({
      eventTitle: "Lanzamiento Obenus QR",
      eventLocation: "Madrid",
      eventDescription: "Presentación oficial",
      eventStart: "2026-05-01T18:00",
      eventEnd: "2026-05-01T20:00"
    })
  },
  {
    id: "business-card",
    name: "Tarjeta de visita",
    type: "vcard",
    apply: () => ({
      vcardName: "Nombre Apellidos",
      vcardOrg: "Obenus QR",
      vcardTitle: "CEO",
      vcardPhone: "+34123456789",
      vcardEmail: "hola@obenusqr.com"
    })
  },
  {
    id: "wifi-fast",
    name: "Wi-Fi rápido",
    type: "wifi",
    apply: () => ({
      wifiSsid: "Oficina-Obenus",
      wifiPassword: "clave-segura-2026",
      wifiSecurity: "WPA"
    })
  }
];
