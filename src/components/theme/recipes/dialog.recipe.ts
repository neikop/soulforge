import { defineSlotRecipe } from '@chakra-ui/react'
import { dialogSlotRecipe } from '@chakra-ui/react/theme'

export const dialogRecipe = defineSlotRecipe({
  ...dialogSlotRecipe,
  base: {
    ...dialogSlotRecipe.base,
    backdrop: {
      ...dialogSlotRecipe.base?.backdrop,
      _motionReduce: { animationDuration: '0.01ms' },
      bg: 'bg.overlay/64',
    },
    body: {
      ...dialogSlotRecipe.base?.body,
      color: 'fg.default',
      px: 6,
      py: 4,
      textStyle: 'body',
    },
    closeTrigger: {
      ...dialogSlotRecipe.base?.closeTrigger,
      insetEnd: 4,
      top: 4,
    },
    content: {
      ...dialogSlotRecipe.base?.content,
      _motionReduce: { animationDuration: '0.01ms' },
      background: 'bg.canvas',
      borderColor: 'border.default',
      borderRadius: 'lg',
      borderWidth: 1,
      color: 'fg.default',
    },
    description: {
      ...dialogSlotRecipe.base?.description,
      color: 'fg.subtle',
      textStyle: 'body',
    },
    footer: {
      ...dialogSlotRecipe.base?.footer,
      borderTopWidth: 1,
      gap: 3,
      px: 6,
      py: 4,
    },
    header: {
      ...dialogSlotRecipe.base?.header,
      borderBottomWidth: 1,
      padding: 6,
      paddingInlineEnd: 14,
    },
    title: {
      ...dialogSlotRecipe.base?.title,
      textStyle: 'title',
    },
  },
  defaultVariants: {
    ...dialogSlotRecipe.defaultVariants,
    placement: 'center',
    scrollBehavior: 'inside',
    size: 'md',
  },
})
