import type { OwnedLines, TabId } from './types'

export const OWNED_STORAGE_KEY = 'aion2.gladiator.gear-owned.v1'
export const TAB_STORAGE_KEY = 'aion2.gladiator.active-tab.v1'

export function isTabId(value: unknown): value is TabId {
  return value === 'dps' || value === 'basic' || value === 'bracelet'
}

export function parseOwnedLines(value: null | string): OwnedLines {
  if (!value) return {}
  try {
    const parsed: unknown = JSON.parse(value)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    const entries = Object.entries(parsed).filter((entry): entry is [string, boolean] => typeof entry[1] === 'boolean')
    const owned: OwnedLines = Object.fromEntries(entries)
    for (const [key, isOwned] of entries) {
      const nextKey = key
        .replace(/^earrings\|/, 'earring-1|')
        .replace(/^rings\|/, 'ring-1|')
        .replace(/\b(Attack|Defense) increase\b/g, '$1 Increase')
        .replace(/^(helmet|legs|cloak)\|Endurance$/, '$1|Endurance %')
      if (nextKey !== key) {
        if (!Object.hasOwn(owned, nextKey)) owned[nextKey] = isOwned
        delete owned[key]
      }
    }
    return owned
  } catch {
    // Invalid browser data starts a fresh checklist; never interpret it as item data.
    return {}
  }
}

export function readProgress() {
  try {
    const tab = localStorage.getItem(TAB_STORAGE_KEY)
    return {
      activeTab: isTabId(tab) ? tab : ('dps' as TabId),
      ownedLines: parseOwnedLines(localStorage.getItem(OWNED_STORAGE_KEY)),
    }
  } catch {
    // Restricted browser storage still permits a checklist for the current session.
    return { activeTab: 'dps' as TabId, ownedLines: {} as OwnedLines }
  }
}
