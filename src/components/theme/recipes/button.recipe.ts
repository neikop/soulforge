import { defineRecipe } from '@chakra-ui/react'

const ghostVariant = {
  _hover: {
    background: 'colorPalette.muted',
    color: 'colorPalette.fg',
  },
  background: 'transparent',
  borderColor: 'transparent',
  borderRadius: 'sm',
  borderWidth: 0,
  boxShadow: 'none',
  color: 'colorPalette.fg',
}

export const buttonRecipe = defineRecipe({
  base: {
    cursor: 'pointer',
    fontWeight: 'mid',
  },
  defaultVariants: {
    variant: 'subtle',
  },
  variants: {
    size: {
      lg: {
        _icon: {
          height: '4',
          width: '4',
        },
        gap: '2',
        h: 'control.lg',
        minW: 'control.lg',
        px: '4',
        textStyle: 'actionLarge',
      },
      md: {
        _icon: {
          height: '4',
          width: '4',
        },
        gap: '1.5',
        h: 'control.md',
        minW: 'control.md',
        px: '3.5',
        textStyle: 'action',
      },
      sm: {
        _icon: {
          height: '3.5',
          width: '3.5',
        },
        gap: '1',
        h: 'control.sm',
        minW: 'control.sm',
        px: '3',
        textStyle: 'action',
      },
      xs: {
        _icon: {
          height: '3.5',
          width: '3.5',
        },
        gap: '1',
        h: 'control.xs',
        minW: 'control.xs',
        px: '2.5',
        textStyle: 'actionCompact',
      },
    },
    variant: {
      ghost: ghostVariant,
      outline: {
        ...ghostVariant,
        _hover: {
          ...ghostVariant._hover,
          borderColor: 'colorPalette.border',
        },
        borderColor: 'colorPalette.border',
        borderWidth: 1,
      },
      solid: {
        _hover: {
          background: 'colorPalette.solidHover',
        },
        background: 'colorPalette.solid',
        borderColor: 'transparent',
        color: 'colorPalette.contrast',
      },
      subtle: {
        ...ghostVariant,
        background: 'colorPalette.subtle',
        color: 'colorPalette.fg',
      },
      surface: {
        ...ghostVariant,
        _hover: {
          ...ghostVariant._hover,
          borderColor: 'colorPalette.border',
        },
        background: 'colorPalette.subtle',
        borderColor: 'colorPalette.border',
        borderWidth: 1,
        boxShadow: 'none',
      },
      text: {
        _hover: {
          color: 'colorPalette.strong',
        },
        borderWidth: 0,
        color: 'colorPalette.main',
        height: 'unset',
        minWidth: 'unset',
        padding: 0,
      },
    },
  },
})
