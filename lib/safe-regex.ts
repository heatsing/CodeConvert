export type SafeRegexOperation = "match" | "groups" | "replace" | "split";

type SafeRegexRequest = {
  pattern: string;
  flags?: string;
  text: string;
  operation?: SafeRegexOperation;
  replacement?: string;
};

export function parseRegexLiteral(value: string) {
  const literal = value.trim().match(/^\/([\s\S]*)\/([dgimsuvy]*)$/);
  return literal ? { pattern: literal[1], flags: literal[2] } : { pattern: value.trim(), flags: "" };
}

// Exported so tests execute the exact browser worker program in an isolated worker thread.
export const regexWorkerSource = String.raw`
  self.onmessage = ({ data }) => {
    try {
      const flags = data.operation === 'replace' || data.operation === 'split' || data.flags.includes('g') ? data.flags : data.flags + 'g';
      const regex = new RegExp(data.pattern, flags);
      let result;
      const maxOutput = 500000;
      const maxMatches = 1000;
      if (data.operation === 'replace') {
        let outputLength = 0;
        let previousEnd = 0;
        result = data.text.replace(regex, (...args) => {
          const groups = typeof args.at(-1) === 'object' ? args.pop() : undefined;
          const input = args.pop();
          const offset = args.pop();
          const match = args[0];
          let replacementLength = data.replacement.length;
          const emit = (part, token) => {
            replacementLength += part.length - token.length;
            if (replacementLength > maxOutput) throw new Error('Replacement output is too large.');
            return part;
          };
          const replacement = data.replacement.replace(/\$([$&\x60']|\d{1,2}|<[^>]*>)/g, (token, name) => {
            if (name === '$') return emit('$', token);
            if (name === '&') return emit(match, token);
            if (name === String.fromCharCode(96)) return emit(input.slice(0, offset), token);
            if (name === "'") return emit(input.slice(offset + match.length), token);
            if (name.startsWith('<')) return groups ? emit(groups[name.slice(1, -1)] ?? '', token) : token;
            const capture = Number(name);
            if (capture > 0 && capture < args.length) return emit(args[capture] ?? '', token);
            if (name.length === 2 && Number(name[0]) > 0 && Number(name[0]) < args.length) return emit((args[Number(name[0])] ?? '') + name[1], token);
            return token;
          });
          outputLength += offset - previousEnd + replacement.length;
          previousEnd = offset + match.length;
          if (outputLength > maxOutput) throw new Error('Replacement output is too large. Use less text or a shorter replacement.');
          return replacement;
        });
        if (result.length > maxOutput) throw new Error('Replacement output is too large.');
      } else if (data.operation === 'split') {
        result = data.text.split(regex, maxMatches + 1);
        if (result.length > maxMatches) throw new Error('More than 1,000 split results. Use a smaller input.');
      } else {
        const matches = [];
        let outputLength = 0;
        for (const match of data.text.matchAll(regex)) {
          const item = data.operation === 'groups' ? Array.from(match, value => value ?? '') : match[0];
          outputLength += Array.isArray(item) ? item.reduce((length, value) => length + value.length, 0) : item.length;
          if (matches.length >= maxMatches || outputLength > maxOutput) throw new Error('Too many matches or too much output. Use a more specific expression.');
          matches.push(item);
        }
        result = matches;
      }
      self.postMessage({ ok: true, result, regex: regex.toString() });
    } catch (error) {
      self.postMessage({ ok: false, error: error instanceof Error ? error.message : 'Invalid regular expression.' });
    }
  };
`;

export function runSafeRegex({ pattern, flags = "", text, operation = "match", replacement = "" }: SafeRegexRequest) {
  if (pattern.length > 500) return Promise.reject(new Error("Regular expressions must be 500 characters or fewer."));
  if (text.length > 100_000) return Promise.reject(new Error("Regex test text must be 100,000 characters or fewer."));
  if (replacement.length > 10_000) return Promise.reject(new Error("Replacement text must be 10,000 characters or fewer."));
  return new Promise<{ result: string | string[] | string[][]; regex: string }>((resolve, reject) => {
    const url = URL.createObjectURL(new Blob([regexWorkerSource], { type: "text/javascript" }));
    let worker: Worker;
    try {
      worker = new Worker(url);
    } catch {
      URL.revokeObjectURL(url);
      reject(new Error("The regular expression worker is unavailable in this browser."));
      return;
    }
    const cleanup = () => {
      window.clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
    };
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("The regular expression took too long and was stopped."));
    }, 500);
    worker.onmessage = ({ data }) => {
      cleanup();
      if (data.ok) resolve({ result: data.result, regex: data.regex });
      else reject(new Error(data.error));
    };
    worker.onerror = () => {
      cleanup();
      reject(new Error("The regular expression worker could not run."));
    };
    try {
      worker.postMessage({ pattern, flags, text, operation, replacement });
    } catch {
      cleanup();
      reject(new Error("The regular expression request could not be sent."));
    }
  });
}
