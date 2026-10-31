import { defineRecipe } from '@chakra-ui/react'

export const inputRecipe = defineRecipe({
  variants: {
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
