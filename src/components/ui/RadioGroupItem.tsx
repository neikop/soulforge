import type { ComponentProps, ReactNode, Ref } from 'react'

import { RadioGroup } from '@chakra-ui/react'
import { forwardRef } from 'react'

type VisibleLabel = Exclude<ReactNode, boolean | null | undefined>
type AccessibleHiddenInputProps = ComponentProps<typeof RadioGroup.ItemHiddenInput> &
  ({ 'aria-label': string; 'aria-labelledby'?: string } | { 'aria-label'?: string; 'aria-labelledby': string })
type RadioGroupItemLabelContract =
  | { children: VisibleLabel; hiddenInputProps?: ComponentProps<typeof RadioGroup.ItemHiddenInput> }
  | { children?: never; hiddenInputProps: AccessibleHiddenInputProps }

export type RadioGroupItemProps = Omit<RadioGroup.ItemProps, 'children'> &
  RadioGroupItemLabelContract & {
    rootRef?: Ref<HTMLDivElement>
  }

/**
 * Complete radio item composition for use inside Chakra `RadioGroup.Root`.
 *
 * The forwarded ref targets the native hidden radio for form registration. Value state and `onValueChange` stay on the
 * group root; this component guarantees every item keeps its input and indicator. Provide visible `children`, or label
 * the native radio explicitly through `hiddenInputProps` when an item intentionally has no visible text. Its
 * content-sized root keeps the pointer hit area aligned with the visible indicator and label.
 */
const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(function RadioGroupItem(props, ref) {
  const { children, hiddenInputProps, rootRef, ...itemProps } = props

  return (
    <RadioGroup.Item
      _disabled={{ cursor: 'not-allowed' }}
      _readOnly={{ cursor: 'default' }}
      css={{
        '&:is(:hover, [data-hover]):not([data-disabled]):not([data-readonly]) [data-part="item-control"][data-state="checked"]':
          {
            outlineColor: 'colorPalette.border',
            outlineOffset: '1px',
            outlineStyle: 'solid',
            outlineWidth: '2px',
          },
        '&:is(:hover, [data-hover]):not([data-disabled]):not([data-readonly]) [data-part="item-control"][data-state="unchecked"]':
          {
            background: 'colorPalette.subtle',
            borderColor: 'colorPalette.border',
          },
        '&:is(:active, [data-active]):not([data-disabled]):not([data-readonly]) [data-part="item-control"][data-state="checked"]':
          {
            outlineColor: 'colorPalette.fg',
            outlineOffset: '1px',
            outlineStyle: 'solid',
            outlineWidth: '2px',
          },
        '&:is(:active, [data-active]):not([data-disabled]):not([data-readonly]) [data-part="item-control"][data-state="unchecked"]':
          {
            background: 'colorPalette.muted',
            borderColor: 'colorPalette.border',
          },
      }}
      cursor="pointer"
      ref={rootRef}
      width="fit-content"
      {...itemProps}
    >
      <RadioGroup.ItemHiddenInput {...hiddenInputProps} ref={ref} />
      <RadioGroup.ItemIndicator />
      {children != null ? <RadioGroup.ItemText>{children}</RadioGroup.ItemText> : null}
    </RadioGroup.Item>
  )
})

export default RadioGroupItem
