import { defineLayerStyles } from '@chakra-ui/react'

import { mapStyles } from './mapStyles'
import { matrixToneStyles } from './matrixStyles'

export const layerStyles = defineLayerStyles({
  ...mapStyles,
  panel: {
    value: { bg: 'bg.canvas', borderWidth: '1px', borderRadius: 'lg' },
  },
  tableContainer: {
    value: {
      bg: 'bg.subtle',
      borderWidth: '1px',
      borderRadius: 'lg',
      minWidth: 0,
      overflowX: 'auto',
      _focusVisible: { outline: '2px solid', outlineColor: 'primary.focusRing', outlineOffset: '2px' },
      _print: { overflow: 'visible' },
    },
  },
  tierCard: {
    value: {
      ...matrixToneStyles,
      bg: 'var(--tier-surface)',
      borderColor: 'var(--tier-border)',
      borderWidth: '1px',
      borderRadius: 'md',
      color: 'var(--tier-fg)',
    },
  },
})
