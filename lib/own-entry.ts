/** Route names are untrusted keys, including names inherited from Object.prototype. */
export function ownEntry<T>(entries: Record<string, T>, key: string): T | undefined {
  return Object.hasOwn(entries, key) ? entries[key] : undefined;
}
