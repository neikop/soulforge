import { defineSlotRecipe } from '@chakra-ui/react'
import { alertAnatomy } from '@chakra-ui/react/anatomy'

export const alertRecipe = defineSlotRecipe({
  className: 'chakra-alert',
  slots: alertAnatomy.keys(),
  base: {
    root: {
      alignItems: 'flex-start',
      borderRadius: 'md',
      display: 'flex',
      position: 'relative',
      width: 'full',
    },
    content: {
      display: 'flex',
      flex: 1,
      gap: 1,
    },
    description: {
      color: 'inherit',
      textStyle: 'body',
    },
    indicator: {
      _icon: { boxSize: 'full' },
      alignItems: 'center',
      display: 'inline-flex',
      flexShrink: 0,
      height: '1em',
      justifyContent: 'center',
      width: '1em',
    },
    title: {
      textStyle: 'title',
    },
  },
  variants: {
    inline: {
      false: {
        content: {
          flexDirection: 'column',
        },
      },
      true: {
        content: {
          alignItems: 'center',
          flexDirection: 'row',
        },
      },
    },
    size: {
      sm: {
        indicator: { fontSize: 'lg' },
        root: { gap: 2, px: 3, py: 3 },
      },
      md: {
        indicator: { fontSize: 'xl' },
        root: { gap: 3, px: 4, py: 4 },
      },
      lg: {
        indicator: { fontSize: '2xl' },
        root: { gap: 3, px: 5, py: 5 },
      },
    },
    status: {
      error: { root: { colorPalette: 'error' } },
      info: { root: { colorPalette: 'info' } },
      neutral: {},
      success: { root: { colorPalette: 'success' } },
      warning: { root: { colorPalette: 'warning' } },
    },
    variant: {
      outline: {
        indicator: { color: 'colorPalette.fg' },
        root: {
          background: 'bg.canvas',
          borderColor: 'colorPalette.border',
          borderWidth: 1,
          color: 'colorPalette.fg',
        },
      },
      solid: {
        indicator: { color: 'colorPalette.contrast' },
        root: {
          background: 'colorPalette.solid',
          color: 'colorPalette.contrast',
        },
      },
      subtle: {
        root: {
          background: 'colorPalette.subtle',
          color: 'colorPalette.fg',
        },
      },
      surface: {
        indicator: { color: 'colorPalette.fg' },
        root: {
          background: 'colorPalette.surface',
          borderColor: 'colorPalette.border',
          borderWidth: 1,
          color: 'colorPalette.fg',
        },
      },
    },
  },
  compoundVariants: [
    {
      css: {
        root: { background: 'bg.canvas', borderColor: 'border.default', borderWidth: 1, color: 'fg.default' },
      },
      status: 'neutral',
      variant: 'outline',
    },
    {
      css: { root: { background: 'fg.default', color: 'bg.canvas' } },
      status: 'neutral',
      variant: 'solid',
    },
    {
      css: { root: { background: 'bg.subtle', color: 'fg.default' } },
      status: 'neutral',
      variant: 'subtle',
    },
    {
      css: {
        root: { background: 'bg.subtle', borderColor: 'border.default', borderWidth: 1, color: 'fg.default' },
      },
      status: 'neutral',
      variant: 'surface',
    },
  ],
  defaultVariants: {
    inline: false,
    size: 'md',
    status: 'info',
    variant: 'subtle',
  },
})
