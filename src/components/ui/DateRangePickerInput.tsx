import type { DatePickerInputProps as ChakraDatePickerInputProps, DatePickerRootProps } from '@chakra-ui/react'
import type { FocusEventHandler, InputEvent as ReactInputEvent, RefObject } from 'react'

import { DatePicker, HStack, Icon, parseDate, useControllableState } from '@chakra-ui/react'
import { forwardRef, useMemo } from 'react'
import { FiArrowRight } from 'react-icons/fi'

import DatePickerCalendar from './DatePicker/DatePickerCalendar'
import { formatDateValue, formatPartialDateInput, parseDateInput } from './DatePicker/dateUtils'

export type DateRangeValue = [start: string, end: string]

type DateRangeAccessibilityProps = Pick<ChakraDatePickerInputProps, 'aria-describedby' | 'aria-errormessage'>

export type DateRangePickerInputProps = DateRangeAccessibilityProps &
  Pick<DatePickerRootProps, 'colorPalette' | 'disabled' | 'invalid' | 'name' | 'readOnly' | 'required'> & {
    defaultValue?: DateRangeValue
    endAriaLabel?: string
    endAriaLabelledBy?: string
    endId?: string
    endInputProps?: Omit<
      ChakraDatePickerInputProps,
      'disabled' | 'fixOnBlur' | 'index' | 'placeholder' | 'readOnly' | 'required'
    >
    endInputRef?: RefObject<HTMLInputElement | null>
    endPlaceholder?: string
    onBlur?: FocusEventHandler<HTMLInputElement>
    onChange?: (value: DateRangeValue) => void
    onFocus?: FocusEventHandler<HTMLInputElement>
    size?: 'lg' | 'md' | 'sm'
    startAriaLabel?: string
    startAriaLabelledBy?: string
    startId?: string
    startInputProps?: Omit<
      ChakraDatePickerInputProps,
      'disabled' | 'fixOnBlur' | 'index' | 'placeholder' | 'readOnly' | 'required'
    >
    startPlaceholder?: string
    value?: DateRangeValue
  }

/**
 * Controlled or uncontrolled date-range input that normalizes both boundaries to ISO calendar dates.
 *
 * The forwarded ref targets the start input and `endInputRef` targets the end input. The pair is one form value; the
 * consuming feature owns inclusive/exclusive boundary policy and conversion to API timestamps. Each boundary exposes
 * separate input props and accessible naming while shared form events run for either visible input. Both inputs stay
 * inside one compound control so Chakra can synchronize their displayed values by range index. Complete typed dates
 * commit immediately while invalid partial text remains local to its boundary. Opening from either boundary preserves
 * its text-entry focus and keeps the compound range visually active while the calendar is open. The optional
 * `colorPalette` overrides the theme's neutral default in the same way as Chakra Input.
 */
const DateRangePickerInput = forwardRef<HTMLInputElement, DateRangePickerInputProps>(
  function DateRangePickerInput(props, ref) {
    const {
      'aria-describedby': ariaDescribedBy,
      'aria-errormessage': ariaErrorMessage,
      colorPalette,
      defaultValue = ['', ''],
      disabled = false,
      endAriaLabel,
      endAriaLabelledBy,
      endId,
      endInputProps,
      endInputRef,
      endPlaceholder = 'dd/mm/yyyy',
      invalid = false,
      name,
      onBlur,
      onChange,
      onFocus,
      readOnly = false,
      required = false,
      size = 'md',
      startAriaLabel,
      startAriaLabelledBy,
      startId,
      startInputProps,
      startPlaceholder = 'dd/mm/yyyy',
      value,
    } = props
    const isInteractive = !disabled && !readOnly
    const [currentValue, setCurrentValue] = useControllableState<DateRangeValue>({
      defaultValue,
      onChange,
      value,
    })
    const parsedValue = useMemo(() => parseDateRange(currentValue), [currentValue])

    const commitInputValue = (index: 0 | 1, inputValue: string) => {
      if (!isInteractive) {
        return
      }

      if (!inputValue.trim()) {
        setCurrentValue(index === 0 ? ['', ''] : [currentValue[0], ''])
        return
      }

      const parsedDate = parseDateInput(inputValue)

      if (!parsedDate) {
        return
      }

      const nextValue: DateRangeValue = [...currentValue]
      nextValue[index] = parsedDate.toString()
      setCurrentValue(nextValue)
    }

    const handleInput = (
      index: 0 | 1,
      inputProps: DateRangePickerInputProps['startInputProps'],
      event: ReactInputEvent<HTMLInputElement>,
    ) => {
      inputProps?.onInput?.(event)

      if (event.defaultPrevented || !isInteractive) {
        return
      }

      const nativeEvent = event.nativeEvent as InputEvent
      const nextValue = formatPartialDateInput(
        event.currentTarget.value,
        nativeEvent.inputType?.startsWith('delete') ?? false,
      )

      if (nextValue !== event.currentTarget.value) {
        event.currentTarget.value = nextValue
        event.currentTarget.setSelectionRange(nextValue.length, nextValue.length)
      }

      commitInputValue(index, nextValue)
    }

    return (
      <DatePicker.Root
        colorPalette={colorPalette}
        disabled={disabled}
        fixedWeeks
        format={(date) => formatDateValue(date.toString())}
        invalid={invalid}
        lazyMount
        name={name}
        onValueChange={(details) => {
          if (!isInteractive) return
          setCurrentValue([details.value[0]?.toString() ?? '', details.value[1]?.toString() ?? ''])
        }}
        openOnClick
        parse={parseDateInput}
        readOnly={readOnly}
        required={required}
        selectionMode="range"
        size={size}
        unmountOnExit
        value={parsedValue}
        variant="outline"
        width="full"
      >
        <DatePicker.Control>
          <HStack alignItems="center" gap={2} width="full">
            <DatePicker.Input
              {...startInputProps}
              aria-describedby={ariaDescribedBy ?? startInputProps?.['aria-describedby']}
              aria-errormessage={ariaErrorMessage ?? startInputProps?.['aria-errormessage']}
              aria-invalid={invalid || undefined}
              aria-label={
                startAriaLabelledBy ? undefined : (startAriaLabel ?? startInputProps?.['aria-label'] ?? 'Start date')
              }
              aria-labelledby={startAriaLabelledBy ?? startInputProps?.['aria-labelledby']}
              disabled={disabled}
              fixOnBlur={false}
              flex="1 1 0"
              id={startId ?? startInputProps?.id}
              index={0}
              minWidth={0}
              onBlur={(event) => {
                startInputProps?.onBlur?.(event)
                onBlur?.(event)
              }}
              onFocus={(event) => {
                startInputProps?.onFocus?.(event)
                onFocus?.(event)
              }}
              onInput={(event) => handleInput(0, startInputProps, event)}
              placeholder={startPlaceholder}
              readOnly={readOnly}
              ref={ref}
              required={required}
              width={0}
            />
            <Icon aria-hidden="true" color="fg.muted" flexShrink={0} size="sm">
              <FiArrowRight />
            </Icon>
            <DatePicker.Input
              {...endInputProps}
              aria-describedby={ariaDescribedBy ?? endInputProps?.['aria-describedby']}
              aria-errormessage={ariaErrorMessage ?? endInputProps?.['aria-errormessage']}
              aria-invalid={invalid || undefined}
              aria-label={endAriaLabelledBy ? undefined : (endAriaLabel ?? endInputProps?.['aria-label'] ?? 'End date')}
              aria-labelledby={endAriaLabelledBy ?? endInputProps?.['aria-labelledby']}
              disabled={disabled}
              fixOnBlur={false}
              flex="1 1 0"
              id={endId ?? endInputProps?.id}
              index={1}
              minWidth={0}
              onBlur={(event) => {
                endInputProps?.onBlur?.(event)
                onBlur?.(event)
              }}
              onFocus={(event) => {
                endInputProps?.onFocus?.(event)
                onFocus?.(event)
              }}
              onInput={(event) => handleInput(1, endInputProps, event)}
              pe={currentValue.some(Boolean) ? '10' : undefined}
              placeholder={endPlaceholder}
              readOnly={readOnly}
              ref={endInputRef}
              required={required}
              width={0}
            />
          </HStack>
          {currentValue.some(Boolean) && isInteractive ? (
            <DatePicker.IndicatorGroup>
              <DatePicker.ClearTrigger type="button" />
            </DatePicker.IndicatorGroup>
          ) : null}
        </DatePicker.Control>
        <DatePickerCalendar />
      </DatePicker.Root>
    )
  },
)

export default DateRangePickerInput

function parseDateRange([start, end]: DateRangeValue) {
  if (!start) {
    return []
  }

  try {
    const parsedStart = parseDate(start)

    if (!end) {
      return [parsedStart]
    }

    try {
      return [parsedStart, parseDate(end)]
    } catch {
      return [parsedStart]
    }
  } catch {
    return []
  }
}
