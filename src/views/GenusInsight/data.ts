export const GENUS_TIERS = {
  'S+': { tone: 'top', label: 'Core DPS' },
  S: { tone: 's', label: 'Attack' },
  'A+': { tone: 'aplus', label: 'Accuracy / Crit' },
  A: { tone: 'a', label: 'HP / Defense' },
} as const

type StatTarget = {
  alternative?: string
  label: string
  tier: keyof typeof GENUS_TIERS
}

type GenusBoard = {
  damage: StatTarget
  defense: StatTarget
  id: string
  label: string
}

const PVE_DEFENSE: StatTarget = {
  label: 'PvE Damage Tolerance',
  alternative: 'Damage Tolerance / Endurance',
  tier: 'A',
}

export const GENUS_BOARDS: GenusBoard[] = [
  {
    id: 'cogni',
    label: 'Cogni',
    damage: {
      label: 'PvE Damage Boost',
      alternative: 'Damage Boost, or Critical Damage Boost at high Crit chance.',
      tier: 'S+',
    },
    defense: PVE_DEFENSE,
  },
  {
    id: 'fera',
    label: 'Fera',
    damage: {
      label: 'Weapon Damage Boost',
      alternative: 'High Damage Boost / PvE Damage Boost rolls also work.',
      tier: 'S+',
    },
    defense: PVE_DEFENSE,
  },
  {
    id: 'natura',
    label: 'Natura',
    damage: { label: 'PvE Damage Boost', tier: 'S+' },
    defense: { label: 'PvE Damage Tolerance', alternative: 'Endurance', tier: 'A' },
  },
  {
    id: 'varian',
    label: 'Varian',
    damage: {
      label: 'Front / Back Attack Damage Boost',
      alternative: 'Match your usual position. Use PvE Damage Boost if positioning is inconsistent.',
      tier: 'S+',
    },
    defense: { label: 'PvE Damage Tolerance', alternative: 'Endurance', tier: 'A' },
  },
  {
    id: 'special',
    label: 'Special',
    damage: { label: 'Double Chance', tier: 'S+' },
    defense: { label: 'Damage Tolerance', alternative: 'Endurance', tier: 'A' },
  },
]

const SLOT_DEFINITIONS = [
  { id: 1, priority: 2, guidance: 'Keep strong rolls at level 9, after Slot 4.' },
  { id: 2, priority: 5, guidance: 'Finish last.' },
  { id: 3, priority: 3, guidance: 'Finish after level 10.' },
  { id: 4, priority: 1, guidance: 'Lock first at level 9.' },
  { id: 5, priority: 2, guidance: 'Keep strong rolls at level 9, after Slot 4.' },
  { id: 6, priority: 3, guidance: 'Finish after level 10.' },
  { id: 7, priority: 4, guidance: 'Finish defense after DPS stats.' },
  { id: 8, priority: 5, guidance: 'Finish last.' },
  { id: 9, priority: 3, guidance: 'Finish after level 10.' },
] as const

const ATTACK_TARGET: StatTarget = {
  label: 'Max Attack',
  alternative: 'Alternative: Attack Bonus.',
  tier: 'S',
}

const ACCURACY_TARGET: StatTarget = {
  label: 'Accuracy / Critical Hit',
  alternative: 'Need Accuracy: Accuracy Bonus / PvE Accuracy. Enough Accuracy and Crit: Power Shard Damage Bonus.',
  tier: 'A+',
}

const HP_TARGET: StatTarget = { label: 'HP Increase %', tier: 'A' }

const COMMON_TARGETS = {
  1: ATTACK_TARGET,
  2: HP_TARGET,
  3: ACCURACY_TARGET,
  5: ATTACK_TARGET,
  6: ACCURACY_TARGET,
  8: HP_TARGET,
  9: ACCURACY_TARGET,
}

export const GENUS_ROWS = SLOT_DEFINITIONS.map((slot) => ({
  ...slot,
  lines: GENUS_BOARDS.map((board) => ({
    key: `${board.id}|${slot.id}`,
    boardId: board.id,
    boardLabel: board.label,
    ...(slot.id === 4 ? board.damage : slot.id === 7 ? board.defense : COMMON_TARGETS[slot.id]),
  })),
}))

export const GENUS_LINE_KEYS = GENUS_ROWS.flatMap((row) => row.lines.map((line) => line.key))
