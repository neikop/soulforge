import { Badge, SimpleGrid, Stack, Text } from '@chakra-ui/react'

import { DocsCard, SectionHeading } from '../shared'

const typographyItems = [
  {
    helper: 'Used for page hero headlines and high-emphasis marketing copy.',
    label: 'display',
    metrics: '30/36px → 48/56px · bold 700',
    preview: 'Components that look production ready before you touch CSS.',
  },
  {
    helper: 'Used for route section headings and prominent content groups.',
    label: 'sectionTitle',
    metrics: '24/32px → 30/36px · bold 700',
    preview: 'Typography stays constrained and predictable.',
  },
  {
    helper: 'Used for card titles and navigational emphasis.',
    label: 'title',
    metrics: '16/24px · bold 700',
    preview: 'Two select implementations, one comparison surface.',
  },
  {
    helper: 'Used for paragraphs, helper copy and most long-form UI text.',
    label: 'body',
    metrics: '14/20px · normal 400',
    preview: 'The body style is the default reading rhythm. Override only when the layout needs a clear size jump.',
  },
  {
    helper: 'Used for labels, overlines, small grouping headers and subtle metadata.',
    label: 'meta',
    metrics: '12/16px · mid 600',
    preview: 'Design System',
  },
] as const

const controlTypographyItems = [
  {
    helper: 'Compact buttons and dense actions.',
    label: 'actionCompact',
    metrics: '12/16px · mid 600',
    preview: 'Compact action',
  },
  {
    helper: 'Default buttons and interactive labels.',
    label: 'action',
    metrics: '14/20px · mid 600',
    preview: 'Default action',
  },
  {
    helper: 'Large buttons and prominent actions.',
    label: 'actionLarge',
    metrics: '16/24px · mid 600',
    preview: 'Large action',
  },
  {
    helper: 'Default input, select and editable values.',
    label: 'field',
    metrics: '14/20px · normal 400',
    preview: 'Default field value',
  },
  {
    helper: 'Large input, select and editable values.',
    label: 'fieldLarge',
    metrics: '16/24px · normal 400',
    preview: 'Large field value',
  },
] as const

const fontWeightItems = [
  {
    helper: 'Body copy and supporting text.',
    label: 'normal · 400',
    role: 'Body',
    textStyle: 'body',
  },
  {
    helper: 'Buttons, labels and selected controls.',
    label: 'mid · 600',
    role: 'Action',
    textStyle: 'action',
  },
  {
    helper: 'Titles and high-emphasis headings.',
    label: 'bold · 700',
    role: 'Title',
    textStyle: 'title',
  },
] as const

export function TypographySection() {
  return (
    <Stack gap={5} id="typography" scrollMarginTop="12px">
      <SectionHeading
        eyebrow="Typography"
        subtitle="Content and control roles each own a fixed size, line-height and weight combination. Product UI uses only normal, mid and bold weights."
        title="Typography stays constrained and predictable."
      />

      <DocsCard title="Scale">
        <Stack gap={4}>
          {typographyItems.map((item) => (
            <Stack borderRadius="md" borderWidth={1} gap={3} key={item.label} p={4}>
              <Stack alignItems="flex-start" gap={2}>
                <Badge background="primary.surface" color="primary.strong">
                  {item.label} · {item.metrics}
                </Badge>
                <Text color={item.label === 'meta' ? 'primary.main' : undefined} textStyle={item.label}>
                  {item.preview}
                </Text>
              </Stack>
              <Text color="fg.subtle" textStyle="body">
                {item.helper}
              </Text>
            </Stack>
          ))}
        </Stack>
      </DocsCard>

      <DocsCard title="Control roles">
        <Stack gap={4}>
          {controlTypographyItems.map((item) => (
            <Stack borderRadius="md" borderWidth={1} gap={2} key={item.label} p={4}>
              <Badge alignSelf="flex-start" background="primary.surface" color="primary.strong">
                {item.label} · {item.metrics}
              </Badge>
              <Text textStyle={item.label}>{item.preview}</Text>
              <Text color="fg.subtle" textStyle="body">
                {item.helper}
              </Text>
            </Stack>
          ))}
        </Stack>
      </DocsCard>

      <DocsCard title="Weight roles">
        <Text color="fg.subtle" textStyle="body">
          Weight is selected by semantic text role, never by an ad-hoc numeric value at the call site.
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
          {fontWeightItems.map((item) => (
            <Stack borderRadius="md" borderWidth={1} gap={2} key={item.label} p={4}>
              <Text textStyle={item.textStyle}>
                {item.role} · {item.label}
              </Text>
              <Text color="fg.subtle" textStyle="body">
                {item.helper}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </DocsCard>
    </Stack>
  )
}
