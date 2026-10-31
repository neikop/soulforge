import type { DropdownIndicatorProps, GroupBase } from 'react-select'

import { components } from 'react-select'

import SelectIcon from './Icon'

export default function DropdownIndicator<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: DropdownIndicatorProps<Option, IsMulti, Group>,
) {
  return (
    <components.DropdownIndicator {...props}>
      <SelectIcon>
        <path d="m6 9 6 6 6-6" />
      </SelectIcon>
    </components.DropdownIndicator>
  )
}
