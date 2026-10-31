import type { InputProps } from '@chakra-ui/react'

import { IconButton, Input, InputGroup, useControllableState } from '@chakra-ui/react'
import { forwardRef } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

export type PasswordInputProps = Omit<InputProps, 'type'> & {
  defaultIsVisible?: boolean
  isVisible?: boolean
  onVisibilityChange?: (isVisible: boolean) => void
  visibilityLabel?: { hide: string; show: string }
}

/**
 * Password field with a keyboard-accessible controlled or uncontrolled visibility toggle.
 *
 * The forwarded ref targets the native input. Labels, validation and helper text remain owned by `FormField`; native
 * input and accessibility props pass through unchanged. Visibility changes only presentation and never mutates value.
 */
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(props, ref) {
  const {
    defaultIsVisible = false,
    disabled,
    isVisible: isVisibleProp,
    onVisibilityChange,
    visibilityLabel = { hide: 'Hide password', show: 'Show password' },
    ...inputProps
  } = props
  const [isVisible, setIsVisible] = useControllableState({
    defaultValue: defaultIsVisible,
    onChange: onVisibilityChange,
    value: isVisibleProp,
  })

  return (
    <InputGroup
      endElement={
        <IconButton
          aria-label={isVisible ? visibilityLabel.hide : visibilityLabel.show}
          disabled={disabled}
          onClick={() => setIsVisible(!isVisible)}
          onPointerDown={(event) => {
            if (event.button === 0) event.preventDefault()
          }}
          size="sm"
          variant="ghost"
        >
          {isVisible ? <FiEyeOff /> : <FiEye />}
        </IconButton>
      }
      endElementProps={{ pointerEvents: 'auto' }}
    >
      <Input {...inputProps} disabled={disabled} ref={ref} type={isVisible ? 'text' : 'password'} />
    </InputGroup>
  )
})

export default PasswordInput
