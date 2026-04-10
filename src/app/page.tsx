"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Download, QrCode, Sparkles } from "lucide-react";
import { defaultFormValues, defaultStyleConfig } from "@/lib/qr/defaults";
import { canLoadLogo, exportQr, mountQr } from "@/lib/qr/exporters";
import { buildPayload } from "@/lib/qr/payloadBuilders";
import { stylePresets } from "@/lib/qr/presets";
import { qrTemplates } from "@/lib/qr/templates";
import { buildUtmUrl, type UtmValues } from "@/lib/qr/utm";
import { contrastRatio, readabilityLabel } from "@/lib/qr/validators";
import { QrFormValues, QrStyleConfig, QrType } from "@/types/qr";

const qrTypes: Array<{ id: QrType; label: string }> = [
  { id: "link", label: "Enlace" },
  { id: "text", label: "Texto" },
  { id: "email", label: "Correo electrónico" },
  { id: "call", label: "Llamada" },
  { id: "sms", label: "SMS" },
  { id: "vcard", label: "Tarjeta vCard" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "pdf", label: "PDF" },
  { id: "app", label: "App" },
  { id: "images", label: "Imágenes" },
  { id: "video", label: "Video" },
  { id: "social", label: "Redes sociales" },
  { id: "event", label: "Evento" },
  { id: "barcode2d", label: "Código de barras 2D" }
];

export default function HomePage() {
  const currentYear = new Date().getFullYear();
  const [type, setType] = useState<QrType>("link");
  const [values, setValues] = useState<QrFormValues>(defaultFormValues);
  const [style, setStyle] = useState<QrStyleConfig>(defaultStyleConfig);
  const [exportSize, setExportSize] = useState(2000);
  const [printMode, setPrintMode] = useState(false);
  const [logoWarning, setLogoWarning] = useState("");
  const [utm, setUtm] = useState<UtmValues>({
    baseUrl: values.link,
    source: "",
    medium: "",
    campaign: "",
    term: "",
    content: ""
  });
  const previewRef = useRef<HTMLDivElement>(null);
  const resolveLogoUrl = (raw: string) => {
    if (!raw) return "";
    if (raw.startsWith("data:") || raw.startsWith("blob:")) return raw;
    try {
      const parsed = new URL(raw);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "";
      return `/api/logo-proxy?url=${encodeURIComponent(parsed.toString())}`;
    } catch {
      return "";
    }
  };

  const payload = useMemo(() => buildPayload(type, values), [type, values]);
  const ratio = useMemo(() => contrastRatio(style.dotsColor, style.backgroundColor), [style.dotsColor, style.backgroundColor]);

  useEffect(() => {
    if (!previewRef.current) return;
    let cancelled = false;
    const draw = async () => {
      if (!previewRef.current) return;
      previewRef.current.innerHTML = "";

      if (style.centerLogoUrl) {
        const safeLogoUrl = resolveLogoUrl(style.centerLogoUrl);
        const canUseLogo = await canLoadLogo(safeLogoUrl);
        if (cancelled) return;
        if (!canUseLogo) {
          setLogoWarning("No se pudo cargar el logo desde esa URL. El código se muestra sin logo para mantener su lectura.");
          mountQr(payload || " ", { ...style, centerLogoUrl: "" }, previewRef.current, 420, printMode ? 14 : 2);
          return;
        }
        setLogoWarning("");
        mountQr(payload || " ", { ...style, centerLogoUrl: safeLogoUrl }, previewRef.current, 420, printMode ? 14 : 2);
        return;
      }

      setLogoWarning("");
      mountQr(payload || " ", style, previewRef.current, 420, printMode ? 14 : 2);
    };

    void draw();
    return () => {
      cancelled = true;
    };
  }, [payload, style, printMode]);

  const updateValue = (key: keyof QrFormValues, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const doExport = async (ext: "png" | "svg") => {
    const safeLogoUrl = resolveLogoUrl(style.centerLogoUrl);
    await exportQr(payload, { ...style, centerLogoUrl: safeLogoUrl }, exportSize, ext, `obenus-qr-${type}`, printMode ? 28 : 4);
  };

  const applyTemplate = (templateId: string) => {
    const template = qrTemplates.find((t) => t.id === templateId);
    if (!template) return;
    setType(template.type);
    setValues((prev) => ({ ...prev, ...template.apply(prev) }));
  };

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="fondo-aurora" />
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[1.25fr_0.9fr]">
        <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur">
          <div className="halo-decorativo" />
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                <Sparkles size={14} /> Alta calidad 2000px+
              </p>
              <h1 className="text-4xl font-bold tracking-tight">Obenus QR</h1>
              <p className="text-sm text-slate-500">Generador de códigos QR gratuito con diseño profesional.</p>
            </div>
          </div>

          <h2 className="mb-2 text-lg font-semibold">Tipo de QR</h2>
          <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-5">
            {qrTypes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setType(item.id)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition duration-300 hover:-translate-y-0.5 ${
                  type === item.id
                    ? "border-sky-500 bg-gradient-to-r from-sky-50 to-cyan-50 text-sky-700 shadow-sm"
                    : "border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <section className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="mb-3 font-semibold">Plantillas rápidas</h3>
            <div className="flex flex-wrap gap-2">
              {qrTemplates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyTemplate(t.id)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-sm"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </section>

          <TypeForm type={type} values={values} onChange={updateValue} utm={utm} setUtm={setUtm} setValues={setValues} />

          <section className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h3 className="mb-3 font-semibold">Estilo y color</h3>
            <div className="mb-3 flex flex-wrap gap-2">
              {stylePresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setStyle((prev) => ({ ...prev, ...preset.style }))}
                  type="button"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-sm transition duration-300 hover:-translate-y-0.5 hover:border-sky-400 hover:shadow-sm"
                >
                  {preset.name}
                </button>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm">
                Color principal
                <input type="color" value={style.dotsColor} onChange={(e) => setStyle({ ...style, dotsColor: e.target.value })} className="mt-1 block h-10 w-full" />
              </label>
              <label className="text-sm">
                Fondo
                <input
                  type="color"
                  value={style.backgroundColor}
                  onChange={(e) => setStyle({ ...style, backgroundColor: e.target.value })}
                  className="mt-1 block h-10 w-full"
                />
              </label>
              <label className="text-sm">
                Estilo de módulos
                <select
                  value={style.dotsStyle}
                  onChange={(e) => setStyle({ ...style, dotsStyle: e.target.value as QrStyleConfig["dotsStyle"] })}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2"
                >
                  <option value="square">Cuadrado</option>
                  <option value="dots">Puntos</option>
                  <option value="rounded">Redondeado</option>
                  <option value="classy">Elegante</option>
                  <option value="classy-rounded">Elegante redondeado</option>
                  <option value="extra-rounded">Extra redondeado</option>
                </select>
              </label>
              <label className="text-sm">
                <span className="inline-flex items-center gap-2">
                  Corrección de errores
                  <InfoAyuda texto="Controla cuántos errores de lectura puede soportar el QR. L permite más capacidad, H es más robusto si añades logo o estilos complejos." />
                </span>
                <select
                  value={style.errorCorrectionLevel}
                  onChange={(e) => setStyle({ ...style, errorCorrectionLevel: e.target.value as QrStyleConfig["errorCorrectionLevel"] })}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2"
                >
                  <option value="L">L</option>
                  <option value="M">M</option>
                  <option value="Q">Q</option>
                  <option value="H">H</option>
                </select>
              </label>
              <label className="text-sm">
                Logo central (URL)
                <input
                  type="url"
                  value={style.centerLogoUrl}
                  onChange={(e) => setStyle({ ...style, centerLogoUrl: e.target.value })}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-lg border border-slate-300 p-2"
                />
                {logoWarning ? <span className="mt-1 block text-xs text-amber-700">{logoWarning}</span> : null}
              </label>
              <label className="text-sm">
                Tamaño de exportación
                <select value={exportSize} onChange={(e) => setExportSize(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2">
                  <option value={2000}>2000 px</option>
                  <option value={3000}>3000 px</option>
                  <option value={4000}>4000 px</option>
                </select>
              </label>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={style.gradientEnabled}
                  onChange={(e) => setStyle({ ...style, gradientEnabled: e.target.checked })}
                />
                Gradiente
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={style.backgroundTransparent}
                  onChange={(e) => setStyle({ ...style, backgroundTransparent: e.target.checked })}
                />
                Fondo transparente
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={printMode} onChange={(e) => setPrintMode(e.target.checked)} />
                Modo impresión (zona de silencio)
              </label>
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-white/70 bg-white/90 p-5 shadow-xl">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <QrCode size={18} /> Vista previa
            </h2>
            <div ref={previewRef} className="zona-vista-previa mx-auto flex min-h-[430px] items-center justify-center rounded-2xl bg-white p-3" />
            <p className="mt-3 text-sm text-slate-600">
              Contraste: <strong>{ratio.toFixed(2)}:1</strong> - {readabilityLabel(ratio)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={() => void doExport("png")} type="button" className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
                <span className="inline-flex items-center gap-2">
                  <Download size={16} /> PNG
                </span>
              </button>
              <button onClick={() => void doExport("svg")} type="button" className="rounded-xl border border-slate-300 px-4 py-2 transition hover:bg-slate-100">
                <span className="inline-flex items-center gap-2">
                  <Download size={16} /> SVG
                </span>
              </button>
            </div>
          </section>
        </aside>
      </div>
      <footer className="mx-auto mt-8 w-full max-w-7xl rounded-2xl border border-white/70 bg-white/80 px-4 py-4 text-center text-sm text-slate-600 backdrop-blur">
        <p>
          © {currentYear}{" "}
          <a
            href="https://www.obenus.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sky-700 hover:underline"
          >
            Obenus
          </a>
          . Esta utilidad se distribuye bajo licencia{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-sky-700 hover:underline"
          >
            Creative Commons Atribución 4.0 (CC BY 4.0)
          </a>
          . Puedes usarla e instalarla libremente citando la procedencia.
        </p>
      </footer>
    </main>
  );
}

function TypeForm({
  type,
  values,
  onChange,
  utm,
  setUtm,
  setValues
}: {
  type: QrType;
  values: QrFormValues;
  onChange: (key: keyof QrFormValues, value: string) => void;
  utm: UtmValues;
  setUtm: React.Dispatch<React.SetStateAction<UtmValues>>;
  setValues: React.Dispatch<React.SetStateAction<QrFormValues>>;
}) {
  const inputCls = "w-full rounded-lg border border-slate-300 p-2";

  if (type === "link") {
    return (
      <section className="rounded-2xl border border-slate-200 p-4">
        <h3 className="mb-3 font-semibold">Enlace (URL)</h3>
        <input className={inputCls} type="url" value={values.link} onChange={(e) => onChange("link", e.target.value)} placeholder="https://..." />
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <label className="text-xs text-slate-600">
            <span className="mb-1 inline-flex items-center gap-2">
              origen_campaña
              <InfoAyuda texto="Indica desde dónde llega el usuario (ejemplo: google, newsletter, instagram)." />
            </span>
            <input className={inputCls} placeholder="google" value={utm.source} onChange={(e) => setUtm({ ...utm, source: e.target.value, baseUrl: values.link })} />
          </label>
          <label className="text-xs text-slate-600">
            <span className="mb-1 inline-flex items-center gap-2">
              medio_campaña
              <InfoAyuda texto="Define el canal de adquisición (ejemplo: cpc, email, social, organic)." />
            </span>
            <input className={inputCls} placeholder="social" value={utm.medium} onChange={(e) => setUtm({ ...utm, medium: e.target.value, baseUrl: values.link })} />
          </label>
          <label className="text-xs text-slate-600">
            <span className="mb-1 inline-flex items-center gap-2">
              nombre_campaña
              <InfoAyuda texto="Nombre de la acción de marketing para identificar resultados (ejemplo: lanzamiento_primavera)." />
            </span>
            <input
              className={inputCls}
              placeholder="lanzamiento_primavera"
              value={utm.campaign}
              onChange={(e) => setUtm({ ...utm, campaign: e.target.value, baseUrl: values.link })}
            />
          </label>
          <button
            type="button"
            onClick={() => setValues((prev) => ({ ...prev, link: buildUtmUrl({ ...utm, baseUrl: values.link }) }))}
            className="rounded-lg bg-sky-600 px-3 py-2 text-white"
          >
            Aplicar UTM
          </button>
        </div>
      </section>
    );
  }

  if (type === "text") return <SingleInput title="Texto" value={values.text} onChange={(v) => onChange("text", v)} />;
  if (type === "email")
    return (
      <MultiInputs
        title="Correo electrónico"
        fields={[
          { key: "emailAddress", label: "Correo", value: values.emailAddress },
          { key: "emailSubject", label: "Asunto", value: values.emailSubject },
          { key: "emailBody", label: "Cuerpo", value: values.emailBody }
        ]}
        onChange={onChange}
      />
    );
  if (type === "call") return <SingleInput title="Teléfono" value={values.phone} onChange={(v) => onChange("phone", v)} />;
  if (type === "sms")
    return <MultiInputs title="SMS" fields={[{ key: "phone", label: "Teléfono", value: values.phone }, { key: "smsMessage", label: "Mensaje", value: values.smsMessage }]} onChange={onChange} />;
  if (type === "whatsapp")
    return (
      <MultiInputs
        title="WhatsApp"
        fields={[
          { key: "whatsappPhone", label: "Teléfono", value: values.whatsappPhone },
          { key: "whatsappMessage", label: "Mensaje", value: values.whatsappMessage }
        ]}
        onChange={onChange}
      />
    );
  if (type === "wifi")
    return (
      <section className="rounded-2xl border border-slate-200 p-4">
        <h3 className="mb-3 font-semibold">Wi-Fi</h3>
        <div className="grid gap-2">
          <input className={inputCls} placeholder="SSID" value={values.wifiSsid} onChange={(e) => onChange("wifiSsid", e.target.value)} />
          <input className={inputCls} placeholder="Contraseña" value={values.wifiPassword} onChange={(e) => onChange("wifiPassword", e.target.value)} />
          <select className={inputCls} value={values.wifiSecurity} onChange={(e) => setValues((prev) => ({ ...prev, wifiSecurity: e.target.value as QrFormValues["wifiSecurity"] }))}>
            <option value="WPA">WPA</option>
            <option value="WEP">WEP</option>
            <option value="nopass">Sin contraseña</option>
          </select>
        </div>
      </section>
    );
  if (type === "vcard")
    return (
      <MultiInputs
        title="Tarjeta vCard"
        fields={[
          { key: "vcardName", label: "Nombre", value: values.vcardName },
          { key: "vcardOrg", label: "Empresa", value: values.vcardOrg },
          { key: "vcardTitle", label: "Cargo", value: values.vcardTitle },
          { key: "vcardPhone", label: "Teléfono", value: values.vcardPhone },
          { key: "vcardEmail", label: "Correo", value: values.vcardEmail },
          { key: "vcardWebsite", label: "Web", value: values.vcardWebsite }
        ]}
        onChange={onChange}
      />
    );
  if (type === "event")
    return (
      <MultiInputs
        title="Evento"
        fields={[
          { key: "eventTitle", label: "Título", value: values.eventTitle },
          { key: "eventLocation", label: "Ubicación", value: values.eventLocation },
          { key: "eventStart", label: "Inicio (AAAA-MM-DDTHH:mm)", value: values.eventStart },
          { key: "eventEnd", label: "Fin (AAAA-MM-DDTHH:mm)", value: values.eventEnd },
          { key: "eventDescription", label: "Descripción", value: values.eventDescription }
        ]}
        onChange={onChange}
      />
    );

  const map: Record<string, keyof QrFormValues> = {
    pdf: "pdfUrl",
    app: "appUrl",
    images: "imageUrl",
    video: "videoUrl",
    social: "socialUrl",
    barcode2d: "barcode2dText"
  };
  const explanationMap: Partial<Record<QrType, string>> = {
    pdf: "Pega la URL directa del archivo PDF que quieres abrir al escanear.",
    app: "Pega el enlace de tu app (App Store, Google Play o landing de descarga).",
    images: "Pega la URL de la imagen o galería que quieres mostrar.",
    video: "Pega la URL del video (YouTube, Vimeo u otro enlace público).",
    social: "Pega la URL de tu perfil o página de red social.",
    barcode2d: "Introduce el texto o identificador que quieras codificar como código de barras 2D."
  };
  const key = map[type];
  return <SingleInput title="Contenido" helperText={explanationMap[type]} value={values[key]} onChange={(v) => onChange(key, v)} />;
}

function SingleInput({ title, helperText, value, onChange }: { title: string; helperText?: string; value: string; onChange: (value: string) => void }) {
  return (
    <section className="rounded-2xl border border-slate-200 p-4">
      <h3 className="mb-3 font-semibold">{title}</h3>
      {helperText ? <p className="mb-2 text-xs text-slate-600">{helperText}</p> : null}
      <input className="w-full rounded-lg border border-slate-300 p-2" value={value} onChange={(e) => onChange(e.target.value)} />
    </section>
  );
}

function MultiInputs({
  title,
  fields,
  onChange
}: {
  title: string;
  fields: Array<{ key: keyof QrFormValues; label: string; value: string }>;
  onChange: (key: keyof QrFormValues, value: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 p-4">
      <h3 className="mb-3 font-semibold">{title}</h3>
      <div className="grid gap-2">
        {fields.map((field) => (
          <input
            key={field.key}
            className="w-full rounded-lg border border-slate-300 p-2"
            placeholder={field.label}
            value={field.value}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        ))}
      </div>
    </section>
  );
}

function InfoAyuda({ texto }: { texto: string }) {
  return (
    <span className="tooltip-ayuda">
      <button type="button" className="boton-ayuda" aria-label="Mostrar información">
        ?
      </button>
      <span className="contenido-tooltip">{texto}</span>
    </span>
  );
}
