import type { GroupBase, InputProps } from 'react-select'

import { components } from 'react-select'

export default function Input<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: InputProps<Option, IsMulti, Group>,
) {
  return <components.Input<Option, IsMulti, Group> {...props} isHidden readOnly />
}
