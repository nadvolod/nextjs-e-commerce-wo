import { useCallback, useEffect, useRef, useState } from 'react';

// Simple key-value hook backed by localStorage
// API compatible with the previous @github/spark/hooks useKV
export function useKV<T>(key: string, initialValue: T) {
  const readInitial = () => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = window.localStorage.getItem(key);
      return raw != null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const [value, setValue] = useState<T>(readInitial);

  // Tracks the latest value outside of React's state so a synchronous write
  // can resolve functional updaters correctly even across multiple calls in
  // the same tick, without waiting for a render.
  const latestRef = useRef(value);
  latestRef.current = value;

  // Writes through to localStorage immediately in this call (not deferred
  // into a React state updater or effect) so the value is persisted even if
  // this component unmounts in the same commit as the update — e.g.
  // navigating away right after calling the setter, before React would
  // otherwise get a chance to run the updater function or the effect below.
  const setValueAndPersist = useCallback((updater: T | ((prev: T) => T)) => {
    const next = typeof updater === 'function'
      ? (updater as (prev: T) => T)(latestRef.current)
      : updater;
    latestRef.current = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // ignore write errors
    }
    setValue(next);
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write errors
    }
  }, [key, value]);

  return [value, setValueAndPersist] as const;
}
