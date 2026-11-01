import { defineSlotRecipe } from '@chakra-ui/react'
import { checkboxSlotRecipe } from '@chakra-ui/react/theme'

import { matrixToneStyles } from '../matrixStyles'

const defaultVariants = checkboxSlotRecipe.variants

if (!defaultVariants?.size || !defaultVariants.variant) {
  throw new Error('Chakra Checkbox recipe variants are unavailable')
}

export const checkboxRecipe = defineSlotRecipe({
  ...checkboxSlotRecipe,
  variants: {
    ...defaultVariants,
    size: defaultVariants.size,
    variant: {
      ...defaultVariants.variant,
      target: {
        root: {
          ...matrixToneStyles,
          alignItems: 'flex-start',
          bg: 'var(--tier-surface)',
          borderColor: 'var(--tier-border)',
          borderRadius: 'md',
          borderWidth: '1px',
          color: 'var(--tier-fg)',
          cursor: 'pointer',
          gap: 2,
          h: 'full',
          p: 3,
          w: 'full',
          _hover: { bg: 'var(--tier-hover)', borderColor: 'primary.border' },
          _active: { bg: 'var(--tier-hover)' },
          _checked: { borderColor: 'primary.border' },
          _focusWithin: { outline: '2px solid', outlineColor: 'primary.focusRing', outlineOffset: '2px' },
          _disabled: {
            cursor: 'not-allowed',
            _hover: { bg: 'var(--tier-surface)', borderColor: 'var(--tier-border)' },
          },
          _readOnly: {
            cursor: 'default',
            _hover: { bg: 'var(--tier-surface)', borderColor: 'var(--tier-border)' },
          },
        },
        control: {
          bg: 'transparent',
          borderColor: 'fg.muted',
          flexShrink: 0,
          _checked: { bg: 'primary.solid', borderColor: 'primary.border', color: 'primary.contrast' },
        },
        label: {
          cursor: 'inherit',
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          gap: 2,
          minW: 0,
          textStyle: 'actionCompact',
        },
      },
    },
  },
})
