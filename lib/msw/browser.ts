import { setupWorker } from "msw";
import { handlers } from "@/lib/msw/handlers";

export const worker = typeof window !== "undefined" ? setupWorker(...handlers) : undefined;

export async function initMockServiceWorker() {
  if (typeof window === "undefined" || !worker) return;
  if (worker.listHandlers().length === 0) {
    worker.use(...handlers);
  }
  try {
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    });
  } catch (error) {
    console.warn("MSW failed to start", error);
  }
}
