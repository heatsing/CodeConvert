"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { analyticsAllowed, analyticsConsentEvent, analyticsConsentKey, readAnalyticsConsent, refreshAnalyticsConsent, saveAnalyticsConsent } from "@/lib/analytics-privacy";
import { gaMeasurementId } from "@/lib/site";

const labels = {
  EN: ["Optional analytics", "Enable analytics", "Disable analytics", "Enabled", "Disabled", "Your browser privacy signal keeps analytics disabled.", "Your browser could not save this preference. Analytics remains disabled."],
  PT: ["Análise opcional", "Ativar análise", "Desativar análise", "Ativada", "Desativada", "O sinal de privacidade do navegador mantém a análise desativada.", "O navegador não salvou a preferência. A análise permanece desativada."],
  ES: ["Analítica opcional", "Activar analítica", "Desactivar analítica", "Activada", "Desactivada", "La señal de privacidad del navegador mantiene la analítica desactivada.", "El navegador no pudo guardar la preferencia. La analítica permanece desactivada."],
  DE: ["Optionale Analyse", "Analyse aktivieren", "Analyse deaktivieren", "Aktiviert", "Deaktiviert", "Das Datenschutzsignal deines Browsers deaktiviert die Analyse.", "Dein Browser konnte die Einstellung nicht speichern. Die Analyse bleibt deaktiviert."],
  RU: ["Необязательная аналитика", "Включить аналитику", "Отключить аналитику", "Включена", "Отключена", "Сигнал конфиденциальности браузера отключает аналитику.", "Браузер не сохранил настройку. Аналитика остаётся отключённой."],
  FR: ["Analyse facultative", "Activer l'analyse", "Désactiver l'analyse", "Activée", "Désactivée", "Le signal de confidentialité du navigateur désactive l'analyse.", "Le navigateur n'a pas enregistré ce choix. L'analyse reste désactivée."],
  TR: ["İsteğe bağlı analiz", "Analizi etkinleştir", "Analizi devre dışı bırak", "Etkin", "Devre dışı", "Tarayıcı gizlilik sinyali analizi kapalı tutar.", "Tarayıcı tercihi kaydedemedi. Analiz kapalı kalır."],
  PL: ["Opcjonalna analityka", "Włącz analitykę", "Wyłącz analitykę", "Włączona", "Wyłączona", "Sygnał prywatności przeglądarki wyłącza analitykę.", "Przeglądarka nie zapisała ustawienia. Analityka pozostaje wyłączona."],
  CN: ["可选访问统计", "开启统计", "关闭统计", "已开启", "已关闭", "浏览器隐私信号已禁用统计。", "浏览器无法保存设置，统计保持关闭。"],
  TW: ["選用訪問統計", "開啟統計", "關閉統計", "已開啟", "已關閉", "瀏覽器隱私訊號已停用統計。", "瀏覽器無法儲存設定，統計保持關閉。"]
};

export function AnalyticsSettings() {
  const { language } = useI18n();
  const copy = labels[language];
  const [enabled, setEnabled] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const update = (event?: Event) => {
      if (event?.type === "storage") {
        const key = (event as StorageEvent).key;
        if (key !== null && key !== analyticsConsentKey) return;
        refreshAnalyticsConsent();
      }
      setBlocked(!analyticsAllowed("granted", navigator));
      setEnabled(analyticsAllowed(readAnalyticsConsent(), navigator));
    };
    update();
    window.addEventListener("storage", update);
    return () => window.removeEventListener("storage", update);
  }, []);

  function changeConsent(allow: boolean) {
    const persisted = saveAnalyticsConsent(allow ? "granted" : "denied");
    // Enabling needs persistence; refusing never depends on storage availability.
    const enabledNow = allow && persisted;
    if (allow && !persisted) saveAnalyticsConsent("denied");
    setError(!persisted);
    setEnabled(enabledNow);
    window.dispatchEvent(new Event(analyticsConsentEvent));
    if (!enabledNow) {
      (window as unknown as Record<string, unknown>)[`ga-disable-${gaMeasurementId}`] = true;
      // Remove GA cookies on the current host and its possible parent domains.
      try {
        const parts = window.location.hostname.split(".");
        for (const item of document.cookie.split(";")) {
          const name = item.trim().split("=")[0];
          if (name !== "_ga" && !name.startsWith("_ga_")) continue;
          document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
          for (let index = 0; index < parts.length - 1; index++) {
            document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${parts.slice(index).join(".")}; SameSite=Lax`;
          }
        }
      } catch {
        // The browser may block cookie access; the opt-out still takes effect.
      }
      // Unload third-party code rather than merely hiding its script element.
      if (persisted) window.location.reload();
    }
  }

  if (!gaMeasurementId) return null;
  return (
    <section className="mt-8 rounded-md border p-4" aria-labelledby="analytics-settings-title">
      <h2 id="analytics-settings-title" className="text-xl font-bold">{copy[0]}</h2>
      <p className="mt-2" role="status">{blocked ? copy[5] : enabled ? copy[3] : copy[4]}</p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="button" onClick={() => changeConsent(true)} disabled={blocked || enabled} className="rounded border px-4 py-2 disabled:opacity-50">{copy[1]}</button>
        <button type="button" onClick={() => changeConsent(false)} className="rounded border px-4 py-2">{copy[2]}</button>
      </div>
      {error && <p role="alert" className="mt-2 text-red-700">{copy[6]}</p>}
    </section>
  );
}
