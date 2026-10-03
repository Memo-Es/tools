import { useEffect, useState } from 'react'

// Everything lives in localStorage for now. Swap these two functions
// for API calls when the app moves to a server.
export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or blocked; the app keeps working in memory.
  }
}

export function usePersisted<T>(key: string, fallback: () => T) {
  const [value, setValue] = useState<T>(() => {
    const initial = fallback()
    const stored = load<T | null>(key, null)
    if (stored === null) return initial
    return Array.isArray(initial) ? stored : { ...initial, ...stored }
  })
  useEffect(() => save(key, value), [key, value])
  return [value, setValue] as const
}
