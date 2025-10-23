/**
 * This lightweight stub is included so the app can register a service worker
 * in environments where `pnpm prepare` has not yet generated the official
 * MSW worker. For the full interception experience run `pnpm prepare` to
 * scaffold the production worker from MSW.
 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("message", (event) => {
  if (event.data?.type === "PING") {
    event.source?.postMessage({ type: "PONG" });
  }
});
self.addEventListener("fetch", () => {
  // Intentionally left blank – real interceptors are provided by MSW.
});
