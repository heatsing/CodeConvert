import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";

async function availablePort() {
  const listener = createServer();
  await new Promise((resolve, reject) => {
    listener.once("error", reject);
    listener.listen(0, "127.0.0.1", resolve);
  });
  const { port } = listener.address();
  await new Promise((resolve, reject) => listener.close((error) => error ? reject(error) : resolve()));
  return port;
}

function startNode(args, env = process.env) {
  const child = spawn(process.execPath, args, { env, stdio: "inherit" });
  // Register before polling so a process that fails immediately is still observed.
  const ended = new Promise((resolve) => {
    child.once("error", (error) => resolve({ error }));
    child.once("exit", (code, signal) => resolve({ code, signal }));
  });
  return { child, ended };
}

async function stopProcess({ child, ended }) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([ended, delay(5000)]);
  if (child.exitCode === null && child.signalCode === null) {
    child.kill("SIGKILL");
    await ended;
  }
}

const port = await availablePort();
const baseUrl = `http://127.0.0.1:${port}`;
const server = startNode(["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)]);
let check;

try {
  const deadline = Date.now() + 60000;
  let ready = false;
  while (Date.now() < deadline) {
    const failed = await Promise.race([server.ended, delay(0).then(() => null)]);
    if (failed) throw new Error(`Production server exited before readiness: ${failed.error?.message ?? failed.code}`);
    try {
      const response = await fetch(baseUrl, { signal: AbortSignal.timeout(3000) });
      await response.body?.cancel();
      if (response.status === 200) {
        ready = true;
        break;
      }
    } catch {
      // Startup is asynchronous; retry until the bounded readiness deadline.
    }
    await delay(250);
  }
  if (!ready) throw new Error("Production server did not become ready within 60 seconds.");

  check = startNode(["scripts/check-live-seo.mjs"], { ...process.env, SEO_BASE_URL: baseUrl });
  let timeout;
  const result = await Promise.race([
    check.ended,
    new Promise((resolve) => { timeout = setTimeout(() => resolve({ error: new Error("Production smoke checks exceeded 120 seconds.") }), 120000); })
  ]);
  clearTimeout(timeout);
  if (result.error) throw result.error;
  if (result.code !== 0) throw new Error(`Production smoke checks failed (exit ${result.code}, signal ${result.signal ?? "none"}).`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (check) await stopProcess(check);
  await stopProcess(server);
}
