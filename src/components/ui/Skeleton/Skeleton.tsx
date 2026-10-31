import { Box, type BoxProps } from '@chakra-ui/react'
import { forwardRef } from 'react'

import styles from './Skeleton.module.scss'

export type SkeletonProps = Omit<BoxProps, 'children' | 'height'> & {
  height: NonNullable<BoxProps['height']>
}

/**
 * Animated placeholder for a content region with known geometry.
 *
 * Pass the final content height explicitly and match its width whenever it is predictable. Keep existing content during
 * background refetches instead of replacing it with this initial-loading placeholder. The skeleton is decorative, so
 * the owning region remains responsible for exposing its loading state to assistive technology.
 */
const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { background = 'bg.muted', borderRadius = 'md', className, position = 'relative', width = 'full', ...props },
  ref,
) {
  const mergedClassName = className ? `${styles.root} ${className}` : styles.root

  return (
    <Box
      {...props}
      aria-hidden="true"
      background={background}
      borderRadius={borderRadius}
      className={mergedClassName}
      flexShrink={0}
      overflow="hidden"
      position={position}
      ref={ref}
      width={width}
    />
  )
})

export default Skeleton
