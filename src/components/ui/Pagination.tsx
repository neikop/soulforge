import type { PaginationRootProps } from '@chakra-ui/react'

import { Box, Button, Pagination as ChakraPagination, HStack, IconButton, Text } from '@chakra-ui/react'
import Select, { type SelectOption } from 'components/select'
import { forwardRef } from 'react'
import { FiChevronLeft, FiChevronRight, FiMoreHorizontal } from 'react-icons/fi'

export type PaginationProps = Omit<
  PaginationRootProps,
  'children' | 'onPageChange' | 'onPageSizeChange' | 'size' | 'type' | 'variant'
> & {
  disabled?: boolean
  isPageSizeVisible?: boolean
  isSummaryVisible?: boolean
  labels?: {
    itemsPerPage?: string
    morePages?: string
    next?: string
    page?: (page: number) => string
    previous?: string
    results?: (start: number, end: number, count: number) => string
  }
  onPageChange?: (page: number, pageSize: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: readonly number[]
  size?: 'lg' | 'md' | 'sm'
  variant?: 'outline' | 'subtle'
}

/**
 * Domain-neutral list pagination with controlled or uncontrolled page state, responsive summary and optional page size.
 *
 * `count` is the total item count and pages are one-based. Features own URL/query synchronization and data fetching;
 * callbacks expose normalized numbers rather than Chakra event details. Subtle borderless controls are the visual
 * default; use `outline` only when stronger button boundaries are required. The forwarded ref targets pagination
 * navigation.
 */
const Pagination = forwardRef<HTMLDivElement, PaginationProps>(function Pagination(props, ref) {
  const {
    boundaryCount = 1,
    count = 0,
    disabled = false,
    isPageSizeVisible = false,
    isSummaryVisible = true,
    labels,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50, 100],
    siblingCount = 1,
    size = 'sm',
    variant = 'subtle',
    ...rootProps
  } = props
  const activeButtonVariant = variant === 'subtle' ? 'subtle' : 'solid'
  const buttonVariant = variant === 'subtle' ? 'ghost' : 'outline'
  const isNavigationDisabled = disabled || count === 0

  return (
    <ChakraPagination.Root
      {...rootProps}
      aria-disabled={isNavigationDisabled || undefined}
      aria-label={rootProps['aria-label'] ?? 'Pagination'}
      boundaryCount={boundaryCount}
      count={count}
      onPageChange={(details) => {
        if (!isNavigationDisabled) onPageChange?.(details.page, details.pageSize)
      }}
      onPageSizeChange={(details) => {
        if (!isNavigationDisabled) onPageSizeChange?.(details.pageSize)
      }}
      ref={ref}
      role={rootProps.role ?? 'navigation'}
      siblingCount={siblingCount}
      type="button"
    >
      <ChakraPagination.Context>
        {(context) => (
          <HStack gap={3} justifyContent="space-between" width="full" wrap="wrap">
            <HStack gap={3}>
              {isSummaryVisible ? (
                <Text color="fg.subtle" minWidth="fit-content" textStyle="body">
                  {labels?.results?.(
                    count === 0 ? 0 : context.pageRange.start + 1,
                    Math.min(context.pageRange.end, count),
                    count,
                  ) ??
                    `${count === 0 ? 0 : context.pageRange.start + 1}–${Math.min(context.pageRange.end, count)} of ${count}`}
                </Text>
              ) : null}

              {isPageSizeVisible ? (
                <HStack gap={2}>
                  <Text color="fg.subtle" textStyle="body">
                    {labels?.itemsPerPage ?? 'Per page'}
                  </Text>
                  <Box width="5rem">
                    <Select<SelectOption>
                      aria-label={labels?.itemsPerPage ?? 'Items per page'}
                      isDisabled={isNavigationDisabled}
                      isSearchable={false}
                      onChange={(option) => {
                        if (option) {
                          context.setPageSize(Number(option.value))
                        }
                      }}
                      options={pageSizeOptions.map((option) => ({ label: String(option), value: String(option) }))}
                      size={size}
                      value={{ label: String(context.pageSize), value: String(context.pageSize) }}
                    />
                  </Box>
                </HStack>
              ) : null}
            </HStack>

            <HStack gap={1}>
              <ChakraPagination.PrevTrigger asChild>
                <IconButton
                  aria-label={labels?.previous ?? 'Previous page'}
                  disabled={isNavigationDisabled}
                  size={size}
                  variant={buttonVariant}
                >
                  <FiChevronLeft />
                </IconButton>
              </ChakraPagination.PrevTrigger>

              <HStack display={{ base: 'none', sm: 'flex' }} gap={1}>
                <ChakraPagination.Items
                  ellipsis={
                    <IconButton aria-label={labels?.morePages ?? 'More pages'} as="span" size={size} variant="ghost">
                      <FiMoreHorizontal />
                    </IconButton>
                  }
                  render={(page) => (
                    <Button
                      aria-label={labels?.page?.(page.value) ?? `Page ${page.value}`}
                      colorPalette="primary"
                      disabled={isNavigationDisabled}
                      size={size}
                      variant={page.value === context.page ? activeButtonVariant : buttonVariant}
                    >
                      {page.value}
                    </Button>
                  )}
                />
              </HStack>

              <Text
                color="fg.subtle"
                display={{ base: 'block', sm: 'none' }}
                minWidth="4.5rem"
                textAlign="center"
                textStyle="body"
              >
                {context.page} / {context.totalPages || 1}
              </Text>

              <ChakraPagination.NextTrigger asChild>
                <IconButton
                  aria-label={labels?.next ?? 'Next page'}
                  disabled={isNavigationDisabled}
                  size={size}
                  variant={buttonVariant}
                >
                  <FiChevronRight />
                </IconButton>
              </ChakraPagination.NextTrigger>
            </HStack>
          </HStack>
        )}
      </ChakraPagination.Context>
    </ChakraPagination.Root>
  )
})

export default Pagination
