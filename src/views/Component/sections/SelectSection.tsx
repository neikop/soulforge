import { Checkbox, Code, Separator, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import Select, { ChakraSelect, type SelectOption } from 'components/select'
import { FormField } from 'components/ui'
import { useMemo, useState } from 'react'

import { DocsCard, SectionHeading } from '../shared'

const fruitOptions: SelectOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
  { label: 'Pineapple', value: 'pineapple' },
  { label: 'Strawberry', value: 'strawberry' },
]

const frameworkOptions: SelectOption[] = [
  { label: 'Chakra UI', value: 'chakra' },
  { label: 'Ark UI', value: 'ark' },
  { label: 'Panda CSS', value: 'panda' },
  { label: 'Phpag Select', value: 'react-select' },
]

export function SelectSection() {
  const [selectedFruit, setSelectedFruit] = useState<null | SelectOption>(fruitOptions[1] ?? null)
  const [isMenuPinnedOpen, setIsMenuPinnedOpen] = useState(false)
  const [wrapperValue, setWrapperValue] = useState<null | SelectOption>(frameworkOptions[0] ?? null)
  const [chakraValue, setChakraValue] = useState('chakra')

  const wrapperLabel = useMemo(() => wrapperValue?.label || 'No value selected', [wrapperValue])
  const chakraLabel = useMemo(() => formatFrameworkValue(chakraValue), [chakraValue])

  return (
    <Stack gap={5} id="selects" scrollMarginTop="12px">
      <SectionHeading
        eyebrow="Selects"
        subtitle="This group compares the custom react-select wrapper with Chakra v3 Select so you can evaluate ergonomics, styling control and UX differences side by side."
        title="Two select implementations, one comparison surface."
      />

      <DocsCard title="Comparison">
        <Stack gap={6}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormField htmlFor="guide-react-select" label="React Select wrapper">
              <Select
                inputId="guide-react-select"
                isClearable
                onChange={(value) => setWrapperValue(value)}
                options={frameworkOptions}
                placeholder="Choose a stack"
                value={wrapperValue}
              />
              <Code whiteSpace="pre-wrap">{wrapperLabel}</Code>
            </FormField>

            <FormField htmlFor="guide-chakra-select" label="Chakra Select">
              <ChakraSelect
                id="guide-chakra-select"
                onChange={setChakraValue}
                options={frameworkOptions}
                placeholder="Choose a stack"
                value={chakraValue}
              />
              <Code whiteSpace="pre-wrap">{chakraLabel}</Code>
            </FormField>
          </SimpleGrid>

          <Text color="fg.subtle" textStyle="body">
            React Select options use the subtle neutral border consistently across hover, active, keyboard-focused, and
            selected states. Its outer control follows Chakra Input's inside outline; focus or an open menu activates
            the theme focus ring, while invalid state uses the error border and ring.
          </Text>

          <Separator />

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <FormField htmlFor="guide-react-select-multi" label="Wrapper uncontrolled multi">
              <Select
                defaultValue={[fruitOptions[0], fruitOptions[2]]}
                inputId="guide-react-select-multi"
                isClearable
                isMulti
                options={fruitOptions}
                placeholder="Pick some fruits"
              />
              <Text color="fg.subtle" textStyle="body">
                Starts with `defaultValue`, then manages its own state.
              </Text>
            </FormField>

            <FormField htmlFor="guide-react-select-controlled" label="Wrapper menu controlled">
              <Checkbox.Root
                checked={isMenuPinnedOpen}
                onCheckedChange={({ checked }) => setIsMenuPinnedOpen(checked === true)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Label>Keep menu open</Checkbox.Label>
              </Checkbox.Root>

              <Select
                inputId="guide-react-select-controlled"
                menuIsOpen={isMenuPinnedOpen}
                onChange={(value) => setSelectedFruit(value)}
                onMenuClose={() => setIsMenuPinnedOpen(false)}
                options={fruitOptions.concat(frameworkOptions)}
                placeholder="Open state can be controlled"
                value={selectedFruit}
              />
              <Text color="fg.subtle" textStyle="body">
                Toggle the checkbox to pin the menu open, then close it from the control flow.
              </Text>
            </FormField>
          </SimpleGrid>

          <Separator />

          <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={4}>
            <FormField htmlFor="guide-react-select-disabled" label="Disabled">
              <Select inputId="guide-react-select-disabled" isDisabled options={fruitOptions} value={fruitOptions[0]} />
            </FormField>

            <FormField htmlFor="guide-react-select-loading" label="Loading">
              <Select
                inputId="guide-react-select-loading"
                isLoading
                options={fruitOptions}
                placeholder="Loading fruit"
              />
            </FormField>

            <FormField
              error="Choose at least one fruit."
              htmlFor="guide-react-select-invalid"
              label="Invalid"
              messageId="guide-react-select-invalid-message"
            >
              <Select
                aria-describedby="guide-react-select-invalid-message"
                inputId="guide-react-select-invalid"
                isInvalid
                options={fruitOptions}
              />
            </FormField>

            <FormField htmlFor="guide-chakra-select-readonly" label="Chakra read only">
              <ChakraSelect
                id="guide-chakra-select-readonly"
                options={frameworkOptions}
                placeholder="Choose a stack"
                readOnly
                value="chakra"
              />
            </FormField>
          </SimpleGrid>
        </Stack>
      </DocsCard>
    </Stack>
  )
}

function formatFrameworkValue(value: string) {
  return frameworkOptions.find((item) => item.value === value)?.label || 'No value selected'
}
