import type { GroupBase, MenuListProps } from 'react-select'

import { Stack } from '@chakra-ui/react'
import { components } from 'react-select'

export default function MenuList<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: MenuListProps<Option, IsMulti, Group>,
) {
  return (
    <components.MenuList {...props}>
      <Stack gap={0.5} px={1} py={1}>
        {props.children}
      </Stack>
    </components.MenuList>
  )
}
