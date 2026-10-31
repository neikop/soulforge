import { Alert, Box, Button, EmptyState, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { Skeleton } from 'components/ui'
import { useState } from 'react'
import { FiArchive, FiRefreshCw } from 'react-icons/fi'

import { DocsCard, SectionHeading } from '../shared'

const alertStatuses = ['neutral', 'info', 'success', 'warning', 'error'] as const
const alertVariants = ['subtle', 'surface', 'outline', 'solid'] as const

export function FeedbackSection() {
  const [isEmptyLoading, setIsEmptyLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  return (
    <Stack gap={5} id="feedback" scrollMarginTop="12px">
      <SectionHeading
        eyebrow="Feedback"
        subtitle="Alerts communicate status without inventing feature-specific styling. Empty State describes an absent result and leaves recovery actions to the feature."
        title="Use the right semantic surface for each state."
      />

      <DocsCard title="Alert status and variant matrix">
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
          {alertStatuses.map((status) => (
            <Alert.Root key={status} status={status}>
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{status.charAt(0).toUpperCase() + status.slice(1)} status</Alert.Title>
                <Alert.Description>Static guidance is not announced as a live update.</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
          {alertVariants.map((variant) => (
            <Alert.Root key={variant} status="info" variant={variant}>
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>{variant.charAt(0).toUpperCase() + variant.slice(1)}</Alert.Title>
                <Alert.Description>Semantic colors remain readable in both modes.</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          ))}
        </SimpleGrid>
      </DocsCard>

      <DocsCard title="Intentional live feedback">
        <Stack alignItems="flex-start" gap={4}>
          <Button onClick={() => setIsSaved((value) => !value)} size="sm" variant="outline">
            {isSaved ? 'Reset example' : 'Simulate save'}
          </Button>
          {isSaved && (
            <Alert.Root aria-live="polite" role="status" status="success">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Settings saved</Alert.Title>
                <Alert.Description>This asynchronous result is intentionally announced.</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}
        </Stack>
      </DocsCard>

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={5}>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <DocsCard key={size} title={`${size.toUpperCase()} empty state`}>
            <EmptyState.Root size={size}>
              <EmptyState.Content>
                <EmptyState.Indicator aria-hidden="true">
                  <FiArchive />
                </EmptyState.Indicator>
                <EmptyState.Title>No archived projects</EmptyState.Title>
                <EmptyState.Description>Archived projects will appear here.</EmptyState.Description>
                <HStack>
                  <Button colorPalette="primary" size="sm" variant="solid">
                    Create project
                  </Button>
                  <Button size="sm" variant="outline">
                    Learn more
                  </Button>
                </HStack>
              </EmptyState.Content>
            </EmptyState.Root>
          </DocsCard>
        ))}
      </SimpleGrid>

      <DocsCard title="Loading to empty with reserved geometry">
        <Stack alignItems="flex-start" gap={4}>
          <Button onClick={() => setIsEmptyLoading((value) => !value)} size="sm" variant="outline">
            Show {isEmptyLoading ? 'empty result' : 'loading'}
          </Button>
          <Box aria-busy={isEmptyLoading} height="14rem" width="full">
            {isEmptyLoading ? (
              <Skeleton height="14rem" />
            ) : (
              <EmptyState.Root height="full" size="sm">
                <EmptyState.Content height="full">
                  <EmptyState.Indicator aria-hidden="true">
                    <FiArchive />
                  </EmptyState.Indicator>
                  <EmptyState.Title>No results yet</EmptyState.Title>
                  <EmptyState.Description>The loaded state occupies the same reserved region.</EmptyState.Description>
                </EmptyState.Content>
              </EmptyState.Root>
            )}
          </Box>
        </Stack>
      </DocsCard>

      <DocsCard title="Recoverable error">
        <Alert.Root status="error" variant="surface">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Projects could not be loaded</Alert.Title>
            <Alert.Description>Keep errors in Alert instead of adding an error mode to Empty State.</Alert.Description>
          </Alert.Content>
          <HStack>
            <Button colorPalette="error" size="sm" variant="outline">
              <FiRefreshCw />
              Retry
            </Button>
          </HStack>
        </Alert.Root>
        <Text color="fg.subtle" textStyle="body">
          The owning feature supplies retry behavior, reserved height and any product-specific illustration.
        </Text>
      </DocsCard>
    </Stack>
  )
}
