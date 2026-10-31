import type { CloseButtonProps } from '@chakra-ui/react'
import type { RefObject } from 'react'

import { CloseButton, Dialog, Portal } from '@chakra-ui/react'
import { forwardRef } from 'react'

export type DialogContentProps = Dialog.ContentProps & {
  backdropProps?: Dialog.BackdropProps
  closeButtonProps?: CloseButtonProps
  closeLabel?: string
  hasBackdrop?: boolean
  hasCloseButton?: boolean
  isPortalled?: boolean
  portalRef?: RefObject<HTMLElement | null>
  positionerProps?: Dialog.PositionerProps
}

/**
 * Standard dialog surface that owns the shared portal, backdrop, positioner and visible close control composition.
 *
 * Use inside `Dialog.Root` and compose Chakra's Header, Body and Footer as children. Root remains responsible for open
 * state, focus policy and dismissal rules. The forwarded ref targets `Dialog.Content`; `portalRef` scopes the overlay
 * when it must remain inside another overlay or container.
 */
const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(props, ref) {
  const {
    backdropProps,
    children,
    closeButtonProps,
    closeLabel = 'Close dialog',
    hasBackdrop = true,
    hasCloseButton = true,
    isPortalled = true,
    portalRef,
    positionerProps,
    ...contentProps
  } = props

  return (
    <Portal container={portalRef} disabled={!isPortalled}>
      {hasBackdrop && <Dialog.Backdrop {...backdropProps} />}
      <Dialog.Positioner {...positionerProps}>
        <Dialog.Content ref={ref} {...contentProps}>
          {children}
          {hasCloseButton && (
            <Dialog.CloseTrigger asChild>
              <CloseButton {...closeButtonProps} aria-label={closeLabel} size={closeButtonProps?.size ?? 'sm'} />
            </Dialog.CloseTrigger>
          )}
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  )
})

export default DialogContent
