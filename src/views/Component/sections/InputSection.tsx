import { HStack, Input, RadioGroup, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { FormField, PasswordInput, RadioGroupItem, Switch } from 'components/ui'
import { useState } from 'react'

import { DocsCard, SectionHeading } from '../shared'

export function InputSection() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [role, setRole] = useState('user')

  return (
    <Stack gap={5} id="inputs" scrollMarginTop="12px">
      <SectionHeading
        eyebrow="Inputs"
        subtitle="Use the base Chakra input styles for standard text entry so forms stay aligned with the same neutral surfaces, borders and sizing rhythm."
        title="Text inputs should establish the baseline field pattern."
      />

      <DocsCard title="Preview">
        <Stack gap={6}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormField htmlFor="guide-input-default" label="Default">
              <Input id="guide-input-default" placeholder="Type a keyword" />
            </FormField>

            <FormField htmlFor="guide-input-disabled" label="Disabled">
              <Input disabled id="guide-input-disabled" placeholder="Disabled input" value="Read only state" />
            </FormField>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <FormField htmlFor="guide-input-small" label="Small">
              <Input id="guide-input-small" placeholder="Small input" size="sm" />
            </FormField>

            <FormField htmlFor="guide-input-medium" label="Medium">
              <Input id="guide-input-medium" placeholder="Medium input" size="md" />
            </FormField>

            <FormField htmlFor="guide-input-large" label="Large">
              <Input id="guide-input-large" placeholder="Large input" size="lg" />
            </FormField>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <FormField htmlFor="guide-input-readonly" label="Read only">
              <Input id="guide-input-readonly" readOnly value="Stable value" />
            </FormField>

            <FormField
              error="Enter a valid project name."
              htmlFor="guide-input-invalid"
              label="Invalid"
              messageId="guide-input-invalid-message"
            >
              <Input
                aria-describedby="guide-input-invalid-message"
                aria-invalid="true"
                id="guide-input-invalid"
                value="!"
              />
            </FormField>

            <FormField htmlFor="guide-input-required" label="Required" required>
              <Input id="guide-input-required" name="projectName" required />
            </FormField>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <FormField htmlFor="guide-password" label="Password">
              <PasswordInput autoComplete="current-password" defaultValue="shared-secret" id="guide-password" />
            </FormField>

            <Stack gap={2}>
              <Text color="fg.subtle" id="guide-switch-label" textStyle="meta">
                Feature state
              </Text>
              <Switch
                aria-labelledby="guide-switch-label"
                checked={isEnabled}
                onCheckedChange={(details) => setIsEnabled(details.checked)}
              >
                {isEnabled ? 'Enabled' : 'Disabled'}
              </Switch>
            </Stack>

            <Stack gap={2}>
              <Text color="fg.subtle" id="guide-role-label" textStyle="meta">
                Role
              </Text>
              <RadioGroup.Root
                aria-labelledby="guide-role-label"
                onValueChange={(details) => setRole(details.value ?? '')}
                value={role}
              >
                <HStack gap={4}>
                  <RadioGroupItem value="admin">Admin</RadioGroupItem>
                  <RadioGroupItem value="user">User</RadioGroupItem>
                </HStack>
              </RadioGroup.Root>
            </Stack>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={4}>
            <Stack gap={2}>
              <Text color="fg.subtle" textStyle="meta">
                Disabled switch
              </Text>
              <Switch checked disabled>
                Notifications on
              </Switch>
            </Stack>

            <Stack gap={2}>
              <Text color="fg.subtle" textStyle="meta">
                Read-only switch
              </Text>
              <Switch checked readOnly>
                Locked setting
              </Switch>
            </Stack>

            <Stack gap={2}>
              <Text color="fg.subtle" textStyle="meta">
                Disabled radio
              </Text>
              <RadioGroup.Root aria-label="Disabled role" defaultValue="admin" disabled>
                <HStack gap={4}>
                  <RadioGroupItem value="admin">Admin</RadioGroupItem>
                  <RadioGroupItem value="user">User</RadioGroupItem>
                </HStack>
              </RadioGroup.Root>
            </Stack>

            <Stack gap={2}>
              <Text color="fg.subtle" textStyle="meta">
                Read-only radio
              </Text>
              <RadioGroup.Root aria-label="Read-only role" defaultValue="user" readOnly>
                <HStack gap={4}>
                  <RadioGroupItem value="admin">Admin</RadioGroupItem>
                  <RadioGroupItem value="user">User</RadioGroupItem>
                </HStack>
              </RadioGroup.Root>
            </Stack>
          </SimpleGrid>
        </Stack>
      </DocsCard>
    </Stack>
  )
}
