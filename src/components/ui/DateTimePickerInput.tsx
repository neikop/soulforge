import type { InputProps } from '@chakra-ui/react'
import type { FocusEventHandler, RefObject } from 'react'

import { Input, SimpleGrid, useControllableState } from '@chakra-ui/react'
import { forwardRef } from 'react'

import type { DatePickerInputProps } from './DatePickerInput'

import DatePickerInput from './DatePickerInput'

export type DateTimeValue = {
  date: string
  time: string
}

export type DateTimePickerInputProps = {
  colorPalette?: DatePickerInputProps['colorPalette']
  dateAriaLabel?: string
  dateId?: string
  dateInputProps?: DatePickerInputProps['inputProps']
  defaultValue?: DateTimeValue
  disabled?: boolean
  invalid?: boolean
  name?: string
  onBlur?: FocusEventHandler<HTMLInputElement>
  onChange?: (value: DateTimeValue) => void
  onFocus?: FocusEventHandler<HTMLInputElement>
  readOnly?: boolean
  required?: boolean
  size?: 'lg' | 'md' | 'sm'
  timeAriaLabel?: string
  timeId?: string
  timeInputProps?: Omit<
    InputProps,
    'colorPalette' | 'disabled' | 'onChange' | 'readOnly' | 'required' | 'size' | 'type' | 'value'
  >
  timeInputRef?: RefObject<HTMLInputElement | null>
  timeName?: string
  value?: DateTimeValue
}

/**
 * Controlled or uncontrolled local date-and-time pair with a calendar date and native time control.
 *
 * The forwarded ref targets the date input. This component intentionally returns separate date and time fields so the
 * consuming feature can apply its timezone and API serialization policy without hidden browser timezone conversion.
 * `timeInputRef` supports focusing the native time field independently during form validation. `colorPalette` is shared
 * by both controls and otherwise inherits the same neutral theme default as Chakra Input.
 */
const DateTimePickerInput = forwardRef<HTMLInputElement, DateTimePickerInputProps>(
  function DateTimePickerInput(props, ref) {
    const {
      colorPalette,
      dateAriaLabel,
      dateId,
      dateInputProps,
      defaultValue = { date: '', time: '' },
      disabled,
      invalid,
      name,
      onBlur,
      onChange,
      onFocus,
      readOnly,
      required,
      size = 'md',
      timeAriaLabel,
      timeId,
      timeInputProps,
      timeInputRef,
      timeName,
      value,
    } = props
    const [currentValue, setCurrentValue] = useControllableState<DateTimeValue>({
      defaultValue,
      onChange,
      value,
    })

    return (
      <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3} width="full">
        <DatePickerInput
          aria-label={
            dateInputProps?.['aria-labelledby']
              ? undefined
              : (dateAriaLabel ?? dateInputProps?.['aria-label'] ?? 'Date')
          }
          colorPalette={colorPalette}
          disabled={disabled}
          id={dateId}
          inputProps={dateInputProps}
          invalid={invalid}
          name={name}
          onBlur={onBlur}
          onChange={(date) => setCurrentValue({ ...currentValue, date })}
          onFocus={onFocus}
          readOnly={readOnly}
          ref={ref}
          required={required}
          size={size}
          value={currentValue.date}
        />
        <Input
          {...timeInputProps}
          aria-invalid={invalid || timeInputProps?.['aria-invalid'] || undefined}
          aria-label={
            timeInputProps?.['aria-labelledby']
              ? undefined
              : (timeAriaLabel ?? timeInputProps?.['aria-label'] ?? 'Time')
          }
          colorPalette={colorPalette}
          disabled={disabled}
          id={timeId ?? timeInputProps?.id}
          name={timeName ?? timeInputProps?.name}
          onBlur={(event) => {
            timeInputProps?.onBlur?.(event)
            onBlur?.(event)
          }}
          onChange={(event) => setCurrentValue({ ...currentValue, time: event.target.value })}
          onFocus={(event) => {
            timeInputProps?.onFocus?.(event)
            onFocus?.(event)
          }}
          readOnly={readOnly}
          ref={timeInputRef}
          required={required}
          size={size}
          type="time"
          value={currentValue.time}
        />
      </SimpleGrid>
    )
  },
)

export default DateTimePickerInput
