import { defineSlotRecipe } from '@chakra-ui/react'
import { drawerSlotRecipe } from '@chakra-ui/react/theme'

export const drawerRecipe = defineSlotRecipe({
  ...drawerSlotRecipe,
  base: {
    ...drawerSlotRecipe.base,
    backdrop: {
      ...drawerSlotRecipe.base?.backdrop,
      _motionReduce: { animationDuration: '0.01ms' },
      bg: 'bg.overlay/64',
    },
    body: {
      ...drawerSlotRecipe.base?.body,
      color: 'fg.default',
      px: 6,
      py: 4,
      textStyle: 'body',
    },
    closeTrigger: {
      ...drawerSlotRecipe.base?.closeTrigger,
      insetEnd: 4,
      top: 4,
    },
    content: {
      ...drawerSlotRecipe.base?.content,
      _motionReduce: { animationDuration: '0.01ms' },
      background: 'bg.canvas',
      borderColor: 'border.default',
      borderWidth: 1,
      color: 'fg.default',
    },
    description: {
      ...drawerSlotRecipe.base?.description,
      color: 'fg.subtle',
      textStyle: 'body',
    },
    footer: {
      ...drawerSlotRecipe.base?.footer,
      borderTopWidth: 1,
      gap: 3,
      px: 6,
      py: 4,
    },
    header: {
      ...drawerSlotRecipe.base?.header,
      borderBottomWidth: 1,
      padding: 6,
      paddingInlineEnd: 14,
    },
    title: {
      ...drawerSlotRecipe.base?.title,
      textStyle: 'title',
    },
  },
  defaultVariants: {
    ...drawerSlotRecipe.defaultVariants,
    placement: 'end',
    size: 'sm',
  },
})
