import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react'
import { forwardRef, type ReactElement, type ReactNode, type RefObject } from 'react'

export type TooltipProps = Omit<ChakraTooltip.RootProps, 'children'> & {
  children: ReactElement
  content: ReactNode
  contentProps?: ChakraTooltip.ContentProps
  hasArrow?: boolean
  isDisabled?: boolean
  isPortalled?: boolean
  portalRef?: RefObject<HTMLElement | null>
}

/**
 * Portal-aware tooltip wrapper for an existing interactive or descriptive trigger.
 *
 * The child must accept `asChild` composition and remain keyboard focusable when the tooltip explains an action. The
 * forwarded ref targets tooltip content, while `portalRef` can keep overlays inside a dialog or scoped container.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(props, ref) {
  const { children, content, contentProps, hasArrow, isDisabled, isPortalled = true, portalRef, ...rest } = props

  if (isDisabled) return children

  return (
    <ChakraTooltip.Root {...rest}>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <Portal container={portalRef} disabled={!isPortalled}>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content ref={ref} {...contentProps}>
            {hasArrow && (
              <ChakraTooltip.Arrow>
                <ChakraTooltip.ArrowTip />
              </ChakraTooltip.Arrow>
            )}
            {content}
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  )
})
