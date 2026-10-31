import type { ClearIndicatorProps, GroupBase } from 'react-select'

import { components } from 'react-select'

import SelectIcon from './Icon'

export default function ClearIndicator<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: ClearIndicatorProps<Option, IsMulti, Group>,
) {
  return (
    <components.ClearIndicator {...props}>
      <SelectIcon>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </SelectIcon>
    </components.ClearIndicator>
  )
}
