const cleanText = (value: string) => value.replace(/[\u0000-\u001f\u007f]/g, "").trim();

export const sanitizePlainText = (value: string) => cleanText(value);

export const sanitizePhone = (value: string) => value.replace(/[^\d+]/g, "").slice(0, 25);

export const sanitizeHttpUrl = (value: string): string => {
  const cleaned = cleanText(value);
  if (!cleaned) return "";

  try {
    const url = new URL(cleaned);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return url.toString();
  } catch {
    return "";
  }
};

export const sanitizeMail = (value: string) => cleanText(value).replace(/[^\w.!#$%&'*+/=?^`{|}~@-]/g, "");
