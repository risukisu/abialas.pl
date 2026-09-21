/**
 * Build-time JSON GET over a bare `node:https` socket.
 *
 * Not the global `fetch`: Node's bundled undici keeps its socket in a
 * keep-alive pool that, on Windows, can still be half-open when the build
 * process tries to exit, tripping a libuv assertion ("Assertion failed:
 * !(handle->flags & UV_HANDLE_CLOSING)"). `agent: false` forces a one-off
 * socket that closes at response end — deterministic teardown. Same
 * reasoning as ContributionGraph.astro, which carries its own copy.
 */
import https from "node:https";

export function fetchJson<T = any>(
  url: string,
  timeoutMs: number,
  headers: Record<string, string> = {},
): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        agent: false,
        headers: { accept: "application/json", "user-agent": "abialas.pl-build", ...headers },
      },
      (res) => {
        const status = res.statusCode ?? 0;
        if (status < 200 || status >= 300) {
          res.resume(); // drain so the socket closes instead of dangling
          reject(new Error(String(status)));
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString("utf-8")));
          } catch (err) {
            reject(err);
          }
        });
        res.on("error", reject);
      },
    );
    req.setTimeout(timeoutMs, () => req.destroy(new Error("timeout")));
    req.on("error", reject);
  });
}
