import { Button, Dialog, Drawer, HStack, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { DialogContent, DrawerContent } from 'components/ui'
import { useState } from 'react'

import { DocsCard, SectionHeading } from '../shared'

const ASYNC_PREVIEW_DELAY_MS = 900

const longDialogParagraphs = Array.from(
  { length: 6 },
  (_, index) =>
    `Section ${index + 1} demonstrates inside scrolling while the dialog header and footer keep their geometry.`,
)

export function OverlaySection() {
  const [isBottomDrawerOpen, setIsBottomDrawerOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDialogSaving, setIsDialogSaving] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleDialogSave = async () => {
    setIsDialogSaving(true)
    await new Promise<void>((resolve) => window.setTimeout(resolve, ASYNC_PREVIEW_DELAY_MS))
    setIsDialogSaving(false)
    setIsDialogOpen(false)
  }

  return (
    <Stack gap={5} id="overlays" scrollMarginTop="12px">
      <SectionHeading
        eyebrow="Overlays"
        subtitle="DialogContent and DrawerContent provide one portal, backdrop, positioner and close-control composition while Chakra Root owns state, focus and dismissal."
        title="Overlay structure should be consistent without hiding Root policy."
      />

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={5}>
        <DocsCard title="Centered dialog with inside scroll">
          <Stack alignItems="flex-start" gap={3}>
            <Dialog.Root
              onOpenChange={(details) => {
                if (!isDialogSaving) setIsDialogOpen(details.open)
              }}
              open={isDialogOpen}
            >
              <Dialog.Trigger asChild>
                <Button variant="outline">Open dialog</Button>
              </Dialog.Trigger>
              <DialogContent closeButtonProps={{ disabled: isDialogSaving }}>
                <Dialog.Header>
                  <Stack gap={1}>
                    <Dialog.Title>Review component contract</Dialog.Title>
                    <Dialog.Description>Focus returns to the trigger after the dialog closes.</Dialog.Description>
                  </Stack>
                </Dialog.Header>
                <Dialog.Body>
                  <Stack gap={4}>
                    {longDialogParagraphs.map((paragraph) => (
                      <Text key={paragraph} textStyle="body">
                        {paragraph}
                      </Text>
                    ))}
                  </Stack>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button disabled={isDialogSaving} variant="outline">
                      Cancel
                    </Button>
                  </Dialog.ActionTrigger>
                  <Button
                    colorPalette="primary"
                    loading={isDialogSaving}
                    onClick={() => void handleDialogSave()}
                    variant="solid"
                  >
                    Save
                  </Button>
                </Dialog.Footer>
              </DialogContent>
            </Dialog.Root>
            <Text color="fg.subtle" textStyle="body">
              Escape, outside interaction and focus trapping remain configurable on Dialog.Root.
            </Text>
          </Stack>
        </DocsCard>

        <DocsCard title="End drawer">
          <Stack alignItems="flex-start" gap={3}>
            <Drawer.Root
              onOpenChange={(details) => setIsDrawerOpen(details.open)}
              open={isDrawerOpen}
              size={{ base: 'full', md: 'sm' }}
            >
              <Drawer.Trigger asChild>
                <Button variant="outline">Open drawer</Button>
              </Drawer.Trigger>
              <DrawerContent>
                <Drawer.Header>
                  <Stack gap={1}>
                    <Drawer.Title>Project settings</Drawer.Title>
                    <Drawer.Description>The body is the only scrolling region.</Drawer.Description>
                  </Stack>
                </Drawer.Header>
                <Drawer.Body>
                  <Stack gap={4}>
                    {longDialogParagraphs.slice(0, 4).map((paragraph) => (
                      <Text key={paragraph} textStyle="body">
                        {paragraph}
                      </Text>
                    ))}
                  </Stack>
                </Drawer.Body>
                <Drawer.Footer>
                  <Drawer.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </Drawer.ActionTrigger>
                  <Button colorPalette="primary" onClick={() => setIsDrawerOpen(false)} variant="solid">
                    Apply
                  </Button>
                </Drawer.Footer>
              </DrawerContent>
            </Drawer.Root>
          </Stack>
        </DocsCard>
      </SimpleGrid>

      <DocsCard title="Alternate drawer placement">
        <HStack flexWrap="wrap">
          <Drawer.Root
            onOpenChange={(details) => setIsBottomDrawerOpen(details.open)}
            open={isBottomDrawerOpen}
            placement="bottom"
          >
            <Drawer.Trigger asChild>
              <Button size="sm" variant="surface">
                Open bottom drawer
              </Button>
            </Drawer.Trigger>
            <DrawerContent>
              <Drawer.Header>
                <Drawer.Title>Bottom placement</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Text textStyle="body">Placement stays visible on Drawer.Root instead of becoming wrapper policy.</Text>
              </Drawer.Body>
              <Drawer.Footer>
                <Drawer.ActionTrigger asChild>
                  <Button variant="outline">Close</Button>
                </Drawer.ActionTrigger>
              </Drawer.Footer>
            </DrawerContent>
          </Drawer.Root>
        </HStack>
      </DocsCard>
    </Stack>
  )
}
