export const UTM_STORAGE_KEY = "tinder_gospel_tracking_v1";
export const CHECKOUT_ID = "9510d38c-d56d-4129-a6da-f44e56037753";
export const CHECKOUT_URL =
  "https://universal-checkout.vercel.app/checkout/9510d38c-d56d-4129-a6da-f44e56037753";
export const SUPORTE_URL =
  "https://wa.me/5519920069960?text=Ol%C3%A1!%20Preciso%20de%20ajuda%20com%20a%20comunidade%2C%20por%20favor.";

export const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "src",
  "sck",
  "xcod",
  "fbclid",
  "gclid",
] as const;

export type TrackingParams = Partial<Record<(typeof TRACKING_KEYS)[number], string>>;

export function readTrackingFromUrl(): TrackingParams {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search || "");
  const result: TrackingParams = {};
  TRACKING_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) result[key] = value;
  });
  return result;
}

export function readTrackingFromStorage(): TrackingParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as TrackingParams;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function persistTracking(data: TrackingParams) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

let trackingParams: TrackingParams = {};

export function bootstrapTrackingParams() {
  const fromStorage = readTrackingFromStorage();
  const fromUrl = readTrackingFromUrl();
  trackingParams = { ...fromStorage, ...fromUrl };
  persistTracking(trackingParams);
}

export function getTrackingParams() {
  return { ...trackingParams };
}

export function appendTrackingParams(
  url: string,
  extraParams: Record<string, string> = {}
) {
  try {
    const parsed = new URL(url, typeof window !== "undefined" ? window.location.origin : "https://localhost");
    TRACKING_KEYS.forEach((key) => {
      const value = trackingParams[key];
      if (!value) return;
      if (!parsed.searchParams.get(key)) {
        parsed.searchParams.set(key, value);
      }
    });
    Object.entries(extraParams).forEach(([key, value]) => {
      if (value) parsed.searchParams.set(key, String(value));
    });
    return parsed.toString();
  } catch {
    return url;
  }
}

export function normalizePhoneDigits(value: string) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.startsWith("55") && digits.length > 11 ? digits.slice(2) : digits;
}

export function sendInitiateCheckoutEvent(lead: { name?: string; email?: string; phone?: string } = {}) {
  const payload = {
    checkout_id: CHECKOUT_ID,
    description: "Comunidade Tinder Gospel",
    value: 19.9,
    currency: "BRL",
    customer_name: String(lead.name || ""),
    customer_email: String(lead.email || ""),
    customer_phone: normalizePhoneDigits(lead.phone || ""),
  };

  const w = window as Window & {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  };

  if (typeof w.fbq === "function") {
    w.fbq("track", "InitiateCheckout", {
      value: payload.value,
      currency: payload.currency,
      content_name: payload.description,
      content_ids: [payload.checkout_id],
    });
  }

  if (typeof w.gtag === "function") {
    w.gtag("event", "begin_checkout", {
      currency: payload.currency,
      value: payload.value,
      item_name: payload.description,
      item_id: payload.checkout_id,
    });
  }

  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({
    event: "initiate_checkout",
    ...payload,
  });
}
