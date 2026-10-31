import { defineSlotRecipe } from '@chakra-ui/react'
import { fieldSlotRecipe } from '@chakra-ui/react/theme'

export const fieldRecipe = defineSlotRecipe({
  ...fieldSlotRecipe,
  base: {
    ...fieldSlotRecipe.base,
    label: {
      ...fieldSlotRecipe.base?.label,
      userSelect: 'text',
    },
  },
})
