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
      foreground: color(`${families.warning.palette}.${mode === 'dark' ? familyShades.fgDark : familyShades.fgLight}`),
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
      background: color(neutral.bg.canvas[mode]),
      label: `matrix.${name}.border / panel (${mode})`,
      minimum: MIN_UI_CONTRAST,
    })
  }
  for (const [surface, background] of Object.entries(neutral.bg).filter(([name]) => name !== 'overlay')) {
    for (const [role, foreground] of Object.entries(neutral.fg).filter(([role]) => role !== 'inverse')) {
      // Placeholder uses input surfaces; hover uses fg.muted, checked on every surface below.
      if (role === 'placeholder' && surface !== 'canvas' && surface !== 'subtle') continue
      checks.push({
        foreground: color(foreground[mode]),
        background: color(background[mode]),
        label: `fg.${role} / bg.${surface} (${mode})`,
        minimum: MIN_TEXT_CONTRAST,
      })
    }
    checks.push({
      foreground: color(
        `${families.primary.palette}.${mode === 'dark' ? familyShades.borderDark : families.primary.border}`,
      ),
      background: color(background[mode]),
      label: `primary.focusRing / bg.${surface} (${mode})`,
      minimum: MIN_UI_CONTRAST,
    })
  }
  checks.push({
    foreground: color(neutral.border.control[mode]),
    background: color(neutral.bg.subtle[mode]),
    label: `border.control / bg.subtle (${mode})`,
    minimum: MIN_UI_CONTRAST,
  })
}

for (const [family, { border, palette, solid, solidHover }] of Object.entries(families)) {
  checks.push(
    {
      background: color(`${palette}.${solid}`),
      foreground: color('white'),
      label: `${family}.solid / ${family}.contrast`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: color(`${palette}.${solidHover}`),
      foreground: color('white'),
      label: `${family}.solidHover / ${family}.contrast`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: color(`${neutral.bg.canvas.light}`),
      foreground: color(`${palette}.${familyShades.fgLight}`),
      label: `${family}.main / bg.canvas (light)`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: color(`${neutral.bg.canvas.dark}`),
      foreground: color(`${palette}.${familyShades.fgDark}`),
      label: `${family}.main / bg.canvas (dark)`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: color(`${neutral.bg.canvas.light}`),
      foreground: color(`${palette}.${border}`),
      label: `${family}.border / bg.canvas (light)`,
      minimum: MIN_UI_CONTRAST,
    },
    {
      background: color(`${neutral.bg.canvas.dark}`),
      foreground: color(`${palette}.${familyShades.borderDark}`),
      label: `${family}.border / bg.canvas (dark)`,
      minimum: MIN_UI_CONTRAST,
    },
    {
      background: color(`${palette}.${familyShades.subtleLight}`),
      foreground: color(`${palette}.${familyShades.fgLight}`),
      label: `${family}.fg / ${family}.subtle (light)`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: color(`${palette}.${familyShades.subtleDark}`),
      foreground: color(`${palette}.${familyShades.fgDark}`),
      label: `${family}.fg / ${family}.subtle (dark)`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: color(`${palette}.${familyShades.surfaceLight}`),
      foreground: color(`${palette}.${familyShades.fgLight}`),
      label: `${family}.fg / ${family}.surface (light)`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: color(`${palette}.${familyShades.surfaceDark}`),
      foreground: color(`${palette}.${familyShades.fgDark}`),
      label: `${family}.fg / ${family}.surface (dark)`,
      minimum: MIN_TEXT_CONTRAST,
    },
    {
      background: color(`${palette}.${familyShades.surfaceLight}`),
      foreground: color(`${palette}.${border}`),
      label: `${family}.border / ${family}.surface (light)`,
      minimum: MIN_UI_CONTRAST,
    },
    {
      background: color(`${palette}.${familyShades.surfaceDark}`),
      foreground: color(`${palette}.${familyShades.borderDark}`),
      label: `${family}.border / ${family}.surface (dark)`,
      minimum: MIN_UI_CONTRAST,
    },
  )
}

checks.push(
  {
    background: color(`${neutral.bg.canvas.light}`),
    foreground: color(`${neutral.fg.default.light}`),
    label: 'fg.default / bg.canvas (light)',
    minimum: MIN_TEXT_CONTRAST,
  },
  {
    background: color(`${neutral.bg.canvas.dark}`),
    foreground: color(`${neutral.fg.default.dark}`),
    label: 'fg.default / bg.canvas (dark)',
    minimum: MIN_TEXT_CONTRAST,
  },
  {
    background: color(`${neutral.bg.canvas.light}`),
    foreground: color(`${neutral.fg.subtle.light}`),
    label: 'fg.subtle / bg.canvas (light)',
    minimum: MIN_TEXT_CONTRAST,
  },
  {
    background: color(`${neutral.bg.canvas.dark}`),
    foreground: color(`${neutral.fg.subtle.dark}`),
    label: 'fg.subtle / bg.canvas (dark)',
    minimum: MIN_TEXT_CONTRAST,
  },
  {
    background: color(`${neutral.bg.subtle.light}`),
    foreground: color(`${neutral.fg.default.light}`),
    label: 'fg.default / bg.subtle (light)',
    minimum: MIN_TEXT_CONTRAST,
  },
  {
    background: color(`${neutral.bg.subtle.dark}`),
    foreground: color(`${neutral.fg.default.dark}`),
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

function color(path) {
  const value = path.startsWith('#') ? path : defaultSystem.token(`colors.${path}`)

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
