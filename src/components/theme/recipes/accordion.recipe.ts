import { defineSlotRecipe } from '@chakra-ui/react'
import { accordionSlotRecipe } from '@chakra-ui/react/theme'

export const accordionRecipe = defineSlotRecipe({
  ...accordionSlotRecipe,
  base: {
    ...accordionSlotRecipe.base,
    root: { width: 'full', color: 'fg.default', '--accordion-radius': 'radii.md' },
    itemTrigger: {
      ...accordionSlotRecipe.base?.itemTrigger,
      borderRadius: 0,
      color: 'fg.default',
      cursor: 'pointer',
      fontWeight: 'mid',
      _open: { bg: 'primary.subtle', color: 'primary.fg' },
      '&:hover:not(:disabled)': { bg: 'bg.hover', color: 'primary.fg' },
      '&:active:not(:disabled)': { bg: 'primary.muted', color: 'primary.fg' },
      _focusVisible: { outline: '2px solid', outlineColor: 'primary.focusRing', outlineOffset: '-2px' },
      _disabled: { bg: 'transparent', color: 'disabled.fg', cursor: 'not-allowed', opacity: 1 },
    },
    itemContent: {
      ...accordionSlotRecipe.base?.itemContent,
      borderRadius: 0,
      _open: {
        ...accordionSlotRecipe.base?.itemContent?._open,
        animationDuration: 'slow',
        animationTimingFunction: 'ease-in-out',
      },
      _closed: {
        ...accordionSlotRecipe.base?.itemContent?._closed,
        animationDuration: 'slow',
        animationTimingFunction: 'ease-in-out',
      },
      _motionReduce: { animation: 'none' },
    },
    itemBody: { px: 'var(--accordion-padding-x)', py: 2, textStyle: 'bodyCompact' },
    itemIndicator: {
      ...accordionSlotRecipe.base?.itemIndicator,
      color: 'currentColor',
      flexShrink: 0,
      transitionDuration: 'slow',
      _motionReduce: { transition: 'none' },
    },
  },
  variants: {
    ...accordionSlotRecipe.variants,
    size: {
      sm: {
        root: { '--accordion-padding-x': 'spacing.2', '--accordion-padding-y': 'spacing.2' },
        itemTrigger: { minH: 'control.sm', px: 2, py: 2, gap: 2, textStyle: 'actionCompact' },
      },
      md: {
        root: { '--accordion-padding-x': 'spacing.3', '--accordion-padding-y': 'spacing.3' },
        itemTrigger: { minH: 'control.md', px: 3, py: 3, gap: 2, textStyle: 'action' },
      },
      lg: {
        root: { '--accordion-padding-x': 'spacing.4', '--accordion-padding-y': 'spacing.4' },
        itemTrigger: { minH: 'control.lg', px: 4, py: 4, gap: 3, textStyle: 'actionLarge' },
      },
    },
    variant: {
      ...accordionSlotRecipe.variants?.variant,
      subtle: {
        ...accordionSlotRecipe.variants?.variant?.subtle,
        root: { display: 'flex', flexDirection: 'column', gap: 2 },
        item: {
          bg: 'bg.canvas',
          borderWidth: '1px',
          borderRadius: 'md',
          overflow: 'hidden',
          _open: { bg: 'primary.subtle' },
        },
        itemContent: { bg: 'bg.canvas', px: 0 },
      },
    },
  },
  defaultVariants: { size: 'sm', variant: 'subtle' },
})
