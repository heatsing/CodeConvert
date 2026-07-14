export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://codeconvert.net").replace(/\/$/, "");

export const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-6NC8K1DFTQ";

export const siteLogoUrl = `${siteUrl}/codeconvert-logo.png`;

export const siteIconUrl = `${siteUrl}/android-chrome-512x512.png`;

export const siteOpenGraphLocale = "en_US";

export const siteOpenGraphAlternateLocales = [
  "pt_PT",
  "es_ES",
  "de_DE",
  "ru_RU",
  "fr_FR",
  "tr_TR",
  "pl_PL",
  "zh_CN",
  "zh_TW"
];

export const siteAvailableLanguages = [
  "English",
  "Portuguese",
  "Spanish",
  "German",
  "Russian",
  "French",
  "Turkish",
  "Polish",
  "Chinese"
];
