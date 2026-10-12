// Polyfills window.spark.kv with a localStorage-backed store when the app
// is run outside the GitHub Spark runtime (e.g. plain `npm run dev`), where
// window.spark is never injected. api-backend.ts depends on this global for
// persistence; without it, API initialization throws and auth breaks.
// No-op if window.spark already exists (e.g. inside the real Spark runtime).
if (typeof window !== 'undefined' && typeof window.spark === 'undefined') {
  window.spark = {
    kv: {
      get: async <T,>(key: string): Promise<T | null> => {
        try {
          const raw = window.localStorage.getItem(key);
          return raw != null ? (JSON.parse(raw) as T) : null;
        } catch {
          return null;
        }
      },
      set: async (key: string, value: unknown): Promise<void> => {
        try {
          window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
          // ignore write errors
        }
      },
      delete: async (key: string): Promise<void> => {
        try {
          window.localStorage.removeItem(key);
        } catch {
          // ignore delete errors
        }
      },
      keys: async (): Promise<string[]> => Object.keys(window.localStorage),
    },
  };
}
