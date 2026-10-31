import type { PropsWithChildren } from 'react'

import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { system } from 'components/theme'
import { Toaster } from 'components/ui'
import { queryClient } from 'config/queryClient'
import { ThemeProvider } from 'next-themes'

import AlertDialogProvider from './AlertDialogProvider'

const AppProvider = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange enableSystem>
        <AlertDialogProvider>
          {children}
          <Toaster />
        </AlertDialogProvider>
      </ThemeProvider>
    </ChakraProvider>
  </QueryClientProvider>
)

export default AppProvider
