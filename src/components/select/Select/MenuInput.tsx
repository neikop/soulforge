import type { InputActionMeta } from 'react-select'

import { Input } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'

type MenuInputProps = {
  focusMenuOption: (direction?: 'down' | 'up') => void
  fontSize: string
  inputValue: string
  lineHeight: string
  onInputChange: (nextValue: string, actionMeta: InputActionMeta) => string
  onMenuBlur: () => void
  onMenuFocus: () => void
  placeholder?: string
  selectFocusedOption: () => void
}

export default function MenuInput({
  focusMenuOption,
  fontSize,
  inputValue,
  lineHeight,
  onInputChange,
  onMenuBlur,
  onMenuFocus,
  placeholder,
  selectFocusedOption,
}: MenuInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      inputRef.current?.focus()
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <Input
      autoComplete="off"
      autoCorrect="off"
      borderWidth={0}
      boxShadow="none"
      focusRing="none"
      fontSize={fontSize}
      height={6}
      lineHeight={lineHeight}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget as HTMLElement | null

        // Clicking a react-select option can blur this input before the option
        // receives focus, leaving relatedTarget empty for a moment.
        if (!nextTarget) {
          return
        }

        if (isSelectInternalInput(nextTarget)) {
          return
        }

        if (!nextTarget.closest('[data-select-menu-root="true"]')) {
          onMenuBlur()
        }
      }}
      onChange={(event) => {
        onInputChange(event.target.value, {
          action: 'input-change',
          prevInputValue: inputValue,
        })
      }}
      onFocus={onMenuFocus}
      onKeyDown={(event) => {
        event.stopPropagation()

        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          focusMenuOption(event.key === 'ArrowDown' ? 'down' : 'up')
          return
        }

        if (event.key === 'Enter') {
          if (event.nativeEvent.isComposing) {
            return
          }

          event.preventDefault()
          selectFocusedOption()
          return
        }

        if (event.key === 'Escape' || event.key === 'Tab') {
          onMenuBlur()
        }
      }}
      onMouseDown={(event) => {
        event.stopPropagation()
        event.currentTarget.focus()
      }}
      placeholder={placeholder ?? 'Search...'}
      px="0"
      ref={inputRef}
      spellCheck={false}
      value={inputValue}
    />
  )
}

function isSelectInternalInput(node: HTMLElement) {
  return node.classList.contains('chakra-select__input')
}
