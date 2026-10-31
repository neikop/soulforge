import {
  CloseButton,
  createListCollection,
  Portal,
  Select,
  type SelectRootProps,
  type SelectTriggerProps,
} from '@chakra-ui/react'
import { type FocusEventHandler, forwardRef, useMemo } from 'react'

export type ChakraSelectOption = {
  label: string
  value: string
}

type ChakraSelectAccessibilityProps = Pick<
  SelectTriggerProps,
  'aria-describedby' | 'aria-errormessage' | 'aria-label' | 'aria-labelledby'
>

export type ChakraSelectProps = ChakraSelectAccessibilityProps &
  Pick<SelectRootProps<ChakraSelectOption>, 'disabled' | 'invalid' | 'name' | 'readOnly' | 'required'> & {
    id?: string
    isClearable?: boolean
    onBlur?: FocusEventHandler<HTMLButtonElement>
    onChange?: (value: string) => void
    onFocus?: FocusEventHandler<HTMLButtonElement>
    options: ChakraSelectOption[]
    placeholder: string
    size?: 'lg' | 'md' | 'sm'
    value: string
  }

/**
 * Controlled single-value adapter around Chakra Select for simple string option lists.
 *
 * The forwarded ref targets the trigger button. Consumers must provide a visible external label or an accessible name
 * through their owning field composition. State and form props flow through the compound root, accessible descriptions
 * target the trigger, and clearing emits an empty string.
 */
const ChakraSelect = forwardRef<HTMLButtonElement, ChakraSelectProps>(function ChakraSelect(
  {
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    disabled = false,
    id,
    invalid = false,
    isClearable = false,
    name,
    onBlur,
    onChange,
    onFocus,
    options,
    placeholder,
    readOnly = false,
    required = false,
    size = 'md',
    value,
  },
  ref,
) {
  const collection = useMemo(() => createListCollection({ items: options }), [options])

  return (
    <Select.Root
      collection={collection}
      disabled={disabled}
      ids={id ? { trigger: id } : undefined}
      invalid={invalid}
      name={name}
      onValueChange={(details) => onChange?.(details.value[0] ?? '')}
      positioning={{ sameWidth: true }}
      readOnly={readOnly}
      required={required}
      size={size}
      value={value ? [value] : []}
      width="full"
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger
          aria-describedby={ariaDescribedBy}
          aria-errormessage={ariaErrorMessage}
          aria-invalid={invalid || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          onBlur={onBlur}
          onFocus={onFocus}
          ref={ref}
        >
          <Select.ValueText placeholder={placeholder} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          {isClearable && value ? (
            <Select.ClearTrigger asChild>
              <CloseButton size="2xs" variant="ghost" />
            </Select.ClearTrigger>
          ) : null}
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      <Portal>
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((item) => (
              <Select.Item item={item} key={item.value}>
                <Select.ItemText>{item.label}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
})

export default ChakraSelect
