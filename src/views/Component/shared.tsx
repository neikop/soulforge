import type { ReactNode } from 'react'

import { Heading, Stack, type StackProps, Text } from '@chakra-ui/react'

type DocsCardProps = {
  children: ReactNode
  containerProps?: Omit<StackProps, 'children'>
  minH?: number | string
  title: string
}

export function DocsCard({ children, containerProps, minH, title }: DocsCardProps) {
  return (
    <Stack gap={4} layerStyle="panel" minH={minH} p={{ base: 5, md: 6 }} position="relative" {...containerProps}>
      <Heading as="h3" textStyle="title">
        {title}
      </Heading>
      {children}
    </Stack>
  )
}

type SectionHeadingProps = { eyebrow: string; subtitle: string; title: string }

export function SectionHeading({ eyebrow, subtitle, title }: SectionHeadingProps) {
  return (
    <Stack gap={3}>
      <Text color="primary.main" textStyle="meta">
        {eyebrow}
      </Text>
      <Stack gap={1}>
        <Heading as="h2" textStyle="titleLarge">
          {title}
        </Heading>
        <Text color="fg.subtle" maxW="2xl" textStyle="body">
          {subtitle}
        </Text>
      </Stack>
    </Stack>
  )
}
