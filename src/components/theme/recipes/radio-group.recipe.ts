import { defineSlotRecipe } from '@chakra-ui/react'
import { radioGroupSlotRecipe } from '@chakra-ui/react/theme'

export const radioGroupRecipe = defineSlotRecipe({
  ...radioGroupSlotRecipe,
  base: {
    ...radioGroupSlotRecipe.base,
    root: {
      ...radioGroupSlotRecipe.base?.root,
      colorPalette: 'primary',
    },
  },
})
