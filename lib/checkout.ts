import {
  appendTrackingParams,
  CHECKOUT_URL,
  sendInitiateCheckoutEvent,
  SUPORTE_URL,
  normalizePhoneDigits,
} from "@/lib/tracking";

function tryOpenInNewTab(finalUrl: string) {
  let popup: Window | null = null;
  try {
    popup = window.open(finalUrl, "_blank", "noopener,noreferrer");
  } catch {
    popup = null;
  }
  if (popup && !popup.closed) {
    try {
      popup.opener = null;
    } catch {
      /* ignore */
    }
    try {
      popup.focus();
    } catch {
      /* ignore */
    }
    return true;
  }
  return false;
}

export function openExternalUrl(rawUrl: string) {
  const finalUrl = appendTrackingParams(rawUrl);
  const opened = tryOpenInNewTab(finalUrl);
  if (!opened) {
    window.location.assign(finalUrl);
  }
  return opened;
}

export function openCheckout(lead: { name?: string; email?: string; phone?: string } = {}) {
  sendInitiateCheckoutEvent(lead);
  const url = appendTrackingParams(CHECKOUT_URL, {
    customer_name: String(lead.name || "").trim(),
    customer_email: String(lead.email || "").trim().toLowerCase(),
    customer_phone: normalizePhoneDigits(lead.phone || ""),
  });
  return openExternalUrl(url);
}

export function openSupport() {
  return openExternalUrl(appendTrackingParams(SUPORTE_URL));
}
