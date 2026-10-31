import { SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { Pagination } from 'components/ui'
import { useState } from 'react'

import { DocsCard, SectionHeading } from '../shared'

export function PaginationSection() {
  const [page, setPage] = useState(3)
  const [pageSize, setPageSize] = useState(10)

  return (
    <Stack gap={5} id="pagination" scrollMarginTop="12px">
      <SectionHeading
        eyebrow="Pagination"
        subtitle="The common component owns navigation anatomy, responsive controls, result summary and page-size selection. Features own query state, URL synchronization and data fetching."
        title="Keep list navigation consistent without coupling it to a table."
      />

      <DocsCard title="Controlled pagination">
        <Stack gap={4}>
          <Pagination
            count={137}
            isPageSizeVisible
            onPageChange={setPage}
            onPageSizeChange={(nextPageSize) => {
              setPage(1)
              setPageSize(nextPageSize)
            }}
            page={page}
            pageSize={pageSize}
            pageSizeOptions={[10, 25, 50]}
          />
          <Text color="fg.subtle" textStyle="body">
            Page {page}, {pageSize} results per page. Resize below the small breakpoint to see the compact page counter.
          </Text>
        </Stack>
      </DocsCard>

      <SimpleGrid columns={{ base: 1, xl: 2 }} gap={4}>
        <DocsCard title="Uncontrolled outline variant">
          <Pagination count={80} defaultPage={4} isSummaryVisible={false} pageSize={10} variant="outline" />
        </DocsCard>

        <DocsCard title="Empty boundary">
          <Pagination count={0} isPageSizeVisible />
        </DocsCard>
      </SimpleGrid>
    </Stack>
  )
}
