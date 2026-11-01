import { defineSemanticTokens } from '@chakra-ui/react'

import { matrixColors } from './matrixTokens'
import semanticPaletteConfig from './semantic-palettes.json'

type PaletteName = 'blue' | 'cyan' | 'gray' | 'green' | 'orange' | 'purple' | 'red'

type SemanticPaletteConfig = {
  border: string
  palette: PaletteName
  solid: string
  solidHover: string
}

type ModeColor = {
  dark: string
  light: string
}

const colorReference = (path: string) => (path.startsWith('#') ? path : `{colors.${path}}`)
const createModeColor = ({ dark, light }: ModeColor) => ({
  value: { _dark: colorReference(dark), _light: colorReference(light) },
})

const createSemanticPalette = ({ border, palette, solid, solidHover }: SemanticPaletteConfig) => ({
  border: {
    value: {
      _dark: colorReference(`${palette}.${semanticPaletteConfig.familyShades.borderDark}`),
      _light: colorReference(`${palette}.${border}`),
    },
  },
  contrast: { value: '{colors.white}' },
  fg: createModeColor({
    dark: `${palette}.${semanticPaletteConfig.familyShades.fgDark}`,
    light: `${palette}.${semanticPaletteConfig.familyShades.fgLight}`,
  }),
  focusRing: {
    value: {
      _dark: colorReference(`${palette}.${semanticPaletteConfig.familyShades.borderDark}`),
      _light: colorReference(`${palette}.${border}`),
    },
  },
  main: createModeColor({
    dark: `${palette}.${semanticPaletteConfig.familyShades.fgDark}`,
    light: `${palette}.${semanticPaletteConfig.familyShades.fgLight}`,
  }),
  muted: createModeColor({
    dark: `${palette}.${semanticPaletteConfig.familyShades.mutedDark}`,
    light: `${palette}.${semanticPaletteConfig.familyShades.mutedLight}`,
  }),
  solid: { value: colorReference(`${palette}.${solid}`) },
  solidHover: { value: colorReference(`${palette}.${solidHover}`) },
  strong: createModeColor({
    dark: `${palette}.${semanticPaletteConfig.familyShades.strongDark}`,
    light: `${palette}.${semanticPaletteConfig.familyShades.strongLight}`,
  }),
  subtle: createModeColor({
    dark: `${palette}.${semanticPaletteConfig.familyShades.subtleDark}`,
    light: `${palette}.${semanticPaletteConfig.familyShades.subtleLight}`,
  }),
  surface: createModeColor({
    dark: `${palette}.${semanticPaletteConfig.familyShades.surfaceDark}`,
    light: `${palette}.${semanticPaletteConfig.familyShades.surfaceLight}`,
  }),
})

const semanticPalettes = Object.fromEntries(
  Object.entries(semanticPaletteConfig.families).map(([name, config]) => [
    name,
    createSemanticPalette(config as SemanticPaletteConfig),
  ]),
)

export const semanticTokens = defineSemanticTokens({
  colors: {
    ...matrixColors,
    bg: {
      page: createModeColor(semanticPaletteConfig.neutral.bg.page),
      canvas: createModeColor(semanticPaletteConfig.neutral.bg.canvas),
      elevated: createModeColor(semanticPaletteConfig.neutral.bg.elevated),
      hover: createModeColor(semanticPaletteConfig.neutral.bg.hover),
      muted: createModeColor(semanticPaletteConfig.neutral.bg.muted),
      overlay: createModeColor(semanticPaletteConfig.neutral.bg.overlay),
      subtle: createModeColor(semanticPaletteConfig.neutral.bg.subtle),
    },
    border: {
      control: createModeColor(semanticPaletteConfig.neutral.border.control),
      default: createModeColor(semanticPaletteConfig.neutral.border.default),
    },
    fg: {
      default: createModeColor(semanticPaletteConfig.neutral.fg.default),
      inverse: createModeColor(semanticPaletteConfig.neutral.fg.inverse),
      muted: createModeColor(semanticPaletteConfig.neutral.fg.muted),
      subtle: createModeColor(semanticPaletteConfig.neutral.fg.subtle),
    },
    ...semanticPalettes,
  },
})
