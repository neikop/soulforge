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
    lines: [
      [
        {
          label: 'Weapon Damage Boost %',
          key: 'greatsword|Weapon Damage Boost %',
          tone: 'top',
          isUnique: false,
          category: 'attack',
        },
        {
          label: 'Combat Speed %',
          key: 'greatsword|Combat Speed %',
          tone: 'top',
          isUnique: false,
          category: 'attack',
        },
        {
          label: 'Damage Boost %',
          key: 'greatsword|Damage Boost %',
          tone: 'top',
          isUnique: false,
          category: 'attack',
        },
      ],
      [
        {
          label: 'Multi-hit Chance %',
          key: 'greatsword|Multi-hit Chance %',
          tone: 's',
          isUnique: false,
          category: 'attack',
        },
      ],
      [],
      [
        {
          label: 'Status Effect Chance %',
          key: 'greatsword|Status Effect Chance %',
          tone: 'pvp',
          isUnique: false,
          category: 'attack',
        },
      ],
    ],
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
    lines: [
      [
        {
          label: 'Weapon Damage Boost %',
          key: 'guard|Weapon Damage Boost %',
          tone: 'top',
          isUnique: false,
          category: 'attack',
        },
        {
          label: 'Combat Speed %',
          key: 'guard|Combat Speed %',
          tone: 'top',
          isUnique: false,
          category: 'attack',
        },
        {
          label: 'Damage Boost %',
          key: 'guard|Damage Boost %',
          tone: 'top',
          isUnique: false,
          category: 'attack',
        },
      ],
      [
        {
          label: 'Multi-hit Chance %',
          key: 'guard|Multi-hit Chance %',
          tone: 's',
          isUnique: false,
          category: 'attack',
        },
      ],
      [],
      [
        {
          label: 'Status Effect Chance %',
          key: 'guard|Status Effect Chance %',
          tone: 'pvp',
          isUnique: false,
          category: 'attack',
        },
      ],
    ],
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
    lines: [
      [
        {
          label: 'Incoming Heal %',
          key: 'helmet|Incoming Heal %',
          tone: 'top',
          isUnique: true,
          category: 'defense',
        },
      ],
      [
        {
          label: 'Double Chance %',
          key: 'helmet|Double Chance %',
          tone: 's',
          isUnique: false,
          category: 'attack',
        },
        {
          label: 'Attack Increase %',
          key: 'helmet|Attack Increase %',
          tone: 's',
          isUnique: false,
          category: 'attack',
        },
      ],
      [
        {
          label: 'Endurance %',
          key: 'helmet|Endurance %',
          tone: 'aplus',
          isUnique: false,
          category: 'defense',
        },
      ],
      [
        {
          label: 'Status Effect Resist %',
          key: 'helmet|Status Effect Resist %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
        {
          label: 'Perfect Resist %',
          key: 'helmet|Perfect Resist %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
        {
          label: 'Weapon Damage Tolerance %',
          key: 'helmet|Weapon Damage Tolerance %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
      ],
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
    lines: [
      [
        {
          label: 'Critical Damage Boost %',
          key: 'pauldrons|Critical Damage Boost %',
          tone: 'top',
          isUnique: true,
          category: 'attack',
        },
      ],
      [
        {
          label: 'Double Chance %',
          key: 'pauldrons|Double Chance %',
          tone: 's',
          isUnique: false,
          category: 'attack',
        },
      ],
      [
        {
          label: 'Defense Increase %',
          key: 'pauldrons|Defense Increase %',
          tone: 'aplus',
          isUnique: false,
          category: 'defense',
        },
        {
          label: 'Regeneration %',
          key: 'pauldrons|Regeneration %',
          tone: 'aplus',
          isUnique: false,
          category: 'defense',
        },
      ],
      [
        {
          label: 'Status Effect Resist %',
          key: 'pauldrons|Status Effect Resist %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
        {
          label: 'Endurance Penetration %',
          key: 'pauldrons|Endurance Penetration %',
          tone: 'pvp',
          isUnique: false,
          category: 'attack',
        },
        {
          label: 'Perfect Resist %',
          key: 'pauldrons|Perfect Resist %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
      ],
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
    lines: [
      [
        {
          label: 'Damage Boost %',
          key: 'chest|Damage Boost %',
          tone: 'top',
          isUnique: false,
          category: 'attack',
        },
      ],
      [
        {
          label: 'Perfect Chance %',
          key: 'chest|Perfect Chance %',
          tone: 's',
          isUnique: false,
          category: 'attack',
        },
      ],
      [
        {
          label: 'Defense Increase %',
          key: 'chest|Defense Increase %',
          tone: 'aplus',
          isUnique: false,
          category: 'defense',
        },
        {
          label: 'Regeneration %',
          key: 'chest|Regeneration %',
          tone: 'aplus',
          isUnique: false,
          category: 'defense',
        },
      ],
      [
        {
          label: 'Status Effect Resist %',
          key: 'chest|Status Effect Resist %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
        {
          label: 'Double Resist %',
          key: 'chest|Double Resist %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
        {
          label: 'Weapon Damage Tolerance %',
          key: 'chest|Weapon Damage Tolerance %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
      ],
    ],
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
    lines: [[], [], [], []],
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
    lines: [
      [
        {
          label: 'Damage Tolerance %',
          key: 'legs|Damage Tolerance %',
          tone: 'top',
          isUnique: true,
          category: 'defense',
        },
      ],
      [
        {
          label: 'Attack Increase %',
          key: 'legs|Attack Increase %',
          tone: 's',
          isUnique: false,
          category: 'attack',
        },
        {
          label: 'Perfect Chance %',
          key: 'legs|Perfect Chance %',
          tone: 's',
          isUnique: false,
          category: 'attack',
        },
      ],
      [
        {
          label: 'Endurance %',
          key: 'legs|Endurance %',
          tone: 'aplus',
          isUnique: false,
          category: 'defense',
        },
      ],
      [
        {
          label: 'Status Effect Resist %',
          key: 'legs|Status Effect Resist %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
        {
          label: 'Double Resist %',
          key: 'legs|Double Resist %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
        {
          label: 'Multi-hit Resist %',
          key: 'legs|Multi-hit Resist %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
      ],
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
    lines: [
      [
        {
          label: 'Combat Speed %',
          key: 'gloves|Combat Speed %',
          tone: 'top',
          isUnique: false,
          category: 'attack',
        },
      ],
      [
        {
          label: 'Perfect Chance %',
          key: 'gloves|Perfect Chance %',
          tone: 's',
          isUnique: false,
          category: 'attack',
        },
      ],
      [
        {
          label: 'Defense Increase %',
          key: 'gloves|Defense Increase %',
          tone: 'aplus',
          isUnique: false,
          category: 'defense',
        },
        {
          label: 'Regeneration %',
          key: 'gloves|Regeneration %',
          tone: 'aplus',
          isUnique: false,
          category: 'defense',
        },
      ],
      [
        {
          label: 'Status Effect Resist %',
          key: 'gloves|Status Effect Resist %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
        {
          label: 'Endurance Penetration %',
          key: 'gloves|Endurance Penetration %',
          tone: 'pvp',
          isUnique: false,
          category: 'attack',
        },
        {
          label: 'Multi-hit Resist %',
          key: 'gloves|Multi-hit Resist %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
      ],
    ],
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
    lines: [
      [
        {
          label: 'Critical Damage Tolerance %',
          key: 'cloak|Critical Damage Tolerance %',
          tone: 'top',
          isUnique: true,
          category: 'defense',
        },
      ],
      [
        {
          label: 'Double Chance %',
          key: 'cloak|Double Chance %',
          tone: 's',
          isUnique: false,
          category: 'attack',
        },
        {
          label: 'Attack Increase %',
          key: 'cloak|Attack Increase %',
          tone: 's',
          isUnique: false,
          category: 'attack',
        },
      ],
      [
        {
          label: 'Endurance %',
          key: 'cloak|Endurance %',
          tone: 'aplus',
          isUnique: false,
          category: 'defense',
        },
      ],
      [
        {
          label: 'Status Effect Resist %',
          key: 'cloak|Status Effect Resist %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
        {
          label: 'Endurance Penetration %',
          key: 'cloak|Endurance Penetration %',
          tone: 'pvp',
          isUnique: false,
          category: 'attack',
        },
        {
          label: 'Weapon Damage Tolerance %',
          key: 'cloak|Weapon Damage Tolerance %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
      ],
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
    lines: [
      [
        {
          label: 'Move Speed %',
          key: 'shoes|Move Speed %',
          tone: 'top',
          isUnique: false,
          category: 'attack',
        },
      ],
      [
        {
          label: 'Perfect Chance %',
          key: 'shoes|Perfect Chance %',
          tone: 's',
          isUnique: false,
          category: 'attack',
        },
      ],
      [
        {
          label: 'Defense Increase %',
          key: 'shoes|Defense Increase %',
          tone: 'aplus',
          isUnique: false,
          category: 'defense',
        },
        {
          label: 'Regeneration %',
          key: 'shoes|Regeneration %',
          tone: 'aplus',
          isUnique: false,
          category: 'defense',
        },
      ],
      [
        {
          label: 'Status Effect Resist %',
          key: 'shoes|Status Effect Resist %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
        {
          label: 'Endurance Penetration %',
          key: 'shoes|Endurance Penetration %',
          tone: 'pvp',
          isUnique: false,
          category: 'attack',
        },
        {
          label: 'Perfect Resist %',
          key: 'shoes|Perfect Resist %',
          tone: 'pvp',
          isUnique: false,
          category: 'defense',
        },
      ],
    ],
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
    lines: [
      [
        {
          label: 'Move Speed %',
          key: 'earring-1|Move Speed %',
          tone: 'top',
          isUnique: false,
          category: 'attack',
        },
      ],
      [],
      [],
      [],
    ],
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
    lines: [
      [
        {
          label: 'Move Speed %',
          key: 'earring-2|Move Speed %',
          tone: 'top',
          isUnique: false,
          category: 'attack',
        },
      ],
      [],
      [],
      [],
    ],
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
    lines: [
      [
        {
          label: 'Combat Speed %',
          key: 'necklace|Combat Speed %',
          tone: 'top',
          isUnique: false,
          category: 'attack',
        },
      ],
      [],
      [],
      [],
    ],
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
    lines: [[], [], [], []],
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
    lines: [[], [], [], []],
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
    lines: [[], [], [], []],
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
    lines: [[], [], [], []],
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
