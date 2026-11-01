import { defineSemanticTokens, defineTextStyles } from '@chakra-ui/react'

import palette from './matrix-palette.json'

const modeColor = (light: string, dark: string) => ({ value: { _light: light, _dark: dark } })
const tone = (name: 'a' | 'aplus' | 'percent' | 'pvp' | 's' | 'top') => ({
  fg: modeColor(palette.light[name].fg, palette.dark[name].fg),
  surface: modeColor(palette.light[name].surface, palette.dark[name].surface),
  border: modeColor(palette.light[name].border, palette.dark[name].border),
  hover: modeColor(palette.light[name].hover, palette.dark[name].hover),
})

export const matrixColors = defineSemanticTokens.colors({
  matrix: {
    top: tone('top'),
    s: tone('s'),
    aplus: tone('aplus'),
    a: tone('a'),
    percent: tone('percent'),
    pvp: tone('pvp'),
  },
})

export const matrixTextStyles = defineTextStyles({
  matrixHeader: { value: { fontSize: 'xs', lineHeight: 'meta', fontWeight: 'mid' } },
  matrixNote: { value: { fontSize: 'xs', lineHeight: 'meta', fontWeight: 'normal' } },
  matrixPill: { value: { fontSize: 'xs', lineHeight: 'meta', fontWeight: 'mid' } },
  matrixSlot: { value: { fontSize: 'sm', lineHeight: 'body', fontWeight: 'bold' } },
  matrixTier: { value: { fontSize: 'sm', lineHeight: 'body', fontWeight: 'bold' } },
})
