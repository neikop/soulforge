import { toaster } from 'components/ui'
import { useEffect, useState } from 'react'

import type { TabId } from './types'

import { OWNED_STORAGE_KEY, readProgress, TAB_STORAGE_KEY } from './progress'

export function useProgress() {
  const [progress, setProgress] = useState(readProgress)

  useEffect(() => {
    try {
      localStorage.setItem(OWNED_STORAGE_KEY, JSON.stringify(progress.ownedLines))
      localStorage.setItem(TAB_STORAGE_KEY, progress.activeTab)
    } catch {
      toaster.create({
        id: 'checklist-storage',
        type: 'warning',
        title: 'Trình duyệt không cho phép lưu tiến độ.',
        description: 'Các dấu tích hiện chỉ được giữ trong phiên đang mở.',
      })
    }
  }, [progress])

  function setActiveTab(activeTab: TabId) {
    setProgress((previous) => ({ ...previous, activeTab }))
  }

  function toggleOwned(key: string) {
    setProgress((previous) => {
      const ownedLines = { ...previous.ownedLines }
      if (ownedLines[key]) delete ownedLines[key]
      else ownedLines[key] = true
      return { ...previous, ownedLines }
    })
  }

  return { ...progress, setActiveTab, toggleOwned }
}
