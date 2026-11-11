import { decodeHTML } from "entities";

// Text codecs return text only: decoded markup is never inserted into the DOM.
export function encodeBase64Text(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...Array.from(bytes.subarray(offset, offset + 8192)));
  }
  return btoa(binary);
}

export function decodeHtmlEntities(value: string) {
  // HTML5 named references and decimal/hexadecimal numeric references, one pass.
  return decodeHTML(value);
}

export function decodeUrlText(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    throw new Error("Invalid URL-encoded input. Check percent escapes and UTF-8 byte sequences.");
  }
}

export function unixSecondsToIso(value: string) {
  const text = value.trim();
  if (!/^-?\d+$/.test(text)) throw new Error("Enter a whole Unix timestamp in seconds, such as 0 or 1709164800.");
  const seconds = Number(text);
  if (!Number.isSafeInteger(seconds) || Math.abs(seconds) > 8_640_000_000_000) {
    throw new Error("This Unix timestamp is outside the supported date range.");
  }
  return new Date(seconds * 1000).toISOString();
}

export function dateToUnixSeconds(value: string) {
  const text = value.trim();
  const parts = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:\d{2}))?$/.exec(text);
  if (!parts) throw new Error("Enter YYYY-MM-DD (UTC) or an ISO date and time with Z or an explicit offset, such as 2024-02-29T12:30:00+08:00.");
  const [, yearText, monthText, dayText, hourText, minuteText, secondText, , zone] = parts;
  const year = Number(yearText), month = Number(monthText), day = Number(dayText);
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month < 1 || month > 12 || day < 1 || day > days[month - 1]) throw new Error("Enter a valid calendar date; the month or day does not exist.");
  if (Number(hourText ?? 0) > 23 || Number(minuteText ?? 0) > 59 || Number(secondText ?? 0) > 59) {
    throw new Error("Enter a valid time (hours 00–23 and minutes/seconds 00–59).");
  }
  if (zone && zone !== "Z" && (Number(zone.slice(1, 3)) > 23 || Number(zone.slice(4, 6)) > 59)) {
    throw new Error("Enter a valid timezone offset.");
  }
  const milliseconds = Date.parse(zone ? text : `${text}T00:00:00Z`);
  if (!Number.isFinite(milliseconds)) throw new Error("This date is outside the supported range.");
  return String(Math.floor(milliseconds / 1000));
}
