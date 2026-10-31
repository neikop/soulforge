import type { ReactNode } from 'react'

import { Stack, type StackProps, Text } from '@chakra-ui/react'

export function DocsCard({
  children,
  containerProps,
  minH,
  title,
}: {
  children: ReactNode
  containerProps?: Omit<StackProps, 'children'>
  minH?: number | string
  title: string
}) {
  return (
    <Stack
      backdropFilter="blur(14px)"
      background="bg.canvas"
      borderRadius="lg"
      borderWidth={1}
      gap={4}
      minH={minH}
      p={{ base: 5, md: 6 }}
      position="relative"
      {...containerProps}
    >
      <Text textStyle="title">{title}</Text>
      {children}
    </Stack>
  )
}

export function SectionHeading({ eyebrow, subtitle, title }: { eyebrow: string; subtitle: string; title: string }) {
  return (
    <Stack gap={3}>
      <Text color="primary.main" textStyle="meta">
        {eyebrow}
      </Text>
      <Stack gap={1}>
        <Text textStyle="sectionTitle">{title}</Text>
        <Text color="fg.subtle" maxW="2xl" textStyle="body">
          {subtitle}
        </Text>
      </Stack>
    </Stack>
  )
}
