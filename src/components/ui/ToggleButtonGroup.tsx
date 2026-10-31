import { Button, Icon, Wrap, type WrapProps } from '@chakra-ui/react'
import { forwardRef } from 'react'
import { FiCheckCircle, FiCircle } from 'react-icons/fi'

export type ToggleButtonGroupOption = {
  label: string
  value: string
}

export type ToggleButtonGroupProps = Omit<WrapProps, 'children' | 'onChange'> & {
  onChange: (value: string[]) => void
  options: ToggleButtonGroupOption[]
  value: string[]
}

/**
 * Controlled multi-select button group for a short set of independent options.
 *
 * Each option exposes `aria-pressed`; pass an accessible group name such as `aria-label` through the root props. The
 * component does not own spacing outside the wrapping option group.
 */
const ToggleButtonGroup = forwardRef<HTMLDivElement, ToggleButtonGroupProps>(function ToggleButtonGroup(
  { onChange, options, role = 'group', value, ...props },
  ref,
) {
  return (
    <Wrap {...props} gap={2} ref={ref} role={role}>
      {options.map((option) => {
        const isSelected = value.includes(option.value)

        return (
          <Button
            aria-pressed={isSelected}
            colorPalette={isSelected ? 'primary' : undefined}
            key={option.value}
            onClick={() => onChange(toggleValue(value, option.value))}
            size="sm"
            type="button"
            variant={isSelected ? 'surface' : 'outline'}
          >
            <Icon as={isSelected ? FiCheckCircle : FiCircle} boxSize="1rem" flexShrink={0} />
            {option.label}
          </Button>
        )
      })}
    </Wrap>
  )
})

export default ToggleButtonGroup

function toggleValue(currentValues: string[], nextValue: string) {
  if (currentValues.includes(nextValue)) {
    return currentValues.filter((item) => item !== nextValue)
  }

  return [...currentValues, nextValue]
}
