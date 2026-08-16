export type SafeRegexOperation = "match" | "groups" | "replace" | "split";

type SafeRegexRequest = {
  pattern: string;
  flags?: string;
  text: string;
  operation?: SafeRegexOperation;
  replacement?: string;
};

const maxPatternLength = 500;
const maxTextLength = 100_000;
const timeoutMs = 500;

export function parseRegexLiteral(value: string) {
  const literal = value.trim().match(/^\/([\s\S]*)\/([dgimsuvy]*)$/);
  return literal ? { pattern: literal[1], flags: literal[2] } : { pattern: value.trim(), flags: "" };
}

export function runSafeRegex({ pattern, flags = "", text, operation = "match", replacement = "" }: SafeRegexRequest) {
  if (pattern.length > maxPatternLength) return Promise.reject(new Error("Regular expressions must be 500 characters or fewer."));
  if (text.length > maxTextLength) return Promise.reject(new Error("Regex test text must be 100,000 characters or fewer."));

  const workerSource = `
    self.onmessage = ({ data }) => {
      try {
        const flags = data.flags.includes('g') ? data.flags : data.flags + 'g';
        const regex = new RegExp(data.pattern, flags);
        let result;
        if (data.operation === 'replace') result = data.text.replace(regex, data.replacement);
        else if (data.operation === 'split') result = data.text.split(regex).filter(Boolean).slice(0, 1000);
        else {
          const matches = [];
          for (const match of data.text.matchAll(regex)) {
            matches.push(data.operation === 'groups' ? Array.from(match) : match[0]);
            if (matches.length >= 1000) break;
            if (match[0] === '') regex.lastIndex += 1;
          }
          result = matches;
        }
        self.postMessage({ ok: true, result, regex: regex.toString() });
      } catch (error) {
        self.postMessage({ ok: false, error: error instanceof Error ? error.message : 'Invalid regular expression.' });
      }
    };
  `;
  const url = URL.createObjectURL(new Blob([workerSource], { type: "text/javascript" }));
  const worker = new Worker(url);

  return new Promise<{ result: string | string[] | string[][]; regex: string }>((resolve, reject) => {
    const cleanup = () => {
      worker.terminate();
      URL.revokeObjectURL(url);
    };
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("The regular expression took too long and was stopped."));
    }, timeoutMs);
    worker.onmessage = ({ data }) => {
      window.clearTimeout(timer);
      cleanup();
      if (data.ok) resolve({ result: data.result, regex: data.regex });
      else reject(new Error(data.error));
    };
    worker.onerror = () => {
      window.clearTimeout(timer);
      cleanup();
      reject(new Error("The regular expression worker could not run."));
    };
    worker.postMessage({ pattern, flags, text, operation, replacement });
  });
}
