import type { BraceletEntry, GearSlot } from './types'

export const MATRIX_COLUMNS = [
  'Weapon Damage Boost %',
  'Combat Speed %',
  'Damage Boost %',
  'Critical Damage Boost %',
  'Double Chance %',
  'Attack Increase %',
  'Perfect Chance %',
  'Move Speed %',
  'Multi-hit Chance %',
  'Front Attack',
  'Critical Attack',
] as const

export const GEAR_SLOTS: GearSlot[] = [
  {
    id: 'greatsword',
    label: 'Greatsword',
    note: 'Weapons',
    search: 'greatsword weapons',
    matrix: [
      {
        tier: 'S+',
        isUnique: false,
      },
      {
        tier: 'S+',
        isUnique: false,
      },
      {
        tier: 'S+',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'A+',
        isUnique: false,
      },
      {
        tier: 'A',
        isUnique: false,
      },
      {
        tier: 'A',
        isUnique: false,
      },
    ],
    pve: [
      [
        {
          label: 'Weapon Damage Boost %',
          key: 'greatsword|Weapon Damage Boost %',
          tone: 'top',
        },
        {
          label: 'Combat Speed %',
          key: 'greatsword|Combat Speed %',
          tone: 'top',
        },
        {
          label: 'Damage Boost %',
          key: 'greatsword|Damage Boost %',
          tone: 'top',
        },
      ],
      [
        {
          label: 'Multi-hit Chance %',
          key: 'greatsword|Multi-hit Chance %',
          tone: 'aplus',
        },
      ],
      [
        {
          label: 'Might',
          key: 'greatsword|Might',
          tone: 'flat',
        },
        {
          label: 'Precision',
          key: 'greatsword|Precision',
          tone: 'flat',
        },
        {
          label: 'Attack',
          key: 'greatsword|Attack',
          tone: 'flat',
        },
        {
          label: 'Accuracy',
          key: 'greatsword|Accuracy',
          tone: 'flat',
        },
        {
          label: 'Critical Hit',
          key: 'greatsword|Critical Hit',
          tone: 'flat',
        },
        {
          label: 'Front Attack',
          key: 'greatsword|Front Attack',
          tone: 'flat',
        },
        {
          label: 'Critical Attack',
          key: 'greatsword|Critical Attack',
          tone: 'flat',
        },
      ],
    ],
    pvp: [
      [
        {
          label: 'Status Effect Chance %',
          key: 'greatsword|Status Effect Chance %',
          tone: 'pvp',
        },
      ],
    ],
    exclusive: [],
  },
  {
    id: 'guard',
    label: 'Guard',
    note: 'Subhand',
    search: 'guard subhand',
    matrix: [
      {
        tier: 'S+',
        isUnique: false,
      },
      {
        tier: 'S+',
        isUnique: false,
      },
      {
        tier: 'S+',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'A+',
        isUnique: false,
      },
      {
        tier: 'A',
        isUnique: false,
      },
      {
        tier: 'A',
        isUnique: false,
      },
    ],
    pve: [
      [
        {
          label: 'Weapon Damage Boost %',
          key: 'guard|Weapon Damage Boost %',
          tone: 'top',
        },
        {
          label: 'Combat Speed %',
          key: 'guard|Combat Speed %',
          tone: 'top',
        },
        {
          label: 'Damage Boost %',
          key: 'guard|Damage Boost %',
          tone: 'top',
        },
      ],
      [
        {
          label: 'Multi-hit Chance %',
          key: 'guard|Multi-hit Chance %',
          tone: 'aplus',
        },
      ],
      [
        {
          label: 'Might',
          key: 'guard|Might',
          tone: 'flat',
        },
        {
          label: 'Precision',
          key: 'guard|Precision',
          tone: 'flat',
        },
        {
          label: 'Attack',
          key: 'guard|Attack',
          tone: 'flat',
        },
        {
          label: 'Accuracy',
          key: 'guard|Accuracy',
          tone: 'flat',
        },
        {
          label: 'Critical Hit',
          key: 'guard|Critical Hit',
          tone: 'flat',
        },
        {
          label: 'Front Attack',
          key: 'guard|Front Attack',
          tone: 'flat',
        },
        {
          label: 'Critical Attack',
          key: 'guard|Critical Attack',
          tone: 'flat',
        },
      ],
    ],
    pvp: [
      [
        {
          label: 'Status Effect Chance %',
          key: 'guard|Status Effect Chance %',
          tone: 'pvp',
        },
      ],
    ],
    exclusive: [],
  },
  {
    id: 'helmet',
    label: 'Helmet',
    note: 'Helm',
    search: 'helmet helm',
    matrix: [
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'S',
        isUnique: false,
      },
      {
        tier: 'S',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
    ],
    pve: [
      [
        {
          label: 'Double Chance %',
          key: 'helmet|Double Chance %',
          tone: 's',
        },
        {
          label: 'Attack Increase %',
          key: 'helmet|Attack Increase %',
          tone: 's',
        },
      ],
      [
        {
          label: 'Attack',
          key: 'helmet|Attack',
          tone: 'flat',
        },
        {
          label: 'Accuracy',
          key: 'helmet|Accuracy',
          tone: 'flat',
        },
        {
          label: 'Critical Hit',
          key: 'helmet|Critical Hit',
          tone: 'flat',
        },
        {
          label: 'Block',
          key: 'helmet|Block',
          tone: 'flat',
        },
        {
          label: 'HP',
          key: 'helmet|HP',
          tone: 'flat',
        },
      ],
    ],
    pvp: [
      [
        {
          label: 'Status Effect Resist %',
          key: 'helmet|Status Effect Resist %',
          tone: 'pvp',
        },
      ],
      [
        {
          label: 'Perfect Resist %',
          key: 'helmet|Perfect Resist %',
          tone: 'pvp',
        },
      ],
      [
        {
          label: 'Critical Hit Resist',
          key: 'helmet|Critical Hit Resist',
          tone: 'pvp',
        },
        {
          label: 'Evasion',
          key: 'helmet|Evasion',
          tone: 'pvp',
        },
      ],
    ],
    exclusive: [
      {
        label: 'Incoming Heal %',
        key: 'helmet|Incoming Heal %',
        tone: 'unique',
      },
    ],
  },
  {
    id: 'pauldrons',
    label: 'Pauldrons',
    note: 'Shoulder',
    search: 'pauldrons shoulder',
    matrix: [
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'S+',
        isUnique: true,
      },
      {
        tier: 'S',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
    ],
    pve: [
      [
        {
          label: 'Critical Damage Boost %',
          key: 'pauldrons|Critical Damage Boost %',
          tone: 'unique',
        },
      ],
      [
        {
          label: 'Double Chance %',
          key: 'pauldrons|Double Chance %',
          tone: 's',
        },
        {
          label: 'Defense Increase %',
          key: 'pauldrons|Defense Increase %',
          tone: 'percent',
        },
      ],
      [
        {
          label: 'Attack',
          key: 'pauldrons|Attack',
          tone: 'flat',
        },
        {
          label: 'Accuracy',
          key: 'pauldrons|Accuracy',
          tone: 'flat',
        },
        {
          label: 'Critical Hit',
          key: 'pauldrons|Critical Hit',
          tone: 'flat',
        },
      ],
    ],
    pvp: [
      [
        {
          label: 'Status Effect Resist %',
          key: 'pauldrons|Status Effect Resist %',
          tone: 'pvp',
        },
      ],
      [
        {
          label: 'Perfect Resist %',
          key: 'pauldrons|Perfect Resist %',
          tone: 'pvp',
        },
      ],
      [
        {
          label: 'Critical Hit Resist',
          key: 'pauldrons|Critical Hit Resist',
          tone: 'pvp',
        },
        {
          label: 'Evasion',
          key: 'pauldrons|Evasion',
          tone: 'pvp',
        },
      ],
    ],
    exclusive: [
      {
        label: 'Critical Damage Boost %',
        key: 'pauldrons|Critical Damage Boost %',
        tone: 'unique',
      },
    ],
  },
  {
    id: 'chest',
    label: 'Chest',
    note: 'Top',
    search: 'chest top torso',
    matrix: [
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'S+',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'S',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
    ],
    pve: [
      [
        {
          label: 'Damage Boost %',
          key: 'chest|Damage Boost %',
          tone: 'top',
        },
      ],
      [
        {
          label: 'Perfect Chance %',
          key: 'chest|Perfect Chance %',
          tone: 's',
        },
        {
          label: 'Defense Increase %',
          key: 'chest|Defense Increase %',
          tone: 'percent',
        },
        {
          label: 'Regeneration %',
          key: 'chest|Regeneration %',
          tone: 'percent',
        },
      ],
      [
        {
          label: 'Attack',
          key: 'chest|Attack',
          tone: 'flat',
        },
        {
          label: 'Accuracy',
          key: 'chest|Accuracy',
          tone: 'flat',
        },
        {
          label: 'Critical Hit',
          key: 'chest|Critical Hit',
          tone: 'flat',
        },
      ],
    ],
    pvp: [
      [
        {
          label: 'Status Effect Resist %',
          key: 'chest|Status Effect Resist %',
          tone: 'pvp',
        },
      ],
      [
        {
          label: 'Double Resist %',
          key: 'chest|Double Resist %',
          tone: 'pvp',
        },
      ],
      [
        {
          label: 'Critical Hit Resist',
          key: 'chest|Critical Hit Resist',
          tone: 'pvp',
        },
        {
          label: 'Evasion',
          key: 'chest|Evasion',
          tone: 'pvp',
        },
      ],
    ],
    exclusive: [],
  },
  {
    id: 'belt',
    label: 'Belt',
    note: '',
    search: 'belt',
    matrix: [
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
    ],
    pve: [],
    pvp: [],
    exclusive: [],
  },
  {
    id: 'legs',
    label: 'Legs',
    note: 'Pants',
    search: 'legs pants',
    matrix: [
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'S',
        isUnique: false,
      },
      {
        tier: 'S',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
    ],
    pve: [
      [
        {
          label: 'Attack Increase %',
          key: 'legs|Attack Increase %',
          tone: 's',
        },
      ],
      [
        {
          label: 'Perfect Chance %',
          key: 'legs|Perfect Chance %',
          tone: 's',
        },
      ],
      [
        {
          label: 'Attack',
          key: 'legs|Attack',
          tone: 'flat',
        },
        {
          label: 'Accuracy',
          key: 'legs|Accuracy',
          tone: 'flat',
        },
        {
          label: 'Critical Hit',
          key: 'legs|Critical Hit',
          tone: 'flat',
        },
        {
          label: 'Block',
          key: 'legs|Block',
          tone: 'flat',
        },
        {
          label: 'HP',
          key: 'legs|HP',
          tone: 'flat',
        },
      ],
    ],
    pvp: [
      [
        {
          label: 'Status Effect Resist %',
          key: 'legs|Status Effect Resist %',
          tone: 'pvp',
        },
      ],
      [
        {
          label: 'Double Resist %',
          key: 'legs|Double Resist %',
          tone: 'pvp',
        },
        {
          label: 'Multi-hit Resist %',
          key: 'legs|Multi-hit Resist %',
          tone: 'pvp',
        },
      ],
      [
        {
          label: 'Critical Hit Resist',
          key: 'legs|Critical Hit Resist',
          tone: 'pvp',
        },
        {
          label: 'Evasion',
          key: 'legs|Evasion',
          tone: 'pvp',
        },
      ],
    ],
    exclusive: [
      {
        label: 'Damage Tolerance %',
        key: 'legs|Damage Tolerance %',
        tone: 'unique',
      },
    ],
  },
  {
    id: 'gloves',
    label: 'Gloves',
    note: 'Gloves',
    search: 'gloves',
    matrix: [
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'S+',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'S',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
    ],
    pve: [
      [
        {
          label: 'Combat Speed %',
          key: 'gloves|Combat Speed %',
          tone: 'top',
        },
      ],
      [
        {
          label: 'Perfect Chance %',
          key: 'gloves|Perfect Chance %',
          tone: 's',
        },
        {
          label: 'Endurance Penetration %',
          key: 'gloves|Endurance Penetration %',
          tone: 'percent',
        },
        {
          label: 'Regeneration %',
          key: 'gloves|Regeneration %',
          tone: 'percent',
        },
      ],
      [
        {
          label: 'Attack',
          key: 'gloves|Attack',
          tone: 'flat',
        },
        {
          label: 'Accuracy',
          key: 'gloves|Accuracy',
          tone: 'flat',
        },
        {
          label: 'Critical Hit',
          key: 'gloves|Critical Hit',
          tone: 'flat',
        },
      ],
    ],
    pvp: [
      [
        {
          label: 'Status Effect Resist %',
          key: 'gloves|Status Effect Resist %',
          tone: 'pvp',
        },
      ],
      [
        {
          label: 'Multi-hit Resist %',
          key: 'gloves|Multi-hit Resist %',
          tone: 'pvp',
        },
      ],
      [
        {
          label: 'Critical Hit Resist',
          key: 'gloves|Critical Hit Resist',
          tone: 'pvp',
        },
        {
          label: 'Evasion',
          key: 'gloves|Evasion',
          tone: 'pvp',
        },
      ],
    ],
    exclusive: [],
  },
  {
    id: 'cloak',
    label: 'Cloak',
    note: 'Cape',
    search: 'cloak cape endurance penetration',
    matrix: [
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'S',
        isUnique: false,
      },
      {
        tier: 'S',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
    ],
    pve: [
      [
        {
          label: 'Double Chance %',
          key: 'cloak|Double Chance %',
          tone: 's',
        },
        {
          label: 'Attack Increase %',
          key: 'cloak|Attack Increase %',
          tone: 's',
        },
      ],
      [
        {
          label: 'Endurance Penetration %',
          key: 'cloak|Endurance Penetration %',
          tone: 'percent',
        },
        {
          label: 'Weapon Damage Tolerance %',
          key: 'cloak|Weapon Damage Tolerance %',
          tone: 'percent',
        },
      ],
      [
        {
          label: 'Attack',
          key: 'cloak|Attack',
          tone: 'flat',
        },
        {
          label: 'Accuracy',
          key: 'cloak|Accuracy',
          tone: 'flat',
        },
        {
          label: 'Critical Hit',
          key: 'cloak|Critical Hit',
          tone: 'flat',
        },
        {
          label: 'Critical Damage Defense',
          key: 'cloak|Critical Damage Defense',
          tone: 'flat',
        },
      ],
    ],
    pvp: [
      [
        {
          label: 'Status Effect Resist %',
          key: 'cloak|Status Effect Resist %',
          tone: 'pvp',
        },
      ],
      [
        {
          label: 'Critical Hit Resist',
          key: 'cloak|Critical Hit Resist',
          tone: 'pvp',
        },
        {
          label: 'Evasion',
          key: 'cloak|Evasion',
          tone: 'pvp',
        },
      ],
    ],
    exclusive: [
      {
        label: 'Critical Damage Tolerance %',
        key: 'cloak|Critical Damage Tolerance %',
        tone: 'unique',
      },
    ],
  },
  {
    id: 'shoes',
    label: 'Shoes',
    note: 'Boots',
    search: 'shoes boots',
    matrix: [
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'S',
        isUnique: false,
      },
      {
        tier: 'S+',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
    ],
    pve: [
      [
        {
          label: 'Move Speed %',
          key: 'shoes|Move Speed %',
          tone: 'top',
        },
      ],
      [
        {
          label: 'Perfect Chance %',
          key: 'shoes|Perfect Chance %',
          tone: 's',
        },
        {
          label: 'Endurance Penetration %',
          key: 'shoes|Endurance Penetration %',
          tone: 'percent',
        },
        {
          label: 'Regeneration %',
          key: 'shoes|Regeneration %',
          tone: 'percent',
        },
      ],
      [
        {
          label: 'Attack',
          key: 'shoes|Attack',
          tone: 'flat',
        },
        {
          label: 'Accuracy',
          key: 'shoes|Accuracy',
          tone: 'flat',
        },
        {
          label: 'Critical Hit',
          key: 'shoes|Critical Hit',
          tone: 'flat',
        },
      ],
    ],
    pvp: [
      [
        {
          label: 'Status Effect Resist %',
          key: 'shoes|Status Effect Resist %',
          tone: 'pvp',
        },
      ],
      [
        {
          label: 'Perfect Resist %',
          key: 'shoes|Perfect Resist %',
          tone: 'pvp',
        },
      ],
      [
        {
          label: 'Critical Hit Resist',
          key: 'shoes|Critical Hit Resist',
          tone: 'pvp',
        },
        {
          label: 'Evasion',
          key: 'shoes|Evasion',
          tone: 'pvp',
        },
      ],
    ],
    exclusive: [],
  },
  {
    id: 'earring-1',
    label: 'Earring 1',
    note: 'Accessory',
    search: 'earrings earring earring 1',
    matrix: [
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'S+',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
    ],
    pve: [
      [
        {
          label: 'Move Speed %',
          key: 'earring-1|Move Speed %',
          tone: 'top',
        },
      ],
      [
        {
          label: 'Might',
          key: 'earring-1|Might',
          tone: 'flat',
        },
        {
          label: 'Precision',
          key: 'earring-1|Precision',
          tone: 'flat',
        },
        {
          label: 'Attack',
          key: 'earring-1|Attack',
          tone: 'flat',
        },
        {
          label: 'Accuracy',
          key: 'earring-1|Accuracy',
          tone: 'flat',
        },
        {
          label: 'Critical Hit',
          key: 'earring-1|Critical Hit',
          tone: 'flat',
        },
        {
          label: 'Flight Power',
          key: 'earring-1|Flight Power',
          tone: 'flat',
        },
      ],
    ],
    pvp: [
      [
        {
          label: 'Critical Hit Resist',
          key: 'earring-1|Critical Hit Resist',
          tone: 'pvp',
        },
        {
          label: 'Evasion',
          key: 'earring-1|Evasion',
          tone: 'pvp',
        },
      ],
    ],
    exclusive: [],
  },
  {
    id: 'earring-2',
    label: 'Earring 2',
    note: 'Accessory',
    search: 'earrings earring earring 2',
    matrix: [
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'S+',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
    ],
    pve: [
      [
        {
          label: 'Move Speed %',
          key: 'earring-2|Move Speed %',
          tone: 'top',
        },
      ],
      [
        {
          label: 'Might',
          key: 'earring-2|Might',
          tone: 'flat',
        },
        {
          label: 'Precision',
          key: 'earring-2|Precision',
          tone: 'flat',
        },
        {
          label: 'Attack',
          key: 'earring-2|Attack',
          tone: 'flat',
        },
        {
          label: 'Accuracy',
          key: 'earring-2|Accuracy',
          tone: 'flat',
        },
        {
          label: 'Critical Hit',
          key: 'earring-2|Critical Hit',
          tone: 'flat',
        },
        {
          label: 'Flight Power',
          key: 'earring-2|Flight Power',
          tone: 'flat',
        },
      ],
    ],
    pvp: [
      [
        {
          label: 'Critical Hit Resist',
          key: 'earring-2|Critical Hit Resist',
          tone: 'pvp',
        },
        {
          label: 'Evasion',
          key: 'earring-2|Evasion',
          tone: 'pvp',
        },
      ],
    ],
    exclusive: [],
  },
  {
    id: 'necklace',
    label: 'Necklace',
    note: 'Accessory',
    search: 'necklace',
    matrix: [
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'S+',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
    ],
    pve: [
      [
        {
          label: 'Combat Speed %',
          key: 'necklace|Combat Speed %',
          tone: 'top',
        },
      ],
      [
        {
          label: 'Might',
          key: 'necklace|Might',
          tone: 'flat',
        },
        {
          label: 'Precision',
          key: 'necklace|Precision',
          tone: 'flat',
        },
        {
          label: 'Attack',
          key: 'necklace|Attack',
          tone: 'flat',
        },
        {
          label: 'Accuracy',
          key: 'necklace|Accuracy',
          tone: 'flat',
        },
        {
          label: 'Critical Hit',
          key: 'necklace|Critical Hit',
          tone: 'flat',
        },
        {
          label: 'Flight Power',
          key: 'necklace|Flight Power',
          tone: 'flat',
        },
      ],
    ],
    pvp: [
      [
        {
          label: 'Critical Hit Resist',
          key: 'necklace|Critical Hit Resist',
          tone: 'pvp',
        },
        {
          label: 'Evasion',
          key: 'necklace|Evasion',
          tone: 'pvp',
        },
      ],
    ],
    exclusive: [],
  },
  {
    id: 'amulet',
    label: 'Amulet',
    note: '',
    search: 'amulet',
    matrix: [
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
      {
        tier: null,
        isUnique: false,
      },
    ],
    pve: [],
    pvp: [],
    exclusive: [],
  },
  {
    id: 'ring-1',
    label: 'Ring 1',
    note: 'Accessory',
    search: 'rings ring ring 1',
    matrix: [
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
    ],
    pve: [
      [
        {
          label: 'Attack',
          key: 'ring-1|Attack',
          tone: 'flat',
        },
        {
          label: 'Accuracy',
          key: 'ring-1|Accuracy',
          tone: 'flat',
        },
        {
          label: 'Critical Hit',
          key: 'ring-1|Critical Hit',
          tone: 'flat',
        },
        {
          label: 'Might',
          key: 'ring-1|Might',
          tone: 'flat',
        },
        {
          label: 'Precision',
          key: 'ring-1|Precision',
          tone: 'flat',
        },
        {
          label: 'Flight Power',
          key: 'ring-1|Flight Power',
          tone: 'flat',
        },
      ],
    ],
    pvp: [
      [
        {
          label: 'Critical Hit Resist',
          key: 'ring-1|Critical Hit Resist',
          tone: 'pvp',
        },
        {
          label: 'Evasion',
          key: 'ring-1|Evasion',
          tone: 'pvp',
        },
      ],
    ],
    exclusive: [],
  },
  {
    id: 'ring-2',
    label: 'Ring 2',
    note: 'Accessory',
    search: 'rings ring ring 2',
    matrix: [
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
    ],
    pve: [
      [
        {
          label: 'Attack',
          key: 'ring-2|Attack',
          tone: 'flat',
        },
        {
          label: 'Accuracy',
          key: 'ring-2|Accuracy',
          tone: 'flat',
        },
        {
          label: 'Critical Hit',
          key: 'ring-2|Critical Hit',
          tone: 'flat',
        },
        {
          label: 'Might',
          key: 'ring-2|Might',
          tone: 'flat',
        },
        {
          label: 'Precision',
          key: 'ring-2|Precision',
          tone: 'flat',
        },
        {
          label: 'Flight Power',
          key: 'ring-2|Flight Power',
          tone: 'flat',
        },
      ],
    ],
    pvp: [
      [
        {
          label: 'Critical Hit Resist',
          key: 'ring-2|Critical Hit Resist',
          tone: 'pvp',
        },
        {
          label: 'Evasion',
          key: 'ring-2|Evasion',
          tone: 'pvp',
        },
      ],
    ],
    exclusive: [],
  },
  {
    id: 'bracelet',
    label: 'Bracelet',
    note: 'iLv 86 · 4 lines',
    search: 'bracelet',
    matrix: [
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
      {
        tier: 'X',
        isUnique: false,
      },
    ],
    pve: [
      [
        {
          label: 'Destruction',
          key: 'bracelet|Destruction',
          tone: 'unique',
        },
        {
          label: 'Wisdom',
          key: 'bracelet|Wisdom',
          tone: 'unique',
        },
        {
          label: 'Illusion',
          key: 'bracelet|Illusion',
          tone: 'unique',
        },
        {
          label: 'Time',
          key: 'bracelet|Time',
          tone: 'unique',
        },
      ],
    ],
    pvp: [],
    exclusive: [
      {
        label: 'Destruction',
        key: 'bracelet|Destruction',
        tone: 'unique',
      },
      {
        label: 'Wisdom',
        key: 'bracelet|Wisdom',
        tone: 'unique',
      },
      {
        label: 'Illusion',
        key: 'bracelet|Illusion',
        tone: 'unique',
      },
      {
        label: 'Time',
        key: 'bracelet|Time',
        tone: 'unique',
      },
      {
        label: 'Justice',
        key: 'bracelet|Justice',
        tone: 'unique',
      },
      {
        label: 'Freedom',
        key: 'bracelet|Freedom',
        tone: 'unique',
      },
      {
        label: 'Death',
        key: 'bracelet|Death',
        tone: 'unique',
      },
      {
        label: 'Destiny',
        key: 'bracelet|Destiny',
        tone: 'unique',
      },
      {
        label: 'Life',
        key: 'bracelet|Life',
        tone: 'unique',
      },
      {
        label: 'Space',
        key: 'bracelet|Space',
        tone: 'unique',
      },
    ],
  },
]

export const BRACELET_ENTRIES: BraceletEntry[] = [
  {
    tone: 'core',
    label: 'Destruction · Zikel',
    rank: 'S+',
  },
  {
    tone: 'core',
    label: 'Wisdom · Lumiel',
    rank: 'S+',
  },
  {
    tone: 'core',
    label: 'Illusion · Kaisinel',
    rank: 'S+',
  },
  {
    tone: 'core',
    label: 'Time · Siel',
    rank: 'S+',
  },
  {
    tone: 'optional',
    label: 'Justice · Nezekan',
    rank: 'S · thêm khi có chỗ / heroic / Legendary Stone',
  },
  {
    tone: 'optional',
    label: 'Freedom · Vaizel',
    rank: 'S điều kiện · heroic bracelet',
  },
  {
    tone: 'optional',
    label: 'Death · Triniel',
    rank: 'S điều kiện · heroic bracelet',
  },
  {
    tone: 'low',
    label: 'Destiny · Marchutan',
    rank: 'Không ưu tiên DPS',
  },
  {
    tone: 'low',
    label: 'Life · Yustiel',
    rank: 'Không ưu tiên DPS',
  },
  {
    tone: 'low',
    label: 'Space · Israphel',
    rank: 'Không ưu tiên DPS',
  },
]
