import { Box, Grid, HStack, Link, Stack, Text } from '@chakra-ui/react'
import { PageHeader } from 'components/layouts'
import { useEffect, useRef, useState } from 'react'

import { guideSections } from './constants'
import {
  ButtonSection,
  DatePickerSection,
  FeedbackSection,
  FileUploadSection,
  FormSection,
  InputSection,
  OverlaySection,
  OverviewSection,
  PaginationSection,
  SelectSection,
  SharedUiSection,
  SkeletonSection,
  TableSection,
  TokenSection,
  TypographySection,
} from './sections'

function getScrollParent(node: HTMLElement | null) {
  let current = node?.parentElement || null

  while (current) {
    const style = window.getComputedStyle(current)
    const overflowY = style.overflowY

    if (['auto', 'overlay', 'scroll'].includes(overflowY) && current.scrollHeight > current.clientHeight) {
      return current
    }

    current = current.parentElement
  }

  return window
}

const Guide = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [activeSectionId, setActiveSectionId] = useState<(typeof guideSections)[number]['id']>(guideSections[0].id)

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return undefined
    }

    const scrollParent = getScrollParent(container)
    const sections = guideSections
      .map((section) => ({
        element: document.getElementById(section.id),
        id: section.id,
      }))
      .filter(
        (
          section,
        ): section is {
          element: HTMLElement
          id: (typeof guideSections)[number]['id']
        } => Boolean(section.element),
      )

    const firstSection = sections[0]

    if (!firstSection) {
      return undefined
    }

    const updateActiveSection = () => {
      const rootTop = scrollParent === window ? 0 : (scrollParent as HTMLElement).getBoundingClientRect().top
      const threshold = rootTop + 128

      let nextActiveSection = firstSection.id

      for (const section of sections) {
        if (section.element.getBoundingClientRect().top <= threshold) {
          nextActiveSection = section.id
        } else {
          break
        }
      }

      setActiveSectionId((current) => (current === nextActiveSection ? current : nextActiveSection))
    }

    updateActiveSection()

    const target = scrollParent === window ? window : scrollParent
    target.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      target.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [])

  return (
    <Stack gap={{ base: 5, md: 6 }}>
      <PageHeader context="Design system" title="Component Guide" />
      <Grid
        alignItems="start"
        gap={{ base: 8, xl: 10 }}
        ref={containerRef}
        templateColumns={{ base: 'minmax(0, 1fr)', xl: 'minmax(0, 1fr) 17rem' }}
      >
        <Stack gap={{ base: 8, md: 10 }}>
          <OverviewSection />
          <TypographySection />
          <SkeletonSection />
          <ButtonSection />
          <InputSection />
          <SelectSection />
          <DatePickerSection />
          <FileUploadSection />
          <TableSection />
          <PaginationSection />
          <FeedbackSection />
          <OverlaySection />
          <SharedUiSection />
          <TokenSection />
          <FormSection />
        </Stack>

        <Stack
          aria-label="Component guide sections"
          as="nav"
          display={{ base: 'none', xl: 'flex' }}
          position="sticky"
          top="28"
        >
          <Stack gap={4} layerStyle="panel" maxH="calc(100vh - 8rem)" overflowY="auto" p={4}>
            <Text color="fg.subtle" textStyle="meta">
              On this page
            </Text>

            <Stack gap={2}>
              {guideSections.map((section) => (
                <Link
                  _hover={{ color: 'primary.main', textDecoration: 'none' }}
                  alignSelf="flex-start"
                  aria-current={activeSectionId === section.id ? 'location' : undefined}
                  color={activeSectionId === section.id ? 'primary.main' : 'fg.muted'}
                  display="inline-flex"
                  href={`#${section.id}`}
                  key={section.id}
                  textDecoration="none"
                >
                  <HStack
                    _hover={{ background: 'primary.surface' }}
                    background={activeSectionId === section.id ? 'primary.surface' : 'bg.canvas'}
                    borderRadius="md"
                    gap={3}
                    px={3}
                    py={2}
                  >
                    <Text color={activeSectionId === section.id ? 'primary.main' : 'fg.subtle'} textStyle="meta">
                      {section.order}
                    </Text>
                    <Text textStyle="title">{section.label}</Text>
                  </HStack>
                </Link>
              ))}
            </Stack>
          </Stack>
        </Stack>

        <Box h="50vh" />
      </Grid>
    </Stack>
  )
}

export default Guide
