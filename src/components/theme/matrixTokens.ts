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
    page: modeColor(palette.light.page, palette.dark.page),
    panel: modeColor(palette.light.panel, palette.dark.panel),
    panelEnd: modeColor(palette.light.panelEnd, palette.dark.panelEnd),
    text: modeColor(palette.light.text, palette.dark.text),
    muted: modeColor(palette.light.muted, palette.dark.muted),
    line: modeColor(palette.light.line, palette.dark.line),
    header: modeColor(palette.light.header, palette.dark.header),
    slot: modeColor(palette.light.slot, palette.dark.slot),
    field: modeColor(palette.light.field, palette.dark.field),
    control: modeColor(palette.light.control, palette.dark.control),
    controlHover: modeColor(palette.light.controlHover, palette.dark.controlHover),
    focus: modeColor(palette.light.focus, palette.dark.focus),
    selected: modeColor(palette.light.selected, palette.dark.selected),
    selectedText: { value: '{colors.white}' },
    glowStart: modeColor(palette.light.glowStart, palette.dark.glowStart),
    glowEnd: modeColor(palette.light.glowEnd, palette.dark.glowEnd),
    x: modeColor(palette.light.x, palette.dark.x),
    top: tone('top'),
    s: tone('s'),
    aplus: tone('aplus'),
    a: tone('a'),
    percent: tone('percent'),
    pvp: tone('pvp'),
  },
})

export const matrixTextStyles = defineTextStyles({
  matrixAction: { value: { fontSize: '14px', lineHeight: '22px', fontWeight: 'mid' } },
  matrixControlLabel: {
    value: {
      fontSize: '12px',
      lineHeight: '18px',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      fontWeight: 'normal',
    },
  },
  matrixHeader: { value: { fontSize: '10px', lineHeight: '11px', fontWeight: 'normal' } },
  matrixHeading: { value: { fontSize: '22px', lineHeight: '25.3px', letterSpacing: '-.02em', fontWeight: 'mid' } },
  matrixNote: { value: { fontSize: '11px', lineHeight: '17px', fontWeight: 'normal' } },
  matrixPill: { value: { fontSize: '11px', lineHeight: '13.2px', fontWeight: 'normal' } },
  matrixSlot: { value: { fontSize: '15px', lineHeight: '23.25px', fontWeight: 'mid' } },
  matrixTier: { value: { fontSize: '15px', lineHeight: '23.25px', fontWeight: 'mid' } },
})
