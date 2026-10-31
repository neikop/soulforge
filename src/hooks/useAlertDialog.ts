import type { ButtonProps } from '@chakra-ui/react'
import type { ReactNode } from 'react'

import { createContext, useContext } from 'react'

export type AlertDialogOptions = {
  cancelColorPalette?: ButtonProps['colorPalette']
  cancelText?: string
  confirmColorPalette?: ButtonProps['colorPalette']
  confirmText?: string
  description?: ReactNode
  onConfirm?: () => Promise<void> | void
  title: string
}

type AlertDialogContextValue = {
  closeAlertDialog: () => void
  openAlertDialog: (options: AlertDialogOptions) => void
}

export const AlertDialogContext = createContext<AlertDialogContextValue | null>(null)

/** Opens or closes the single app-level confirmation dialog mounted by `AlertDialogProvider`. */
export function useAlertDialog() {
  const context = useContext(AlertDialogContext)

  if (!context) {
    throw new Error('useAlertDialog must be used within AlertDialogProvider')
  }

  return context
}
