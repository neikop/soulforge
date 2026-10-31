import { SimpleGrid, Stack, Text } from '@chakra-ui/react'

import { DocsCard, SectionHeading } from '../shared'

export function OverviewSection() {
  return (
    <Stack id="overview" scrollMarginTop="12px">
      <SectionHeading
        eyebrow="Overview"
        subtitle="Built like a reference page, not a dev sandbox. The content reflects the current system: compact semantic tokens, shared recipes, and fewer component-level overrides."
        title="The page is organized like a UI library doc."
      />

      <SimpleGrid columns={{ base: 1, lg: 3 }} gap={5}>
        <DocsCard minH="13rem" title="Narrative layout">
          <Text color="fg.subtle" textStyle="body">
            The page introduces the system in layers: shared foundations first, then component previews, then token
            rules and edge cases.
          </Text>
        </DocsCard>

        <DocsCard minH="13rem" title="Interactive surface">
          <Text color="fg.subtle" textStyle="body">
            Components remain clickable and stateful, so this page doubles as a sanity check for default borders, text
            color inheritance and status token contrast.
          </Text>
        </DocsCard>

        <DocsCard minH="13rem" title="Compact tokens">
          <Text color="fg.subtle" textStyle="body">
            The current theme favors a short token vocabulary. Most UI should rely on defaults, then opt into semantic
            states only when meaning changes.
          </Text>
        </DocsCard>
      </SimpleGrid>
    </Stack>
  )
}
