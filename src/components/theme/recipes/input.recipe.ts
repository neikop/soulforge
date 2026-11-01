import { defineRecipe } from '@chakra-ui/react'

export const inputRecipe = defineRecipe({
  base: {
    bg: 'bg.subtle',
    borderColor: 'border.control',
    borderRadius: 'sm',
    color: 'fg.default',
    '--error-color': '{colors.error.border}',
    _placeholder: { color: 'fg.muted' },
    _hover: { borderColor: 'primary.border' },
    _focusVisible: {
      borderColor: 'primary.focusRing',
      outlineColor: 'primary.focusRing',
      _invalid: { borderColor: 'error.border', outlineColor: 'error.border' },
    },
    _disabled: { cursor: 'not-allowed', _hover: { borderColor: 'border.control' } },
    _readOnly: { _hover: { borderColor: 'border.control' } },
  },
  variants: {
    variant: {
      outline: { bg: 'bg.subtle', borderColor: 'border.control' },
    },
    size: {
      lg: {
        '--input-height': 'sizes.control.lg',
        px: '4',
        textStyle: 'fieldLarge',
      },
      md: {
        '--input-height': 'sizes.control.md',
        px: '3',
        textStyle: 'field',
      },
      sm: {
        '--input-height': 'sizes.control.sm',
        px: '2.5',
        textStyle: 'field',
      },
    },
  },
})
