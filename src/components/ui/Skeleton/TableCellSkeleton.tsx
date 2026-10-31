import { Box, type BoxProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

export type TableCellSkeletonProps = Omit<BoxProps, 'children' | 'height' | 'width'> & {
  circle?: boolean
  height: NonNullable<BoxProps['height']>
  width: NonNullable<BoxProps['width']>
}

/**
 * Placeholder for a single value or leading visual inside a table cell.
 *
 * Keep the real table structure, column widths, cell padding, and row height while loading. This placeholder is static
 * by design; apply one pulse animation to the owning table body or row so all cells animate in sync. Pass dimensions
 * that match the final cell content and use `circle` only for circular content such as an avatar or token icon.
 */
const TableCellSkeleton = forwardRef<HTMLDivElement, TableCellSkeletonProps>(function TableCellSkeleton(
  { background = 'bg.muted', borderRadius = 'sm', circle = false, ...props },
  ref,
) {
  return (
    <Box
      {...props}
      aria-hidden="true"
      background={background}
      borderRadius={circle ? 'full' : borderRadius}
      flexShrink={0}
      ref={ref}
    />
  )
})

export default TableCellSkeleton
