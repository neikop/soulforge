import { Box, Code, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react'

import { DocsCard, SectionHeading } from '../shared'

const statusFamilies = [
  {
    description: 'Brand accent for selected states, active emphasis, and CTA styling.',
    label: 'Primary',
    palette: {
      border: 'primary.border',
      contrast: 'primary.contrast',
      fg: 'primary.fg',
      main: 'primary.main',
      muted: 'primary.muted',
      solid: 'primary.solid',
      solidHover: 'primary.solidHover',
      strong: 'primary.strong',
      subtle: 'primary.subtle',
      surface: 'primary.surface',
    },
  },
  {
    description: 'Positive state family for completion, confirmation, and healthy data.',
    label: 'Success',
    palette: {
      border: 'success.border',
      contrast: 'success.contrast',
      fg: 'success.fg',
      main: 'success.main',
      muted: 'success.muted',
      solid: 'success.solid',
      solidHover: 'success.solidHover',
      strong: 'success.strong',
      subtle: 'success.subtle',
      surface: 'success.surface',
    },
  },
  {
    description: 'Caution family for pending review, warning, and non-blocking attention.',
    label: 'Warning',
    palette: {
      border: 'warning.border',
      contrast: 'warning.contrast',
      fg: 'warning.fg',
      main: 'warning.main',
      muted: 'warning.muted',
      solid: 'warning.solid',
      solidHover: 'warning.solidHover',
      strong: 'warning.strong',
      subtle: 'warning.subtle',
      surface: 'warning.surface',
    },
  },
  {
    description: 'Destructive family for validation, errors, and irreversible actions.',
    label: 'Error',
    palette: {
      border: 'error.border',
      contrast: 'error.contrast',
      fg: 'error.fg',
      main: 'error.main',
      muted: 'error.muted',
      solid: 'error.solid',
      solidHover: 'error.solidHover',
      strong: 'error.strong',
      subtle: 'error.subtle',
      surface: 'error.surface',
    },
  },
  {
    description: 'Secondary accent family for informative states and supportive highlights.',
    label: 'Info',
    palette: {
      border: 'info.border',
      contrast: 'info.contrast',
      fg: 'info.fg',
      main: 'info.main',
      muted: 'info.muted',
      solid: 'info.solid',
      solidHover: 'info.solidHover',
      strong: 'info.strong',
      subtle: 'info.subtle',
      surface: 'info.surface',
    },
  },
  {
    description: 'Neutral state family for disabled, unavailable, or de-emphasized UI.',
    label: 'Disabled',
    palette: {
      border: 'disabled.border',
      contrast: 'disabled.contrast',
      fg: 'disabled.fg',
      main: 'disabled.main',
      muted: 'disabled.muted',
      solid: 'disabled.solid',
      solidHover: 'disabled.solidHover',
      strong: 'disabled.strong',
      subtle: 'disabled.subtle',
      surface: 'disabled.surface',
    },
  },
] as const

const neutralTokens = [
  {
    description: 'Base surface for pages, cards, menus, and standard panels.',
    previewBackground: 'bg.canvas',
    previewBorder: 'border.default',
    previewColor: 'fg.default',
    tone: 'bg.canvas',
  },
  {
    description: 'Light neutral lift for grouped sections and shell backgrounds.',
    previewBackground: 'bg.subtle',
    previewBorder: 'transparent',
    previewColor: 'fg.default',
    tone: 'bg.subtle',
  },
  {
    description: 'Stronger neutral fill for muted controls and lower emphasis blocks.',
    previewBackground: 'bg.muted',
    previewBorder: 'transparent',
    previewColor: 'fg.default',
    tone: 'bg.muted',
  },
  {
    description: 'Subtle default border shared by dividers, surfaces, and idle form controls.',
    previewBackground: 'bg.canvas',
    previewBorder: 'border.default',
    previewColor: 'fg.default',
    tone: 'border.default',
  },
  {
    description: 'Readable default text color used globally for body copy.',
    previewBackground: 'bg.canvas',
    previewBorder: 'border.default',
    previewColor: 'fg.default',
    tone: 'fg.default',
  },
  {
    description: 'Secondary text color for labels, descriptions, and helper copy.',
    previewBackground: 'bg.canvas',
    previewBorder: 'border.default',
    previewColor: 'fg.muted',
    tone: 'fg.muted',
  },
  {
    description: 'Lowest-emphasis neutral text for metadata and supporting labels.',
    previewBackground: 'bg.canvas',
    previewBorder: 'border.default',
    previewColor: 'fg.subtle',
    tone: 'fg.subtle',
  },
  {
    description: 'Inverse text for colored surfaces and dark overlays.',
    previewBackground: 'bg.overlay',
    previewBorder: 'transparent',
    previewColor: 'fg.inverse',
    tone: 'fg.inverse',
  },
  {
    description: 'Dedicated overlay token for masks, scrims, and blocking layers.',
    previewBackground: 'bg.overlay',
    previewBorder: 'transparent',
    previewColor: 'fg.inverse',
    tone: 'bg.overlay',
  },
] as const

const semanticRows = [
  { kind: 'surface', tokenKey: 'surface' },
  { kind: 'surface', tokenKey: 'subtle' },
  { kind: 'surface', tokenKey: 'muted' },
  { kind: 'border', tokenKey: 'border' },
  { kind: 'text', tokenKey: 'main' },
  { kind: 'fill', tokenKey: 'solid' },
  { kind: 'fill', tokenKey: 'solidHover' },
  { kind: 'text', tokenKey: 'fg' },
  { kind: 'text', tokenKey: 'strong' },
  { kind: 'contrast', tokenKey: 'contrast' },
] as const

const semanticExamples = [
  '`primary.main`',
  '`primary.solid`',
  '`primary.contrast`',
  '`info.subtle`',
  '`success.fg`',
  '`error.surface`',
  '`bg.canvas`',
  '`fg.subtle`',
] as const

const antiExamples = ['`primary.100`', '`blue.solid`', '`gray.500`', 'hex', 'rgba'] as const

const usageCards = [
  {
    description: 'Default card and panel pattern. Start here before introducing any semantic state.',
    label: 'Neutral Surface',
    tokens: ['bg.canvas', 'border.default', 'fg.default'],
  },
  {
    description: 'Selected or highlighted control state for pills, active rows, and lightweight emphasis.',
    label: 'Selected State',
    tokens: ['primary.surface', 'primary.border', 'primary.strong'],
  },
  {
    description: 'Filled controls such as solid buttons rely on the `solid` + `contrast` pair.',
    label: 'Solid Action',
    tokens: ['primary.solid', 'primary.contrast'],
  },
  {
    description: 'Recipe-driven subtle controls typically move across `subtle`, `muted`, `border`, and `fg`.',
    label: 'Recipe Layer',
    tokens: ['info.subtle', 'info.muted', 'info.border', 'info.fg'],
  },
] as const

export function TokenSection() {
  return (
    <Stack gap={5} id="tokens" scrollMarginTop="28">
      <SectionHeading
        eyebrow="Tokens"
        subtitle="The current theme exposes a compact neutral base plus semantic families that now power both app-level styling and Chakra recipe `colorPalette` behavior."
        title="Tokens define meaning before color."
      />

      <DocsCard title="Notes">
        <Stack gap={3}>
          <Text color="fg.subtle" textStyle="body">
            Use semantic names such as {semanticExamples.join(', ')} instead of raw palette references.
          </Text>
          <Text color="fg.subtle" textStyle="body">
            The neutral layer stays intentionally small: `bg.*`, `fg.*`, and a single subtle `border.default`. Override
            those only when an interaction or semantic state changes the meaning.
          </Text>
          <Text color="fg.subtle" textStyle="body">
            Semantic families now expose two layers at once: app-facing aliases like `main`, `strong`, and `surface`,
            plus recipe-facing helpers like `solid`, `solidHover`, `contrast`, `subtle`, `muted`, and `fg`.
          </Text>
          <Text color="fg.subtle" textStyle="body">
            Use the page-header mode control to inspect the complete light and dark mappings on this same guide.
          </Text>
          <Text color="fg.subtle" textStyle="body">
            Avoid raw palette references such as {antiExamples.join(', ')} in runtime UI code.
          </Text>
        </Stack>
      </DocsCard>

      <DocsCard title="Neutral Defaults">
        <Stack gap={3}>
          <Text textStyle="body">
            Soul Binding and Genus Insight share the same panel, table, tab and control recipes. Priority colors use
            matrix tokens; all other surfaces use the neutral theme. Titles use bold, labels use mid and supporting text
            uses normal.
          </Text>
          <HStack flexWrap="wrap" gap={3}>
            {(['top', 's', 'aplus', 'a', 'percent', 'pvp'] as const).map((tone) => (
              <Box
                background={`matrix.${tone}.surface`}
                borderColor={`matrix.${tone}.border`}
                borderRadius="sm"
                borderWidth={1}
                color={`matrix.${tone}.fg`}
                key={tone}
                p={3}
                textStyle="matrixPill"
              >
                matrix.{tone}
              </Box>
            ))}
          </HStack>
        </Stack>
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
          {neutralTokens.map((token) => (
            <Stack borderRadius="md" borderWidth={1} gap={4} key={token.tone} p={4}>
              <HStack gap={3}>
                <Box
                  background={token.previewBackground}
                  borderColor={token.previewBorder}
                  borderRadius="full"
                  borderWidth={1}
                  color={token.previewColor}
                  display="flex"
                  h={8}
                  justifyContent="center"
                  w={8}
                />
                <Code background="bg.subtle" color="fg.default">
                  {token.tone}
                </Code>
              </HStack>
              <Text textStyle="title">{token.tone}</Text>
              <Text color="fg.subtle" textStyle="body">
                {token.description}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </DocsCard>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={5}>
        {statusFamilies.map((family) => (
          <DocsCard key={family.label} title={family.label}>
            <Stack gap={4}>
              <Text color="fg.subtle" textStyle="body">
                {family.description}
              </Text>
              <Stack gap={2}>
                {semanticRows.map((row) => {
                  const preview = getSemanticPreviewProps(row.kind, family.palette, row.tokenKey)

                  return (
                    <HStack
                      background={preview.background}
                      borderColor={preview.borderColor}
                      borderRadius="md"
                      borderWidth={1}
                      color={preview.color}
                      gap={3}
                      justify="space-between"
                      key={`${family.label}-${row.tokenKey}`}
                      px={3}
                      py={2}
                    >
                      <Text textStyle="meta">{row.tokenKey}</Text>
                      <Code background="bg.canvas" color="fg.default">
                        {family.palette[row.tokenKey]}
                      </Code>
                    </HStack>
                  )
                })}
              </Stack>
            </Stack>
          </DocsCard>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={5}>
        {usageCards.map((card) => (
          <DocsCard key={card.label} title={card.label}>
            <Stack gap={4}>
              <Text textStyle="title">{card.label}</Text>
              <Stack gap={2}>
                {card.tokens.map((token) => (
                  <Code background="bg.subtle" color="fg.default" key={`${card.label}-${token}`}>
                    {token}
                  </Code>
                ))}
              </Stack>
              <Text color="fg.subtle" textStyle="body">
                {card.description}
              </Text>
            </Stack>
          </DocsCard>
        ))}
      </SimpleGrid>
    </Stack>
  )
}

function getSemanticPreviewProps(
  kind: (typeof semanticRows)[number]['kind'],
  palette: (typeof statusFamilies)[number]['palette'],
  tokenKey: keyof (typeof statusFamilies)[number]['palette'],
) {
  if (kind === 'contrast') {
    return {
      background: palette.solid,
      borderColor: 'transparent',
      color: palette.contrast,
    }
  }

  if (kind === 'text') {
    return {
      background: palette.surface,
      borderColor: palette.border,
      color: palette[tokenKey],
    }
  }

  if (kind === 'border') {
    return {
      background: 'bg.canvas',
      borderColor: palette.border,
      color: 'fg.default',
    }
  }

  if (kind === 'surface') {
    return {
      background: palette[tokenKey],
      borderColor: 'transparent',
      color: 'fg.default',
    }
  }

  return {
    background: palette[tokenKey],
    borderColor: 'transparent',
    color: 'fg.inverse',
  }
}
