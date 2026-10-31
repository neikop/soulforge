import { Box, Button, HStack, SimpleGrid, Stack, Table, Text } from '@chakra-ui/react'
import { Skeleton, SkeletonText, TableCellSkeleton } from 'components/ui'
import { useState } from 'react'

import { DocsCard, SectionHeading } from '../shared'

const tableSkeletonRows = ['first-row', 'second-row', 'third-row'] as const

export function SkeletonSection() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Stack gap={5} id="skeletons" scrollMarginTop="12px">
      <SectionHeading
        eyebrow="Skeletons"
        subtitle="Skeleton is implemented locally with semantic theme colors. Its required height makes the loading footprint explicit instead of relying on content to reserve space."
        title="Loading states should preserve the final layout."
      />

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={5}>
        <DocsCard title="Shapes and text lines">
          <Stack gap={5}>
            <HStack alignItems="center" gap={3}>
              <Skeleton borderRadius="full" height={12} width={12} />
              <Stack flex={1} gap={2}>
                <Skeleton height={4} width="45%" />
                <Skeleton height={3} width="70%" />
              </Stack>
            </HStack>

            <SkeletonText lines={3} />
          </Stack>
        </DocsCard>

        <DocsCard title="Stable async region">
          <Stack gap={4}>
            <Button alignSelf="flex-start" onClick={() => setIsLoading((value) => !value)} size="sm" variant="outline">
              Show {isLoading ? 'content' : 'loading'}
            </Button>

            <HStack borderRadius="md" borderWidth={1} gap={4} height="5.25rem" px={4}>
              {isLoading ? (
                <>
                  <Skeleton borderRadius="full" height={12} width={12} />
                  <SkeletonText flex={1} lastLineWidth="55%" lines={2} />
                </>
              ) : (
                <>
                  <Box background="primary.surface" borderRadius="full" flexShrink={0} height={12} width={12} />
                  <Stack flex={1} gap={0} minW={0}>
                    <Text textStyle="body">Template component</Text>
                    <Text color="fg.subtle" textStyle="body">
                      Loading and content use the same 5.25rem region.
                    </Text>
                  </Stack>
                </>
              )}
            </HStack>
          </Stack>
        </DocsCard>
      </SimpleGrid>

      <DocsCard title="Table loading">
        <Text color="fg.subtle" textStyle="body">
          TableCellSkeleton is a static placeholder. The table body owns one shared pulse so every cell animates in
          sync, while the regular Skeleton keeps its individual shimmer for standalone regions. The table itself
          inherits the same md and outline defaults as loaded and empty states.
        </Text>
        <Table.ScrollArea>
          <Table.Root aria-busy="true" minWidth="32rem">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Product</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Total</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body _motionReduce={{ animation: 'none' }} animation="pulse 1.6s ease-in-out infinite">
              {tableSkeletonRows.map((row) => (
                <Table.Row key={row}>
                  <Table.Cell>
                    <HStack gap={3}>
                      <TableCellSkeleton circle height={8} width={8} />
                      <TableCellSkeleton height={3.5} width="8rem" />
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>
                    <TableCellSkeleton height={5} width="5rem" />
                  </Table.Cell>
                  <Table.Cell>
                    <TableCellSkeleton height={3.5} marginInlineStart="auto" width="4.5rem" />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </DocsCard>
    </Stack>
  )
}
