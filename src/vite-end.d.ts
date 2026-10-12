/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

// GitHub Spark runtime global, normally injected by the Spark host.
// Polyfilled for local dev/prod outside that runtime — see src/lib/spark-polyfill.ts.
interface SparkKV {
  get<T>(key: string): Promise<T | null>
  set(key: string, value: unknown): Promise<void>
  delete(key: string): Promise<void>
  keys(): Promise<string[]>
}

interface Spark {
  kv: SparkKV
}

declare let spark: Spark

interface Window {
  spark: Spark
}

// Chrome WebMCP Declarative API (Origin Trial) — ambient type augmentation.
// https://developer.chrome.com/docs/ai/webmcp/declarative-api
// These HTML attributes/events are harmless no-ops in unsupporting browsers.
declare namespace React {
  interface FormHTMLAttributes<T> {
    toolname?: string
    tooldescription?: string
    toolautosubmit?: boolean
  }
  interface InputHTMLAttributes<T> {
    toolparamdescription?: string
  }
  interface TextareaHTMLAttributes<T> {
    toolparamdescription?: string
  }
  interface SelectHTMLAttributes<T> {
    toolparamdescription?: string
  }
}

interface SubmitEvent {
  readonly agentInvoked?: boolean
  respondWith?(result: Promise<unknown>): void
}

interface ModelContextToolEvent extends Event {
  readonly toolName: string
}

interface ModelContextEventMap {
  toolactivated: ModelContextToolEvent
  toolcancel: ModelContextToolEvent
}

interface ModelContext extends EventTarget {
  addEventListener<K extends keyof ModelContextEventMap>(
    type: K,
    listener: (ev: ModelContextEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener<K extends keyof ModelContextEventMap>(
    type: K,
    listener: (ev: ModelContextEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void
}

interface Document {
  modelContext?: ModelContext
}