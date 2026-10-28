"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { gaMeasurementId } from "@/lib/site";
import { analyticsAllowed, analyticsConsentEvent, analyticsConsentKey, analyticsPageDetails, readAnalyticsConsent, refreshAnalyticsConsent } from "@/lib/analytics-privacy";

type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

export function GoogleAnalytics() {
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const configured = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    const update = (event?: Event) => {
      if (event?.type === "storage") {
        const key = (event as StorageEvent).key;
        if (key !== null && key !== analyticsConsentKey) return;
        refreshAnalyticsConsent();
      }
      setAllowed(analyticsAllowed(readAnalyticsConsent(), navigator));
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener(analyticsConsentEvent, update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener(analyticsConsentEvent, update);
    };
  }, []);

  useEffect(() => {
    // Revocation also stops a tag that was already loaded in another tab.
    (window as unknown as Record<string, unknown>)[`ga-disable-${gaMeasurementId}`] = !allowed;
    if (!allowed || !ready || !gaMeasurementId) return;
    const analytics = window as AnalyticsWindow;
    analytics.dataLayer ??= [];
    analytics.gtag ??= function () { analytics.dataLayer!.push(arguments); };
    if (!configured.current) {
      analytics.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      analytics.gtag("js", new Date());
      analytics.gtag("config", gaMeasurementId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, ...analyticsPageDetails(window.location.href, document.referrer) });
      configured.current = true;
    }
    analytics.gtag("event", "page_view", { send_to: gaMeasurementId, ...analyticsPageDetails(window.location.href, document.referrer) });
  }, [allowed, ready, pathname]);

  if (!allowed || !gaMeasurementId) return null;

  return (
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`} strategy="afterInteractive" onReady={() => setReady(true)} />
  );
}
