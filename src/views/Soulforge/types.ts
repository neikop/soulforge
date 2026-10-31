export type MatrixTier = 'A' | 'A+' | 'S' | 'S+' | 'X'
export type StatTone = 'aplus' | 'flat' | 'percent' | 'pvp' | 's' | 'top' | 'unique'
export type TabId = 'basic' | 'bracelet' | 'dps'

export type StatLine = {
  key: string
  label: string
  tone: StatTone
}

export type GearSlot = {
  exclusive: StatLine[]
  id: string
  label: string
  matrix: { isUnique: boolean; tier: MatrixTier | null }[]
  note: string
  pve: StatLine[][]
  pvp: StatLine[][]
  search: string
}

export type BraceletEntry = {
  label: string
  rank: string
  tone: 'core' | 'low' | 'optional'
}

export type OwnedLines = Record<string, boolean>
