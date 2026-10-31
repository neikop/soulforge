import type { GroupBase, MultiValueRemoveProps } from 'react-select'

import { components } from 'react-select'

import SelectIcon from './Icon'

export default function MultiValueRemove<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: MultiValueRemoveProps<Option, IsMulti, Group>,
) {
  return (
    <components.MultiValueRemove {...props}>
      <SelectIcon>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </SelectIcon>
    </components.MultiValueRemove>
  )
}
