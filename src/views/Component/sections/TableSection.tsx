import { Badge, Button, EmptyState, HStack, Stack, Table, Text } from '@chakra-ui/react'
import { FiInbox } from 'react-icons/fi'

import { DocsCard, SectionHeading } from '../shared'

const products = [
  { id: 'starter', name: 'Vite starter', owner: 'Platform', status: 'Active' },
  { id: 'portal', name: 'Operations portal', owner: 'Payments', status: 'Draft' },
  { id: 'guide', name: 'Component guide', owner: 'Design system', status: 'Active' },
] as const

export function TableSection() {
  return (
    <Stack gap={5} id="tables" scrollMarginTop="12px">
      <SectionHeading
        eyebrow="Tables"
        subtitle="The theme owns density, typography and boundaries. Features still own columns, row actions, sorting and responsive overflow."
        title="Keep data tables semantic and structurally stable."
      />

      <DocsCard title="Default interactive table">
        <Stack gap={2}>
          <Table.ScrollArea>
            <Table.Root aria-describedby="product-ownership-table-description" interactive minWidth="38rem">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Product</Table.ColumnHeader>
                  <Table.ColumnHeader>Owner</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">Action</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {products.map((product, index) => (
                  <Table.Row data-selected={index === 1 ? '' : undefined} key={product.id}>
                    <Table.Cell>{product.name}</Table.Cell>
                    <Table.Cell>{product.owner}</Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette={product.status === 'Active' ? 'success' : 'warning'} variant="subtle">
                        {product.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <Button disabled={product.status === 'Draft'} size="xs" variant="outline">
                        View
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
          <Text color="fg.subtle" id="product-ownership-table-description" textStyle="meta">
            Example product ownership data
          </Text>
        </Stack>
      </DocsCard>

      <DocsCard title="Compact table with column dividers">
        <Text color="fg.subtle" textStyle="body">
          Compact density and column dividers are explicit opt-ins; regular tables inherit the consistent md and outline
          defaults.
        </Text>
        <Table.ScrollArea>
          <Table.Root minWidth="30rem" showColumnBorder size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Environment</Table.ColumnHeader>
                <Table.ColumnHeader>Version</Table.ColumnHeader>
                <Table.ColumnHeader>Health</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Production</Table.Cell>
                <Table.Cell>0.1.0</Table.Cell>
                <Table.Cell color="success.fg">Healthy</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </DocsCard>

      <DocsCard title="Empty result">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Result</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <EmptyState.Root size="sm">
                  <EmptyState.Content>
                    <EmptyState.Indicator aria-hidden="true">
                      <FiInbox />
                    </EmptyState.Indicator>
                    <EmptyState.Title>No matching rows</EmptyState.Title>
                    <EmptyState.Description>Clear the current filters and try again.</EmptyState.Description>
                    <HStack>
                      <Button size="sm" variant="outline">
                        Clear filters
                      </Button>
                    </HStack>
                  </EmptyState.Content>
                </EmptyState.Root>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>

        <Text color="fg.subtle" textStyle="body">
          Loading rows use TableCellSkeleton inside this same default structure; see the Skeleton section above.
        </Text>
      </DocsCard>
    </Stack>
  )
}
