import {
  type DatePickerInputProps as ChakraDatePickerInputProps,
  DatePicker,
  type DatePickerRootProps,
  parseDate,
  useControllableState,
} from '@chakra-ui/react'
import { type FocusEventHandler, forwardRef, type InputEvent as ReactInputEvent, useMemo } from 'react'

import DatePickerCalendar from './DatePicker/DatePickerCalendar'
import { formatDateValue, formatPartialDateInput, parseDateInput } from './DatePicker/dateUtils'

type DatePickerAccessibilityProps = Pick<
  ChakraDatePickerInputProps,
  'aria-describedby' | 'aria-errormessage' | 'aria-label' | 'aria-labelledby' | 'autoComplete'
>

export type DatePickerInputProps = DatePickerAccessibilityProps &
  Pick<DatePickerRootProps, 'colorPalette' | 'disabled' | 'invalid' | 'name' | 'readOnly' | 'required'> & {
    defaultValue?: string
    id?: string
    inputProps?: Omit<ChakraDatePickerInputProps, 'disabled' | 'index' | 'placeholder' | 'readOnly' | 'required'>
    onBlur?: FocusEventHandler<HTMLInputElement>
    onChange?: (value: string) => void
    onFocus?: FocusEventHandler<HTMLInputElement>
    placeholder?: string
    size?: 'lg' | 'md' | 'sm'
    value?: string
  }

/**
 * Controlled or uncontrolled single-date input that normalizes typed `dd/mm/yyyy` values to ISO dates.
 *
 * Use it inside a labelled field and pass `id` when the visible label lives outside the date-picker compound component.
 * The forwarded ref targets the text input for focus management. State and form props flow through the compound root;
 * accessible naming and description props target the visible input. `inputProps` forwards other native, ARIA and data
 * attributes. Invalid partial text remains local until it parses and is not replaced with a focused date on blur. Opening
 * from the input keeps text-entry focus while the open calendar maintains the input's active visual state. The optional
 * `colorPalette` overrides the theme's neutral default in the same way as Chakra Input.
 */
const DatePickerInput = forwardRef<HTMLInputElement, DatePickerInputProps>(function DatePickerInput(
  {
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    autoComplete,
    colorPalette,
    defaultValue = '',
    disabled = false,
    id,
    inputProps,
    invalid = false,
    name,
    onBlur,
    onChange,
    onFocus,
    placeholder = 'dd/mm/yyyy',
    readOnly = false,
    required = false,
    size = 'md',
    value,
  },
  ref,
) {
  const isInteractive = !disabled && !readOnly
  const [currentValue, setCurrentValue] = useControllableState({
    defaultValue,
    onChange,
    value,
  })
  const parsedValue = useMemo(() => {
    if (!currentValue) {
      return []
    }

    try {
      return [parseDate(currentValue)]
    } catch {
      return []
    }
  }, [currentValue])

  const commitInputValue = (inputValue: string) => {
    if (!isInteractive) {
      return false
    }

    if (!inputValue.trim()) {
      setCurrentValue('')
      return true
    }

    const parsedDate = parseDateInput(inputValue)

    if (!parsedDate) {
      return false
    }

    setCurrentValue(parsedDate.toString())
    return true
  }

  const handleInput = (event: ReactInputEvent<HTMLInputElement>) => {
    inputProps?.onInput?.(event)

    if (event.defaultPrevented) {
      return
    }

    if (!isInteractive) {
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

    void commitInputValue(nextValue)
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
        setCurrentValue(details.value[0]?.toString() || '')
      }}
      openOnClick
      parse={(inputValue) => parseDateInput(inputValue)}
      positioning={{ sameWidth: true }}
      readOnly={readOnly}
      required={required}
      selectionMode="single"
      size={size}
      unmountOnExit
      value={parsedValue}
      variant="outline"
      width="full"
    >
      <DatePicker.Control>
        <DatePicker.Input
          {...inputProps}
          aria-describedby={ariaDescribedBy ?? inputProps?.['aria-describedby']}
          aria-errormessage={ariaErrorMessage ?? inputProps?.['aria-errormessage']}
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel ?? inputProps?.['aria-label']}
          aria-labelledby={ariaLabelledBy ?? inputProps?.['aria-labelledby']}
          autoComplete={autoComplete ?? inputProps?.autoComplete}
          disabled={disabled}
          fixOnBlur={false}
          id={id ?? inputProps?.id}
          index={0}
          onBlur={(event) => {
            inputProps?.onBlur?.(event)
            onBlur?.(event)
          }}
          onFocus={(event) => {
            inputProps?.onFocus?.(event)
            onFocus?.(event)
          }}
          onInput={handleInput}
          pe={currentValue ? '10' : undefined}
          placeholder={placeholder}
          readOnly={readOnly}
          ref={ref}
          required={required}
        />
        {currentValue && isInteractive ? (
          <DatePicker.IndicatorGroup>
            <DatePicker.ClearTrigger type="button" />
          </DatePicker.IndicatorGroup>
        ) : null}
      </DatePicker.Control>

      <DatePickerCalendar />
    </DatePicker.Root>
  )
})

export default DatePickerInput
