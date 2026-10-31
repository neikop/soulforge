import { readFile } from 'node:fs/promises'

import { defaultSystem } from '@chakra-ui/react'

const MIN_TEXT_CONTRAST = 4.5
const MIN_UI_CONTRAST = 3
const { families, familyShades, neutral } = JSON.parse(
  await readFile(new URL('../src/components/theme/semantic-palettes.json', import.meta.url), 'utf8'),
)

const checks = []
const matrixPalette = JSON.parse(
  await readFile(new URL('../src/components/theme/matrix-palette.json', import.meta.url), 'utf8'),
)
for (const [mode, palette] of Object.entries(matrixPalette)) {
  for (const background of ['surface', 'hover']) {
    checks.push({
      foreground: token(
        `colors.${families.warning.palette}.${mode === 'dark' ? familyShades.fgDark : familyShades.fgLight}`,
      ),
      background: palette.top[background],
      label: `Unique / matrix.top.${background} (${mode})`,
      minimum: MIN_TEXT_CONTRAST,
    })
  }
  for (const name of ['top', 's', 'aplus', 'a', 'percent', 'pvp']) {
    const tone = palette[name]
    for (const background of ['surface', 'hover']) {
      checks.push({
        foreground: tone.fg,
        background: tone[background],
        label: `matrix.${name}.fg / ${background} (${mode})`,
        minimum: MIN_TEXT_CONTRAST,
      })
    }
    checks.push({
      foreground: tone.border,
      background: palette.panel,
      label: `matrix.${name}.border / panel (${mode})`,
      minimum: MIN_UI_CONTRAST,
    })
  }
  checks.push(
    {
      foreground: palette.text,
      background: palette.panel,
      label: `matrix.text / panel (${mode})`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      foreground: palette.muted,
      background: palette.panel,
      label: `matrix.muted / panel (${mode})`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      foreground: palette.focus,
      background: palette.panel,
      label: `matrix.focus / panel (${mode})`,
      minimum: MIN_UI_CONTRAST,
    },
  )
}

for (const [family, { border, palette, solid, solidHover }] of Object.entries(families)) {
  checks.push(
    {
      background: token(`colors.${palette}.${solid}`),
      foreground: token('colors.white'),
      label: `${family}.solid / ${family}.contrast`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: token(`colors.${palette}.${solidHover}`),
      foreground: token('colors.white'),
      label: `${family}.solidHover / ${family}.contrast`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: token(`colors.${neutral.bg.canvas.light}`),
      foreground: token(`colors.${palette}.${familyShades.fgLight}`),
      label: `${family}.main / bg.canvas (light)`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: token(`colors.${neutral.bg.canvas.dark}`),
      foreground: token(`colors.${palette}.${familyShades.fgDark}`),
      label: `${family}.main / bg.canvas (dark)`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: token(`colors.${neutral.bg.canvas.light}`),
      foreground: token(`colors.${palette}.${border}`),
      label: `${family}.border / bg.canvas (light)`,
      minimum: MIN_UI_CONTRAST,
    },
    {
      background: token(`colors.${neutral.bg.canvas.dark}`),
      foreground: token(`colors.${palette}.${familyShades.borderDark}`),
      label: `${family}.border / bg.canvas (dark)`,
      minimum: MIN_UI_CONTRAST,
    },
    {
      background: token(`colors.${palette}.${familyShades.subtleLight}`),
      foreground: token(`colors.${palette}.${familyShades.fgLight}`),
      label: `${family}.fg / ${family}.subtle (light)`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: token(`colors.${palette}.${familyShades.subtleDark}`),
      foreground: token(`colors.${palette}.${familyShades.fgDark}`),
      label: `${family}.fg / ${family}.subtle (dark)`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: token(`colors.${palette}.${familyShades.surfaceLight}`),
      foreground: token(`colors.${palette}.${familyShades.fgLight}`),
      label: `${family}.fg / ${family}.surface (light)`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: token(`colors.${palette}.${familyShades.surfaceDark}`),
      foreground: token(`colors.${palette}.${familyShades.fgDark}`),
      label: `${family}.fg / ${family}.surface (dark)`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: token(`colors.${palette}.${familyShades.surfaceLight}`),
      foreground: token(`colors.${palette}.${border}`),
      label: `${family}.border / ${family}.surface (light)`,
      minimum: MIN_UI_CONTRAST,
    },
    {
      background: token(`colors.${palette}.${familyShades.surfaceDark}`),
      foreground: token(`colors.${palette}.${familyShades.borderDark}`),
      label: `${family}.border / ${family}.surface (dark)`,
      minimum: MIN_UI_CONTRAST,
    },
  )
}

checks.push(
  {
    background: token(`colors.${neutral.bg.canvas.light}`),
    foreground: token(`colors.${neutral.fg.default.light}`),
    label: 'fg.default / bg.canvas (light)',
    minimum: MIN_TEXT_CONTRAST,
  },
  {
    background: token(`colors.${neutral.bg.canvas.dark}`),
    foreground: token(`colors.${neutral.fg.default.dark}`),
    label: 'fg.default / bg.canvas (dark)',
    minimum: MIN_TEXT_CONTRAST,
  },
  {
    background: token(`colors.${neutral.bg.canvas.light}`),
    foreground: token(`colors.${neutral.fg.subtle.light}`),
    label: 'fg.subtle / bg.canvas (light)',
    minimum: MIN_TEXT_CONTRAST,
  },
  {
    background: token(`colors.${neutral.bg.canvas.dark}`),
    foreground: token(`colors.${neutral.fg.subtle.dark}`),
    label: 'fg.subtle / bg.canvas (dark)',
    minimum: MIN_TEXT_CONTRAST,
  },
  {
    background: token(`colors.${neutral.bg.subtle.light}`),
    foreground: token(`colors.${neutral.fg.default.light}`),
    label: 'fg.default / bg.subtle (light)',
    minimum: MIN_TEXT_CONTRAST,
  },
  {
    background: token(`colors.${neutral.bg.subtle.dark}`),
    foreground: token(`colors.${neutral.fg.default.dark}`),
    label: 'fg.default / bg.subtle (dark)',
    minimum: MIN_TEXT_CONTRAST,
  },
)

const failures = checks
  .map((check) => ({ ...check, ratio: contrastRatio(check.foreground, check.background) }))
  .filter(({ minimum, ratio }) => ratio < minimum)

if (failures.length) {
  for (const { label, minimum, ratio } of failures) {
    console.error(`${label}: ${ratio.toFixed(2)}:1 (requires ${minimum}:1)`)
  }
  process.exitCode = 1
} else {
  console.log(`Theme contrast passed for ${checks.length} semantic text and UI-boundary pairs.`)
}

function token(path) {
  const value = defaultSystem.token(path)

  if (!value.startsWith('#')) {
    throw new Error(`Expected ${path} to resolve to a hex color, received ${value}`)
  }

  return value
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground)
  const backgroundLuminance = relativeLuminance(background)
  const lighter = Math.max(foregroundLuminance, backgroundLuminance)
  const darker = Math.min(foregroundLuminance, backgroundLuminance)

  return (lighter + 0.05) / (darker + 0.05)
}

function relativeLuminance(hexColor) {
  const channels = [1, 3, 5].map((index) => Number.parseInt(hexColor.slice(index, index + 2), 16) / 255)
  const [red = 0, green = 0, blue = 0] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}
