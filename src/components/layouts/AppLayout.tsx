import { Badge, Box, Button, Container, Grid, HStack, Stack, Text } from '@chakra-ui/react'
import { ColorModeButton } from 'components/app'
import { FiBox, FiHome } from 'react-icons/fi'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { appRoutes } from 'routes'

const navItems = [
  { icon: FiHome, ...appRoutes.home },
  { icon: FiBox, ...appRoutes.components },
]

const AppLayout = () => {
  const location = useLocation()

  return (
    <Grid background="bg.subtle" minH="100vh" templateColumns={{ base: '1fr', lg: '240px minmax(0, 1fr)' }}>
      <Box
        background="bg.canvas"
        borderRightWidth={{ base: 0, lg: 1 }}
        display={{ base: 'none', lg: 'block' }}
        px={4}
        py={6}
      >
        <Stack gap={6} position="sticky" top={6}>
          <Stack gap={1}>
            <Text color="primary.main" textStyle="meta">
              Soulforge
            </Text>
            <Text textStyle="title">Component guide</Text>
          </Stack>

          <Stack gap={1}>
            {navItems.map(({ icon: Icon, label, path }) => {
              const active = path === '/' ? location.pathname === path : location.pathname.startsWith(path)

              return (
                <Button
                  asChild
                  colorPalette={active ? 'primary' : 'gray'}
                  justifyContent="flex-start"
                  key={path}
                  variant={active ? 'subtle' : 'ghost'}
                >
                  <NavLink to={path}>
                    <Icon />
                    {label}
                  </NavLink>
                </Button>
              )
            })}
          </Stack>
        </Stack>
      </Box>

      <Box minW={0}>
        <HStack
          background="bg.canvas"
          borderBottomWidth={1}
          display={{ base: 'flex', lg: 'none' }}
          justify="space-between"
          px={4}
          py={3}
        >
          <Text textStyle="title">Soulforge</Text>
          <HStack gap={1}>
            {navItems.map(({ label, path }) => (
              <Button asChild key={path} size="sm" variant="ghost">
                <NavLink to={path}>{label}</NavLink>
              </Button>
            ))}
          </HStack>
        </HStack>

        <Container px={{ base: 4, md: 6 }} py={{ base: 6, md: 10 }}>
          <HStack justify="flex-end" mb={5}>
            <Badge colorPalette="success" variant="subtle">
              React 19 · Vite 8
            </Badge>
            <ColorModeButton />
          </HStack>
          <Outlet />
        </Container>
      </Box>
    </Grid>
  )
}

export default AppLayout
