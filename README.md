# Obenus QR

Generador de códigos QR gratuito, personalizable y de alta calidad, creado para la marca **Obenus**.

## Características principales

- Generación de códigos QR para múltiples tipos de contenido:
  - Enlace, Texto, Correo electrónico, Llamada, SMS
  - vCard, WhatsApp, Wi-Fi
  - PDF, App, Imágenes, Video, Redes sociales
  - Evento y Código de barras 2D
- Personalización visual avanzada:
  - Estilo de módulos, color principal y fondo
  - Gradiente, fondo transparente y logo central
  - Nivel de corrección de errores (L, M, Q, H)
- Exportación en alta calidad:
  - PNG y SVG
  - Tamaño cuadrado mínimo de 2000 px (2000/3000/4000)
- Interfaz en español, con ayudas contextuales tipo tooltip.
- Plantillas rápidas y constructor de parámetros UTM.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior

## Instalación

```bash
npm install
```

## Uso en desarrollo

La aplicación está configurada para ejecutarse en el puerto **3025**.

```bash
npm run dev
```

Abre en el navegador:

- [http://localhost:3025](http://localhost:3025)

## Compilación para producción

```bash
npm run build
npm run start
```

## Seguridad aplicada

Se añadieron medidas de endurecimiento base:

- Cabeceras de seguridad HTTP (CSP, X-Frame-Options, etc.)
- Saneado de entradas para payloads QR
- Restricciones para recursos embebidos

## Licencia

Este proyecto está licenciado bajo **Creative Commons Atribución 4.0 Internacional (CC BY 4.0)**.

Consulta el archivo `LICENSE` para más detalles.

## Autoría y procedencia

Proyecto publicado por **Obenus**.

- Sitio web: [https://www.obenus.com](https://www.obenus.com)
