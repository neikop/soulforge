import { Box, Stack, type StackProps, Text } from '@chakra-ui/react'
import { forwardRef } from 'react'

import Skeleton, { type SkeletonProps } from './Skeleton'

const skeletonHeights = {
  action: '3.5',
  actionCompact: '3',
  actionLarge: '4',
  body: '3.5',
  display: { base: '1.875rem', md: '3rem' },
  field: '3.5',
  fieldLarge: '4',
  meta: '3',
  sectionTitle: { base: '1.5rem', md: '1.875rem' },
  title: '4',
} as const

type SkeletonTextSize = keyof typeof skeletonHeights

export type SkeletonTextProps = Omit<StackProps, 'children'> & {
  lastLineWidth?: SkeletonProps['width']
  lines?: number
  size?: SkeletonTextSize
}

/**
 * Multi-line placeholder that reserves the same line boxes as a shared text style.
 *
 * Match `size` and `lines` to the final copy. Use the base `Skeleton` with explicit geometry for typography outside the
 * supported shared styles. The owning region remains responsible for exposing its loading state.
 */
const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(function SkeletonText(
  { lastLineWidth = '70%', lines = 3, size = 'body', ...props },
  ref,
) {
  const lineCount = Math.max(1, Math.floor(lines))

  return (
    <Stack {...props} aria-hidden="true" gap={0} ref={ref}>
      {Array.from({ length: lineCount }, (_, index) => (
        <Box key={index} position="relative">
          <Text textStyle={size} visibility="hidden">
            &nbsp;
          </Text>
          <Skeleton
            height={skeletonHeights[size]}
            insetInlineStart={0}
            position="absolute"
            top="50%"
            transform="translateY(-50%)"
            width={index === lineCount - 1 ? lastLineWidth : 'full'}
          />
        </Box>
      ))}
    </Stack>
  )
})

export default SkeletonText
