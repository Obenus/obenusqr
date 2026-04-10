import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Obenus QR",
  description: "Generador de códigos QR gratuitos con estilo premium y exportación 2000px+"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
