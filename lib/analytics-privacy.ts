export const analyticsConsentKey = "codetools-analytics-consent";
export const analyticsConsentEvent = "codetools-analytics-consent-change";
let sessionPreference: string | undefined;

export function saveAnalyticsConsent(preference: "granted" | "denied") {
  sessionPreference = preference;
  try {
    window.localStorage.setItem(analyticsConsentKey, preference);
    return true;
  } catch {
    // A refusal still applies to the current tab when browser storage is blocked.
    return false;
  }
}

export function refreshAnalyticsConsent() {
  sessionPreference = undefined;
}

export function analyticsAllowed(preference: string | null, signals: { doNotTrack?: string | null; globalPrivacyControl?: boolean }) {
  return preference === "granted" && signals.doNotTrack !== "1" && signals.doNotTrack !== "yes" && signals.globalPrivacyControl !== true;
}

export function analyticsPageDetails(href: string, referrer: string) {
  const page = new URL(href);
  let referringOrigin = "";
  try {
    const source = new URL(referrer);
    if (source.protocol === "https:" || source.protocol === "http:") referringOrigin = source.origin;
  } catch {
    // Direct visits have no referrer.
  }
  return { page_location: `${page.origin}${page.pathname}`, page_referrer: referringOrigin };
}

export function readAnalyticsConsent() {
  if (sessionPreference !== undefined) return sessionPreference;
  try {
    return window.localStorage.getItem(analyticsConsentKey);
  } catch {
    return null;
  }
}
