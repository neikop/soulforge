import { defineSlotRecipe } from '@chakra-ui/react'
import { tabsSlotRecipe } from '@chakra-ui/react/theme'

const defaultVariants = tabsSlotRecipe.variants

if (!defaultVariants?.fitted || !defaultVariants.justify || !defaultVariants.size || !defaultVariants.variant) {
  throw new Error('Chakra Tabs recipe variants are unavailable')
}

export const tabsRecipe = defineSlotRecipe({
  ...tabsSlotRecipe,
  variants: {
    ...defaultVariants,
    fitted: defaultVariants.fitted,
    justify: defaultVariants.justify,
    size: defaultVariants.size,
    variant: {
      ...defaultVariants.variant,
      planner: {
        list: { gap: 1, flexWrap: 'wrap' },
        trigger: {
          h: 'control.md',
          px: 3,
          borderRadius: 'sm',
          color: 'fg.muted',
          textStyle: 'action',
          cursor: 'pointer',
          _hover: { bg: 'bg.hover', color: 'fg.default' },
          _selected: { color: 'primary.fg' },
          _focusVisible: { outlineColor: 'primary.focusRing' },
        },
        indicator: {
          '--transition-duration': '{durations.moderate}',
          '--transition-timing-function': '{easings.ease-in-out}',
          _motionReduce: { '--transition-duration': '0ms' },
          bg: 'primary.subtle',
          borderRadius: 'sm',
          pointerEvents: 'none',
          shadow: 'none',
          top: 'var(--top)',
        },
      },
    },
  },
})
