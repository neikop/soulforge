export type MatrixTier = 'A' | 'A+' | 'S' | 'S+' | 'X'
export type StatTone = 'a' | 'aplus' | 'pvp' | 's' | 'top'
export type TabId = 'basic' | 'bracelet' | 'dps'

export type StatLine = {
  category: 'attack' | 'defense'
  isUnique: boolean
  key: string
  label: string
  tone: StatTone
}

export type StatGroups = [StatLine[], StatLine[], StatLine[], StatLine[]]

export type GearSlot = {
  id: string
  label: string
  lines: StatGroups
  matrix: { isUnique: boolean; tier: MatrixTier | null }[]
  note: string
  search: string
}

export type BraceletEntry = {
  label: string
  rank: string
  tone: 'core' | 'low' | 'optional'
}

export type OwnedLines = Record<string, boolean>
