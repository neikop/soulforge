import type { GroupBase, OptionProps } from 'react-select'

import { Box } from '@chakra-ui/react'
import { components } from 'react-select'

import SelectIcon from './Icon'

export default function OptionComponent<Option, IsMulti extends boolean, Group extends GroupBase<Option>>(
  props: OptionProps<Option, IsMulti, Group>,
) {
  return (
    <components.Option {...props}>
      <Box alignItems="center" as="span" display="flex" gap={2} justifyContent="space-between" width="full">
        <Box as="span" minWidth={0}>
          {props.children}
        </Box>
        {props.isSelected ? (
          <Box alignItems="center" as="span" display="inline-flex" flexShrink={0} justifyContent="center">
            <SelectIcon>
              <path d="m5 12 5 5L20 7" />
            </SelectIcon>
          </Box>
        ) : null}
      </Box>
    </components.Option>
  )
}
