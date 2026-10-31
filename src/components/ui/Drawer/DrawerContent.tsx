import type { CloseButtonProps } from '@chakra-ui/react'
import type { RefObject } from 'react'

import { CloseButton, Drawer, Portal } from '@chakra-ui/react'
import { forwardRef } from 'react'

export type DrawerContentProps = Drawer.ContentProps & {
  backdropProps?: Drawer.BackdropProps
  closeButtonProps?: CloseButtonProps
  closeLabel?: string
  hasBackdrop?: boolean
  hasCloseButton?: boolean
  isPortalled?: boolean
  portalRef?: RefObject<HTMLElement | null>
  positionerProps?: Drawer.PositionerProps
}

/**
 * Standard drawer surface that owns the shared portal, backdrop, positioner and visible close control composition.
 *
 * Use inside `Drawer.Root` and compose Chakra's Header, Body and Footer as children. Root retains placement, open state,
 * focus and dismissal ownership. The forwarded ref targets `Drawer.Content`; `portalRef` supports scoped overlay hosts.
 */
const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(function DrawerContent(props, ref) {
  const {
    backdropProps,
    children,
    closeButtonProps,
    closeLabel = 'Close drawer',
    hasBackdrop = true,
    hasCloseButton = true,
    isPortalled = true,
    portalRef,
    positionerProps,
    ...contentProps
  } = props

  return (
    <Portal container={portalRef} disabled={!isPortalled}>
      {hasBackdrop && <Drawer.Backdrop {...backdropProps} />}
      <Drawer.Positioner {...positionerProps}>
        <Drawer.Content ref={ref} {...contentProps}>
          {children}
          {hasCloseButton && (
            <Drawer.CloseTrigger asChild>
              <CloseButton {...closeButtonProps} aria-label={closeLabel} size={closeButtonProps?.size ?? 'sm'} />
            </Drawer.CloseTrigger>
          )}
        </Drawer.Content>
      </Drawer.Positioner>
    </Portal>
  )
})

export default DrawerContent
