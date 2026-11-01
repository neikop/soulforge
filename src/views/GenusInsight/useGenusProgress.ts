import { toaster } from 'components/ui'
import { useEffect, useState } from 'react'

import { GENUS_BOARDS, GENUS_LINE_KEYS, GENUS_ROWS } from './data'

type CompletedLines = Record<string, boolean>

const STORAGE_KEY = 'aion2.genus-insight.completed.v1'

function readCompletedLines(): CompletedLines {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}
    const parsed: unknown = JSON.parse(stored)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return Object.fromEntries(
      Object.entries(parsed).filter(([key, value]) => GENUS_LINE_KEYS.includes(key) && value === true),
    )
  } catch {
    // Invalid or unavailable browser storage starts an empty, usable checklist.
    return {}
  }
}

export function useGenusProgress() {
  const [completedLines, setCompletedLines] = useState(readCompletedLines)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedLines))
    } catch {
      toaster.create({
        id: 'genus-checklist-storage',
        type: 'warning',
        title: 'This browser cannot save Genus Insight progress.',
        description: 'Your progress will only last for this session.',
      })
    }
  }, [completedLines])

  function setLineCompleted(key: string, isCompleted: boolean) {
    setCompletedLines((previous) => {
      const next = { ...previous }
      if (isCompleted) next[key] = true
      else delete next[key]
      return next
    })
  }

  const completedCount = GENUS_LINE_KEYS.filter((key) => completedLines[key]).length
  const boardCounts = Object.fromEntries(
    GENUS_BOARDS.map((board) => [
      board.id,
      GENUS_ROWS.filter((row) => row.lines.some((line) => line.boardId === board.id && completedLines[line.key]))
        .length,
    ]),
  )

  return { boardCounts, completedCount, completedLines, setLineCompleted }
}
