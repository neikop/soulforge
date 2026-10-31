import { Button, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { FormField, TagsField, toaster, ToggleButtonGroup, Tooltip } from 'components/ui'
import { useAlertDialog } from 'hooks/useAlertDialog'
import { useState } from 'react'

import { DocsCard, SectionHeading } from '../shared'

const tagSuggestions = [
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Chakra UI', value: 'chakra-ui' },
]

const densityOptions = [
  { label: 'Compact', value: 'compact' },
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Spacious', value: 'spacious' },
]

export function SharedUiSection() {
  const { openAlertDialog } = useAlertDialog()
  const [tags, setTags] = useState(['react'])
  const [densities, setDensities] = useState(['comfortable'])

  return (
    <Stack gap={5} id="shared-ui" scrollMarginTop="12px">
      <SectionHeading
        eyebrow="Shared UI"
        subtitle="These wrappers own reusable interaction policy while labels, state and domain decisions stay with the consuming feature."
        title="Shared behavior should have one documented contract."
      />

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={5}>
        <DocsCard title="Tags field">
          <Stack gap={5}>
            <FormField htmlFor="guide-tags" label="Technologies">
              <TagsField
                helperText="Add a tag or choose a suggestion."
                id="guide-tags"
                onValueChange={setTags}
                placeholder="Add a technology"
                suggestions={tagSuggestions}
                value={tags}
              />
            </FormField>

            <FormField htmlFor="guide-tags-readonly" label="Read only">
              <TagsField id="guide-tags-readonly" readOnly value={['react', 'typescript']} />
            </FormField>

            <FormField htmlFor="guide-tags-invalid" label="Invalid">
              <TagsField
                helperText="Tags must match the required project format."
                id="guide-tags-invalid"
                invalid
                value={['invalid']}
              />
            </FormField>
          </Stack>
        </DocsCard>

        <DocsCard title="Toggle button group">
          <Stack gap={3}>
            <Text color="fg.subtle" id="density-label" textStyle="meta">
              Content density
            </Text>
            <ToggleButtonGroup
              aria-labelledby="density-label"
              onChange={setDensities}
              options={densityOptions}
              value={densities}
            />
            <Text color="fg.subtle" textStyle="body">
              Selected: {densities.join(', ') || 'none'}
            </Text>
          </Stack>
        </DocsCard>

        <DocsCard title="Tooltip">
          <Stack alignItems="flex-start" gap={3}>
            <Tooltip content="Tooltips supplement a visible control label; they never replace it." hasArrow>
              <Button type="button" variant="outline">
                Focus or hover me
              </Button>
            </Tooltip>
            <Text color="fg.subtle" textStyle="body">
              Use a focusable trigger when the content explains an action.
            </Text>
          </Stack>
        </DocsCard>

        <DocsCard title="Global feedback">
          <HStack flexWrap="wrap" gap={3}>
            <Button
              onClick={() =>
                toaster.success({
                  description: 'Transient feedback is hosted once by AppProvider.',
                  title: 'Design-system toast',
                })
              }
              type="button"
              variant="outline"
            >
              Show toast
            </Button>
            <Button
              colorPalette="error"
              onClick={() =>
                openAlertDialog({
                  confirmColorPalette: 'error',
                  confirmText: 'Continue',
                  description: 'Use the shared alert dialog for decisions that require explicit confirmation.',
                  onConfirm: () => toaster.success({ title: 'Action confirmed' }),
                  title: 'Confirm this action?',
                })
              }
              type="button"
              variant="surface"
            >
              Open alert dialog
            </Button>
          </HStack>
        </DocsCard>
      </SimpleGrid>
    </Stack>
  )
}
