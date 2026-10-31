import { Button, HStack, IconButton, Link, Stack, Text } from '@chakra-ui/react'

import { DocsCard, SectionHeading } from '../shared'

const paletteAwareVariants = ['solid', 'ghost', 'subtle', 'outline', 'surface'] as const

const buttonVariants = [...paletteAwareVariants, 'text'] as const

const buttonPalettes = ['primary', 'info', 'success', 'warning', 'error', 'gray'] as const

const buttonSizes = ['xs', 'sm', 'md', 'lg'] as const

const CircleIcon = () => (
  <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
  </svg>
)

export function ButtonSection() {
  return (
    <Stack gap={5} id="buttons" scrollMarginTop="12px">
      <SectionHeading
        eyebrow="Buttons"
        subtitle="Recipes resolve every `colorPalette` through app-owned semantic tokens. Variants below share accessible solid/contrast pairs and stable geometry."
        title="Buttons expose the visual grammar of the theme."
      />

      <DocsCard title="Variant matrix">
        <Stack gap={5}>
          {buttonPalettes.map((palette) => (
            <Stack gap={3} key={palette}>
              <Text color="fg.subtle" textStyle="meta">
                colorPalette="{palette}"
              </Text>

              <HStack flexWrap="wrap" gap={3}>
                {buttonVariants.map((variant) => (
                  <Button
                    colorPalette={palette}
                    key={`${palette}-${variant}`}
                    textTransform="capitalize"
                    variant={variant}
                  >
                    {variant}
                  </Button>
                ))}
              </HStack>
            </Stack>
          ))}

          <Stack gap={3}>
            <Text color="fg.subtle" textStyle="meta">
              Icon only
            </Text>

            <HStack flexWrap="wrap" gap={3}>
              {paletteAwareVariants.map((variant) => (
                <IconButton
                  aria-label={`${variant} icon button`}
                  borderRadius="full"
                  colorPalette="primary"
                  key={`icon-${variant}`}
                  variant={variant}
                >
                  <CircleIcon />
                </IconButton>
              ))}
            </HStack>
          </Stack>

          <Stack gap={3}>
            <Text color="fg.subtle" textStyle="meta">
              Leading icon
            </Text>

            <HStack flexWrap="wrap" gap={3}>
              {paletteAwareVariants.map((variant) => (
                <Button
                  colorPalette="primary"
                  key={`leading-icon-${variant}`}
                  textTransform="capitalize"
                  variant={variant}
                >
                  <CircleIcon />
                  {variant}
                </Button>
              ))}
            </HStack>
          </Stack>

          <Stack gap={3}>
            <Text color="fg.subtle" textStyle="meta">
              Size
            </Text>

            <HStack alignItems="center" flexWrap="wrap" gap={3}>
              {buttonSizes.map((size) => (
                <Button colorPalette="primary" key={`size-${size}`} size={size} variant="solid">
                  {size}
                </Button>
              ))}
              {buttonSizes.map((size) => (
                <IconButton
                  aria-label={`${size} icon button`}
                  borderRadius="full"
                  colorPalette="primary"
                  key={`size-icon-${size}`}
                  size={size}
                  variant="surface"
                >
                  <CircleIcon />
                </IconButton>
              ))}
            </HStack>
          </Stack>

          <Stack gap={3}>
            <Text color="fg.subtle" textStyle="meta">
              Disabled
            </Text>

            <HStack flexWrap="wrap" gap={3}>
              {buttonVariants.map((variant) => (
                <Button
                  colorPalette="primary"
                  disabled
                  key={`disabled-${variant}`}
                  textTransform="capitalize"
                  variant={variant}
                >
                  {variant}
                </Button>
              ))}
            </HStack>
          </Stack>

          <Stack gap={3}>
            <Text color="fg.subtle" textStyle="meta">
              Loading
            </Text>

            <HStack flexWrap="wrap" gap={3}>
              {buttonVariants.map((variant) => (
                <Button
                  colorPalette="primary"
                  key={`loading-${variant}`}
                  loading
                  loadingText={variant}
                  textTransform="capitalize"
                  variant={variant}
                >
                  {variant}
                </Button>
              ))}
            </HStack>
          </Stack>

          <Stack alignItems="flex-start" gap={3} pt={2}>
            <Text color="fg.subtle" textStyle="meta">
              Link recipe
            </Text>
            <Link href="https://chakra-ui.com" target="_blank">
              chakra-ui.com (default recipe)
            </Link>
            <Link _hover={{ color: 'info.strong' }} color="info.main" href="https://ark-ui.com" target="_blank">
              ark-ui.com (manual info override)
            </Link>
          </Stack>
        </Stack>
      </DocsCard>
    </Stack>
  )
}
