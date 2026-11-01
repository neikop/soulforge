import { Flex, type FlexProps, Heading, Text } from '@chakra-ui/react'
import { forwardRef } from 'react'

export type PageHeaderProps = Omit<FlexProps, 'children' | 'title'> & {
  context: string
  progress?: { label: string; total: number; value: number }
  title: string
}

/** Compact route heading with context and optional live progress; wraps naturally on narrow screens. */
const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader(
  { context, progress, title, ...props },
  ref,
) {
  return (
    <Flex align="center" as="header" flexWrap="wrap" gap={3} justify="space-between" ref={ref} {...props}>
      <Flex align="baseline" flexWrap="wrap" gap={3}>
        <Heading as="h1" textStyle="titleLarge">
          {title}
        </Heading>
        <Text color="fg.muted" textStyle="bodyCompact">
          {context}
        </Text>
      </Flex>
      {progress && (
        <Text aria-live="polite" color="fg.muted" role="status" textStyle="bodyCompact" whiteSpace="nowrap">
          <Text as="span" color="fg.default" fontVariantNumeric="tabular-nums" textStyle="actionCompact">
            {progress.value}/{progress.total}
          </Text>{' '}
          {progress.label}
        </Text>
      )}
    </Flex>
  )
})

export default PageHeader
