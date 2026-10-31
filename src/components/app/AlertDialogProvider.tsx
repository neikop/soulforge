import type { PropsWithChildren } from 'react'

import { Button, Dialog, Text } from '@chakra-ui/react'
import { DialogContent } from 'components/ui'
import { AlertDialogContext, type AlertDialogOptions } from 'hooks/useAlertDialog'
import { useCallback, useMemo, useState } from 'react'

function AlertDialogProvider({ children }: PropsWithChildren) {
  const [options, setOptions] = useState<AlertDialogOptions | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const closeAlertDialog = useCallback(() => {
    if (!isConfirming) setOptions(null)
  }, [isConfirming])

  const openAlertDialog = useCallback((nextOptions: AlertDialogOptions) => {
    setOptions(nextOptions)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!options) return

    try {
      setIsConfirming(true)
      await options.onConfirm?.()
      setOptions(null)
    } finally {
      setIsConfirming(false)
    }
  }, [options])

  const value = useMemo(() => ({ closeAlertDialog, openAlertDialog }), [closeAlertDialog, openAlertDialog])

  return (
    <AlertDialogContext.Provider value={value}>
      {children}
      <Dialog.Root
        onOpenChange={(details) => {
          if (!details.open) closeAlertDialog()
        }}
        open={Boolean(options)}
        placement="center"
        role="alertdialog"
        size="sm"
      >
        <DialogContent closeButtonProps={{ disabled: isConfirming }}>
          <Dialog.Header>
            <Dialog.Title>{options?.title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            {typeof options?.description === 'string' ? (
              <Text textStyle="body">{options.description}</Text>
            ) : (
              options?.description
            )}
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button colorPalette={options?.cancelColorPalette ?? 'gray'} disabled={isConfirming} variant="outline">
                {options?.cancelText ?? 'Cancel'}
              </Button>
            </Dialog.ActionTrigger>
            <Button
              colorPalette={options?.confirmColorPalette ?? 'primary'}
              loading={isConfirming}
              onClick={() => void handleConfirm()}
              variant="solid"
            >
              {options?.confirmText ?? 'Confirm'}
            </Button>
          </Dialog.Footer>
        </DialogContent>
      </Dialog.Root>
    </AlertDialogContext.Provider>
  )
}

export default AlertDialogProvider
