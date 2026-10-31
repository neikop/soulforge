import type { ReactNode } from 'react'
import type { GroupBase, ValueContainerProps } from 'react-select'

import { components } from 'react-select'

import type { InternalSelectProps } from './types'

export default function ValueContainer<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: ValueContainerProps<Option, IsMulti, Group>,
) {
  const selectProps = props.selectProps as unknown as InternalSelectProps<Option, IsMulti, Group>

  if (!selectProps.__menuSearchEnabled) {
    return <components.ValueContainer {...props} />
  }

  const Placeholder = selectProps.components?.Placeholder ?? components.Placeholder

  const [renderedValue, renderedInput] = props.children as [ReactNode, ReactNode]

  return (
    <components.ValueContainer {...props}>
      {!props.hasValue || !selectProps.controlShouldRenderValue ? (
        <Placeholder
          {...props}
          innerProps={{
            id: `react-select-${selectProps.instanceId}-placeholder`,
          }}
          isDisabled={Boolean(selectProps.isDisabled)}
          isFocused={Boolean(selectProps.menuIsOpen)}
        >
          {selectProps.placeholder}
        </Placeholder>
      ) : (
        renderedValue
      )}
      {renderedInput}
    </components.ValueContainer>
  )
}
