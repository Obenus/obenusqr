import { NextRequest } from "next/server";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const isPrivateHost = (hostname: string): boolean => {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local")) return true;

  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4.test(host)) {
    const [a, b] = host.split(".").map(Number);
    if (a === 10 || a === 127 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
  }

  if (host === "::1" || host.startsWith("fc") || host.startsWith("fd")) return true;
  return false;
};

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("url");
  if (!source) return new Response("Falta parámetro url", { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(source);
  } catch {
    return new Response("URL inválida", { status: 400 });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return new Response("Protocolo no permitido", { status: 400 });
  }

  if (isPrivateHost(parsed.hostname)) {
    return new Response("Host no permitido", { status: 403 });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);

  try {
    const upstream = await fetch(parsed.toString(), {
      headers: { Accept: "image/*" },
      redirect: "follow",
      signal: controller.signal,
      cache: "no-store"
    });

    if (!upstream.ok) return new Response("No se pudo descargar el logo", { status: 502 });

    const contentType = upstream.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return new Response("El recurso no es imagen", { status: 415 });

    const buf = await upstream.arrayBuffer();
    if (buf.byteLength > MAX_IMAGE_BYTES) return new Response("Imagen demasiado grande", { status: 413 });

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=3600"
      }
    });
  } catch {
    return new Response("Error al procesar logo", { status: 502 });
  } finally {
    clearTimeout(timer);
  }
}
