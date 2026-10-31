import type { ReactNode } from 'react'

import {
  Button,
  Stack,
  TagsInput,
  type TagsInputInputProps,
  type TagsInputRootProps,
  Text,
  useControllableState,
  Wrap,
} from '@chakra-ui/react'
import { forwardRef, useId, useRef } from 'react'

export type TagsFieldOption = {
  label: string
  value: string
}

type TagsFieldAccessibilityProps = Pick<
  TagsInputInputProps,
  'aria-describedby' | 'aria-errormessage' | 'aria-label' | 'aria-labelledby' | 'autoComplete'
>

export type TagsFieldProps = TagsFieldAccessibilityProps &
  Pick<TagsInputRootProps, 'disabled' | 'invalid' | 'name' | 'readOnly' | 'required'> & {
    defaultValue?: string[]
    helperText?: ReactNode
    helperTextId?: string
    id?: string
    maxSuggestions?: number
    onValueChange?: (value: string[]) => void
    pattern?: string
    placeholder?: string
    suggestions?: TagsFieldOption[]
    uppercase?: boolean
    value?: string[]
  }

/**
 * Controlled or uncontrolled tag-entry field with optional suggestions and pattern normalization.
 *
 * The forwarded ref targets the text input. Pass `id` for a visible external label or `aria-label` when no visible label
 * exists. Helper text is associated automatically; external validation can use `aria-describedby` or
 * `aria-errormessage`. Pattern slots use `9` for digits, `A` for letters and `X` for either; duplicates are removed.
 */
const TagsField = forwardRef<HTMLInputElement, TagsFieldProps>(function TagsField(
  {
    'aria-describedby': ariaDescribedBy,
    'aria-errormessage': ariaErrorMessage,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    autoComplete,
    defaultValue = [],
    disabled = false,
    helperText,
    helperTextId,
    id,
    invalid = false,
    maxSuggestions = 8,
    name,
    onValueChange,
    pattern,
    placeholder,
    readOnly = false,
    required = false,
    suggestions = [],
    uppercase = false,
    value,
  },
  ref,
) {
  const generatedHelperTextId = useId()
  const resolvedHelperTextId = helperText ? (helperTextId ?? generatedHelperTextId) : undefined
  const describedBy = [ariaDescribedBy, resolvedHelperTextId].filter(Boolean).join(' ') || undefined
  const [currentValue, setCurrentValue] = useControllableState<string[]>({
    defaultValue,
    value,
  })
  const isComposingRef = useRef(false)

  const visibleSuggestions = suggestions
    .filter((option) => !currentValue.includes(normalizeValue(option.value, { pattern, uppercase })))
    .slice(0, maxSuggestions)

  const setValue = (nextValue: string[]) => {
    if (disabled || readOnly) {
      return
    }

    const normalizedValue = normalizeStringArray(nextValue, {
      pattern,
      uppercase,
    })
    setCurrentValue(normalizedValue)
    onValueChange?.(normalizedValue)
  }

  const syncInputValue = (input: HTMLInputElement, { isDeleting = false }: { isDeleting?: boolean } = {}) => {
    const nextValue = formatPatternValue(input.value, {
      isDeleting,
      pattern,
      uppercase,
    })

    if (nextValue !== input.value) {
      input.value = nextValue
    }
  }

  return (
    <Stack gap={2} w="full">
      <TagsInput.Root
        blurBehavior="add"
        disabled={disabled}
        invalid={invalid}
        name={name}
        onValueChange={(details) => setValue(details.value)}
        readOnly={readOnly}
        required={required}
        value={currentValue}
        width="full"
      >
        <TagsInput.Control>
          <TagsInput.Items />
          <TagsInput.Input
            aria-describedby={describedBy}
            aria-errormessage={ariaErrorMessage}
            aria-invalid={invalid || undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            autoComplete={autoComplete}
            id={id}
            onCompositionEnd={(event) => {
              isComposingRef.current = false
              syncInputValue(event.currentTarget)
            }}
            onCompositionStart={() => {
              isComposingRef.current = true
            }}
            onInput={(event) => {
              const nativeEvent = event.nativeEvent as InputEvent

              if (nativeEvent.isComposing || isComposingRef.current) {
                return
              }

              syncInputValue(event.currentTarget, {
                isDeleting: nativeEvent.inputType?.startsWith('delete') ?? false,
              })
            }}
            placeholder={placeholder}
            ref={ref}
          />
        </TagsInput.Control>
      </TagsInput.Root>

      {helperText ? (
        <Text color="fg.subtle" id={resolvedHelperTextId} textStyle="meta">
          {helperText}
        </Text>
      ) : null}

      {visibleSuggestions.length ? (
        <Wrap gap={2}>
          {visibleSuggestions.map((option) => (
            <Button
              borderRadius="md"
              disabled={disabled || readOnly}
              key={option.value}
              onClick={() => setValue([...currentValue, normalizeValue(option.value, { pattern, uppercase })])}
              size="xs"
              type="button"
              variant="outline"
            >
              {option.label}
            </Button>
          ))}
        </Wrap>
      ) : null}
    </Stack>
  )
})

export default TagsField

function formatPatternValue(
  value: string,
  {
    isDeleting = false,
    pattern,
    uppercase = false,
  }: {
    isDeleting?: boolean
    pattern?: string
    uppercase?: boolean
  },
) {
  const normalizedText = normalizeText(value, uppercase)

  if (!pattern || !normalizedText) {
    return normalizedText
  }

  const inputChars = [...normalizedText]
  const formattedChars: string[] = []
  let inputIndex = 0

  for (let patternIndex = 0; patternIndex < pattern.length; patternIndex += 1) {
    const patternChar = pattern[patternIndex]

    if (!patternChar) {
      break
    }

    if (isPatternSlot(patternChar)) {
      while (inputIndex < inputChars.length) {
        const inputChar = inputChars[inputIndex]

        if (inputChar && matchesPatternSlot(inputChar, patternChar)) {
          break
        }

        inputIndex += 1
      }

      const inputChar = inputChars[inputIndex]

      if (!inputChar) {
        break
      }

      formattedChars.push(inputChar)
      inputIndex += 1
      continue
    }

    if (
      formattedChars.length &&
      hasRemainingPatternSlots(pattern, patternIndex + 1) &&
      (!isDeleting || inputIndex < inputChars.length)
    ) {
      formattedChars.push(patternChar)
    }
  }

  return formattedChars.join('')
}

function hasRemainingPatternSlots(pattern: string, fromIndex: number) {
  return [...pattern.slice(fromIndex)].some((char) => isPatternSlot(char))
}

function isPatternSlot(patternChar: string) {
  return patternChar === '9' || patternChar === 'A' || patternChar === 'X'
}

function matchesPatternSlot(inputChar: string, patternChar: string) {
  if (patternChar === '9') {
    return /\d/.test(inputChar)
  }

  if (patternChar === 'A') {
    return /[A-Z]/i.test(inputChar)
  }

  return /[A-Z0-9]/i.test(inputChar)
}

function normalizeStringArray(
  values: Array<null | string | undefined>,
  {
    pattern,
    uppercase = false,
  }: {
    pattern?: string
    uppercase?: boolean
  },
) {
  return uniqueValues(values.map((value) => normalizeValue(value, { pattern, uppercase })))
}

function normalizeText(value: null | string | undefined, uppercase = false) {
  const trimmedValue = stripDiacritics(String(value || '').trim())

  if (!trimmedValue) return ''

  return uppercase ? trimmedValue.toUpperCase() : trimmedValue
}

function normalizeValue(
  value: null | string | undefined,
  {
    pattern,
    uppercase = false,
  }: {
    pattern?: string
    uppercase?: boolean
  },
) {
  const normalizedText = normalizeText(value, uppercase)

  if (!normalizedText) return ''
  if (!pattern) return normalizedText

  return formatPatternValue(normalizedText, {
    isDeleting: true,
    pattern,
    uppercase,
  })
}

function stripDiacritics(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u0111/g, 'd')
    .replace(/\u0110/g, 'D')
}

function uniqueValues(values: Array<null | string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value)))]
}
