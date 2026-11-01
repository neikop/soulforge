import { toaster } from 'components/ui'
import { useEffect, useState } from 'react'

import { petKey } from './mapLogic'
import {
  MAP_STORAGE_KEY,
  type MapPreferences,
  parseMapBackup,
  PET_STORAGE_KEY,
  readMapProgress,
  serializePetProgress,
} from './progress'

function readSaved() {
  return readMapProgress((key) => localStorage.getItem(key))
}

export function useMapProgress() {
  const [initial] = useState(readSaved)
  const [preferences, setPreferences] = useState(initial.preferences)
  const [completed, setCompleted] = useState(initial.completed)
  const [error, setError] = useState(initial.error)
  const [isBlocked, setBlocked] = useState(initial.blockedPets)
  const [isMapDirty, setMapDirty] = useState(false)
  const [isPetDirty, setPetDirty] = useState(false)

  useEffect(() => {
    if (!isMapDirty) return
    try {
      localStorage.setItem(MAP_STORAGE_KEY, JSON.stringify(preferences))
    } catch {
      toaster.create({
        id: 'map-storage',
        type: 'warning',
        title: 'Map settings cannot be saved in this browser.',
        description: 'Your changes will last for this session.',
      })
    }
  }, [preferences, isMapDirty])
  useEffect(() => {
    if (!isPetDirty || isBlocked) return
    try {
      localStorage.setItem(PET_STORAGE_KEY, serializePetProgress(completed))
    } catch {
      toaster.create({
        id: 'pet-storage',
        type: 'warning',
        title: 'Pet progress cannot be saved in this browser.',
        description: 'Export a backup before leaving this page.',
      })
    }
  }, [completed, isPetDirty, isBlocked])
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key && ![MAP_STORAGE_KEY, PET_STORAGE_KEY].includes(event.key)) return
      const saved = readSaved()
      setMapDirty(false)
      setPetDirty(false)
      setPreferences(saved.preferences)
      setCompleted(saved.completed)
      setBlocked(saved.blockedPets)
      setError(saved.error)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  function updatePreferences(update: (previous: MapPreferences) => MapPreferences) {
    setPreferences(update)
    setMapDirty(true)
  }
  function togglePet(name: string, done: boolean) {
    if (isBlocked) return
    setCompleted((previous) => {
      const next = { ...previous, ...(done ? { [petKey(name)]: name } : {}) }
      if (!done) delete next[petKey(name)]
      return next
    })
    setPetDirty(true)
  }
  function importProgress(raw: string) {
    const { preferences: nextPreferences, completed: pets } = parseMapBackup(raw)
    if (nextPreferences) updatePreferences(() => nextPreferences)
    setCompleted((previous) => ({ ...previous, ...pets }))
    setPetDirty(true)
    setBlocked(false)
    setError('')
    toaster.create({
      type: 'success',
      title: 'Progress imported.',
      description: `${Object.keys(pets).length} pet types merged into this browser.`,
    })
  }
  function exportProgress() {
    const json = JSON.stringify(
      { format: 'soulforge-map', version: 1, preferences, petProgress: JSON.parse(serializePetProgress(completed)) },
      null,
      2,
    )
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'soulforge-map-progress.json'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const profile = preferences.profiles.find((p) => p.id === preferences.profile) || {
    id: 'default',
    name: 'My character',
    done: [],
  }
  function toggleDone(id: string, done: boolean) {
    updatePreferences((previous) => ({
      ...previous,
      profiles: previous.profiles.map((p) =>
        p.id === previous.profile
          ? { ...p, done: done ? [...new Set([...p.done, id])] : p.done.filter((value) => value !== id) }
          : p,
      ),
    }))
  }
  return {
    preferences,
    completed,
    error,
    isBlocked,
    profile,
    updatePreferences,
    togglePet,
    toggleDone,
    importProgress,
    exportProgress,
  }
}
