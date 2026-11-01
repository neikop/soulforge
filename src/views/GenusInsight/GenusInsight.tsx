import { Button, Collapsible, Flex, Link, Stack, Text } from '@chakra-ui/react'
import { PageHeader } from 'components/layouts'
import { FiChevronDown } from 'react-icons/fi'

import { GENUS_LINE_KEYS } from './data'
import { GenusMatrix } from './GenusMatrix'
import { useGenusProgress } from './useGenusProgress'

export default function GenusInsight() {
  const { boardCounts, completedCount, completedLines, setLineCompleted } = useGenusProgress()

  return (
    <Stack gap={4}>
      <PageHeader
        context="PvE DPS"
        progress={{ label: 'to keep', total: GENUS_LINE_KEYS.length, value: completedCount }}
        title="Genus Insight"
      />

      <Collapsible.Root layerStyle="panel">
        <Flex align="center" flexWrap="wrap" gap={3} justify="space-between" p={3}>
          <Flex align="center" flexWrap="wrap" gap={3}>
            <Text color="fg.muted" textStyle="bodyCompact">
              Roll order
            </Text>
            <Text color="primary.fg" textStyle="action">
              4 → 1/5 → 3/6/9 → 7 → 2/8
            </Text>
          </Flex>
          <Collapsible.Trigger asChild>
            <Button variant="ghost">
              Roll guide
              <Collapsible.Indicator asChild>
                <FiChevronDown aria-hidden="true" />
              </Collapsible.Indicator>
            </Button>
          </Collapsible.Trigger>
        </Flex>
        <Collapsible.Content _motionReduce={{ animation: 'none' }}>
          <Text borderTopWidth="1px" color="fg.muted" p={3} textStyle="bodyCompact">
            Level 9: lock strong gold or orange Slot 4 rolls, then Slot 1/5. Finish the rest after level 10. Double
            Chance is on Special, Slot 4; gold 2% beats orange 1.5%.
          </Text>
        </Collapsible.Content>
      </Collapsible.Root>

      <GenusMatrix boardCounts={boardCounts} completedLines={completedLines} onCompletedChange={setLineCompleted} />

      <Flex align="start" flexWrap="wrap" gap={3} justify="space-between">
        <Text color="fg.muted" textStyle="bodyCompact">
          Saved in this browser.
        </Text>
        <Link
          color="primary.fg"
          href="https://aion2simple.wiki/articles/global-genus-stat-priorities/"
          rel="noreferrer"
          target="_blank"
          textStyle="bodyCompact"
        >
          Source: Kanon ↗
        </Link>
      </Flex>
    </Stack>
  )
}
