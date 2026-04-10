const KEY = "obenus-qr-history";

export interface HistoryItem {
  id: string;
  createdAt: string;
  type: string;
  payloadPreview: string;
}

export const saveHistory = (item: HistoryItem) => {
  if (typeof window === "undefined") return;
  const list = loadHistory();
  const next = [item, ...list].slice(0, 20);
  window.localStorage.setItem(KEY, JSON.stringify(next));
};

export const loadHistory = (): HistoryItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryItem[];
  } catch {
    return [];
  }
};
