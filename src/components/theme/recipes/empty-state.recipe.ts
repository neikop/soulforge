import { defineSlotRecipe } from '@chakra-ui/react'
import { emptyStateAnatomy } from '@chakra-ui/react/anatomy'

export const emptyStateRecipe = defineSlotRecipe({
  className: 'chakra-empty-state',
  slots: emptyStateAnatomy.keys(),
  base: {
    root: {
      px: 2,
      py: 2,
      width: 'full',
    },
    content: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      justifyContent: 'center',
      textAlign: 'center',
    },
    description: {
      color: 'fg.subtle',
      maxWidth: 'lg',
    },
    indicator: {
      _icon: { boxSize: '1em' },
      alignItems: 'center',
      color: 'fg.subtle',
      display: 'flex',
      justifyContent: 'center',
    },
    title: {
      color: 'fg.default',
    },
  },
  variants: {
    // Chakra varies layout spacing by size, so each app size explicitly restores the shared fixed geometry.
    size: {
      sm: {
        content: { gap: 2 },
        description: { textStyle: 'bodyCompact' },
        indicator: { fontSize: '2xl' },
        root: { px: 2, py: 2 },
        title: { textStyle: 'titleCompact' },
      },
      md: {
        content: { gap: 2 },
        description: { textStyle: 'body' },
        indicator: { fontSize: '4xl' },
        root: { px: 2, py: 2 },
        title: { textStyle: 'title' },
      },
      lg: {
        content: { gap: 2 },
        description: { textStyle: 'bodyLarge' },
        indicator: { fontSize: '6xl' },
        root: { px: 2, py: 2 },
        title: { textStyle: 'titleLarge' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
