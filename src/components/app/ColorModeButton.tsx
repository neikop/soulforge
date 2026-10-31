import { IconButton } from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import { FiMoon, FiSun } from 'react-icons/fi'

/** App-level color-mode control that switches the shared semantic theme between light and dark. */
const ColorModeButton = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const nextTheme = isDark ? 'light' : 'dark'
  const label = `Switch to ${nextTheme} mode`

  return (
    <IconButton aria-label={label} onClick={() => setTheme(nextTheme)} size="sm" title={label} variant="ghost">
      {isDark ? <FiSun /> : <FiMoon />}
    </IconButton>
  )
}

export default ColorModeButton
