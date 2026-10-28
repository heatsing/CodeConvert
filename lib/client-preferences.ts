// Storage can be unavailable in private browsing, embedded pages, or when blocked.
// Preferences are optional: the current page must still work without persistence.
export function readPreference(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writePreference(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Keep the user's in-memory preference for this page.
  }
}
