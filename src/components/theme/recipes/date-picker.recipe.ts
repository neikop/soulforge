import { defineSlotRecipe } from '@chakra-ui/react'
import { datePickerSlotRecipe } from '@chakra-ui/react/theme'

const defaultVariants = datePickerSlotRecipe.variants

if (!defaultVariants?.hideOutsideDays || !defaultVariants.size || !defaultVariants.variant) {
  throw new Error('Chakra Date Picker recipe variants are unavailable')
}

const defaultSizeVariants = defaultVariants.size

export const datePickerRecipe = defineSlotRecipe({
  ...datePickerSlotRecipe,
  base: {
    ...datePickerSlotRecipe.base,
    clearTrigger: {
      ...datePickerSlotRecipe.base?.clearTrigger,
      cursor: 'pointer',
    },
    input: {
      ...datePickerSlotRecipe.base?.input,
      '&[data-state="open"]': {
        borderColor: 'colorPalette.focusRing',
        outlineColor: 'colorPalette.focusRing',
        outlineOffset: '0px',
        outlineStyle: 'solid',
        outlineWidth: '1px',
        _invalid: {
          borderColor: 'var(--error-color)',
          outlineColor: 'var(--error-color)',
        },
      },
    },
  },
  variants: {
    hideOutsideDays: defaultVariants.hideOutsideDays,
    size: {
      ...defaultSizeVariants,
      sm: {
        ...defaultSizeVariants?.sm,
        input: { textStyle: 'field' },
        root: {
          ...defaultSizeVariants?.sm?.root,
          '--datepicker-input-height': 'sizes.control.sm',
        },
      },
      md: {
        ...defaultSizeVariants?.md,
        input: { textStyle: 'field' },
        root: {
          ...defaultSizeVariants?.md?.root,
          '--datepicker-input-height': 'sizes.control.md',
        },
      },
      lg: {
        ...defaultSizeVariants?.lg,
        input: { textStyle: 'fieldLarge' },
        root: {
          ...defaultSizeVariants?.lg?.root,
          '--datepicker-input-height': 'sizes.control.lg',
        },
      },
    },
    variant: defaultVariants.variant,
  },
})
