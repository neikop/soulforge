'use client'

import { Toaster as ChakraToaster, createToaster, Portal, Spinner, Stack, Toast } from '@chakra-ui/react'

/**
 * Imperative app-level toaster for transient asynchronous feedback outside local form validation.
 *
 * Toast announcements and dismissal behavior come from Chakra; keep field errors beside their owning controls instead.
 */
export const toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true,
})

/**
 * Portal host for the shared live-region toast queue; mount exactly once inside the application provider.
 *
 * Toast width becomes bounded from the medium breakpoint while narrow viewports use the available inset width. Loading
 * feedback keeps the same anatomy as terminal states and uses a semantic indicator color.
 */
export function Toaster() {
  return (
    <Portal>
      <ChakraToaster insetInline={{ mdDown: '4' }} toaster={toaster}>
        {(toast) => (
          <Toast.Root width={{ md: 'sm' }}>
            {toast.type === 'loading' ? <Spinner color="info.main" size="sm" /> : <Toast.Indicator />}
            <Stack flex="1" gap="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
            </Stack>
            {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
