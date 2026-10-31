import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Density = 'comfortable' | 'compact'

type AppState = {
  accessToken: null | string
  density: Density
  resetSession: () => void
  setAccessToken: (accessToken: null | string) => void
  setDensity: (density: Density) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      accessToken: null,
      density: 'comfortable',
      resetSession: () => set({ accessToken: null }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setDensity: (density) => set({ density }),
    }),
    {
      name: 'vite-react-template',
      partialize: ({ accessToken, density }) => ({ accessToken, density }),
    },
  ),
)
