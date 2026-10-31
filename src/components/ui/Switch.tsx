import type { ComponentProps, ReactNode, Ref } from 'react'

import { Switch as ChakraSwitch } from '@chakra-ui/react'
import { forwardRef } from 'react'

type VisibleLabel = Exclude<ReactNode, boolean | null | undefined>
type AccessibleHiddenInputProps = ComponentProps<typeof ChakraSwitch.HiddenInput> &
  ({ 'aria-label': string; 'aria-labelledby'?: string } | { 'aria-label'?: string; 'aria-labelledby': string })
type SwitchLabelContract =
  | { children: VisibleLabel; hiddenInputProps?: ComponentProps<typeof ChakraSwitch.HiddenInput> }
  | { children?: never; hiddenInputProps: AccessibleHiddenInputProps }

export type SwitchProps = Omit<ChakraSwitch.RootProps, 'children'> &
  SwitchLabelContract & {
    rootRef?: Ref<HTMLLabelElement>
    thumbLabel?: { off: ReactNode; on: ReactNode }
    trackLabel?: { off: ReactNode; on: ReactNode }
  }

/**
 * Complete Chakra switch composition with its native hidden input, control, thumb and optional visible label.
 *
 * The forwarded ref targets the hidden checkbox for form integration. Root owns checked state and emits Chakra's
 * `onCheckedChange` details. Provide visible `children`, or explicitly label the native checkbox through
 * `hiddenInputProps` when the switch has no visible text. Its content-sized root keeps the pointer hit area aligned with
 * the visible control and label.
 */
const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(props, ref) {
  const { children, colorPalette = 'primary', hiddenInputProps, rootRef, thumbLabel, trackLabel, ...rootProps } = props

  return (
    <ChakraSwitch.Root
      _disabled={{ cursor: 'not-allowed' }}
      _readOnly={{ cursor: 'default' }}
      colorPalette={colorPalette}
      css={{
        '&:is(:hover, [data-hover]):not([data-disabled]):not([data-readonly]) [data-part="control"][data-state="checked"]':
          {
            outlineColor: 'colorPalette.border',
            outlineOffset: '1px',
            outlineStyle: 'solid',
            outlineWidth: '2px',
          },
        '&:is(:hover, [data-hover]):not([data-disabled]):not([data-readonly]) [data-part="control"][data-state="unchecked"]':
          {
            background: 'colorPalette.subtle',
          },
        '&:is(:active, [data-active]):not([data-disabled]):not([data-readonly]) [data-part="control"][data-state="checked"]':
          {
            outlineColor: 'colorPalette.fg',
            outlineOffset: '1px',
            outlineStyle: 'solid',
            outlineWidth: '2px',
          },
        '&:is(:active, [data-active]):not([data-disabled]):not([data-readonly]) [data-part="control"][data-state="unchecked"]':
          {
            background: 'colorPalette.muted',
          },
      }}
      cursor="pointer"
      ref={rootRef}
      width="fit-content"
      {...rootProps}
    >
      <ChakraSwitch.HiddenInput {...hiddenInputProps} ref={ref} />
      <ChakraSwitch.Control cursor="inherit">
        <ChakraSwitch.Thumb>
          {thumbLabel ? (
            <ChakraSwitch.ThumbIndicator fallback={thumbLabel.off}>{thumbLabel.on}</ChakraSwitch.ThumbIndicator>
          ) : null}
        </ChakraSwitch.Thumb>
        {trackLabel ? <ChakraSwitch.Indicator fallback={trackLabel.off}>{trackLabel.on}</ChakraSwitch.Indicator> : null}
      </ChakraSwitch.Control>
      {children != null ? <ChakraSwitch.Label>{children}</ChakraSwitch.Label> : null}
    </ChakraSwitch.Root>
  )
})

export default Switch
