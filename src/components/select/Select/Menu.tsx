import type { GroupBase, MenuProps } from 'react-select'

import { Box, Stack } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import { components } from 'react-select'

import type { InternalSelectProps } from './types'

import MenuInput from './MenuInput'
import { shouldCloseMenuFromPointerEvent } from './menuInteraction'

export default function Menu<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: MenuProps<Option, IsMulti, Group>,
) {
  const ref = useRef<HTMLDivElement | null>(null)
  const selectProps = props.selectProps as unknown as InternalSelectProps<Option, IsMulti, Group>
  const onMenuBlur = selectProps.__onMenuBlur

  useEffect(() => {
    const handler = (event: Event) => {
      if (
        !shouldCloseMenuFromPointerEvent({
          event,
          menuRoot: ref.current,
        })
      ) {
        return
      }

      onMenuBlur()
    }

    const eventRoot = getEventRoot(ref.current)

    eventRoot.addEventListener('mousedown', handler)
    eventRoot.addEventListener('touchstart', handler)

    return () => {
      eventRoot.removeEventListener('mousedown', handler)
      eventRoot.removeEventListener('touchstart', handler)
    }
  }, [onMenuBlur])

  return (
    <components.Menu {...props}>
      <Stack data-select-menu-root="true" gap={0} ref={ref}>
        {selectProps.__menuSearchEnabled ? (
          <Box borderBottomWidth={1} px={3} py={1.5}>
            <MenuInput
              focusMenuOption={selectProps.__focusMenuOption}
              fontSize={selectProps.__fontSize}
              inputValue={selectProps.__menuInputValue}
              lineHeight={selectProps.__lineHeight}
              onInputChange={selectProps.__onMenuInputChange}
              onMenuBlur={selectProps.__onMenuBlur}
              onMenuFocus={selectProps.__onMenuFocus}
              placeholder={selectProps.__menuInputPlaceholder}
              selectFocusedOption={selectProps.__selectFocusedOption}
            />
          </Box>
        ) : null}
        {props.children}
      </Stack>
    </components.Menu>
  )
}

function getEventRoot(element: HTMLDivElement | null) {
  const rootNode = element?.getRootNode()

  if (rootNode instanceof ShadowRoot || rootNode instanceof Document) {
    return rootNode
  }

  return document
}
