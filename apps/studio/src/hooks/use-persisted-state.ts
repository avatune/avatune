import { useCallback, useState } from 'react'

const STORAGE_KEY = 'avatune-studio-state'

interface PersistedState<T> {
  value: T
  setValue: (updater: T | ((prev: T) => T)) => void
  clear: () => void
}

export function usePersistedState<T>(
  key: string,
  defaultValue: T,
  serialize: (value: T) => string = JSON.stringify,
  deserialize: (raw: string) => T = JSON.parse,
): PersistedState<T> {
  const storageKey = `${STORAGE_KEY}:${key}`

  const [value, setValueRaw] = useState<T>(() => {
    try {
      const stored = sessionStorage.getItem(storageKey)
      if (stored) return deserialize(stored)
    } catch {
      // ignore
    }
    return defaultValue
  })

  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValueRaw((prev) => {
        const next =
          typeof updater === 'function'
            ? (updater as (prev: T) => T)(prev)
            : updater
        try {
          sessionStorage.setItem(storageKey, serialize(next))
        } catch {
          // ignore quota errors
        }
        return next
      })
    },
    [storageKey, serialize],
  )

  const clear = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey)
    } catch {
      // ignore
    }
  }, [storageKey])

  return { value, setValue, clear }
}
