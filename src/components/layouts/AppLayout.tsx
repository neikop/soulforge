import { Box, Button, Flex, Grid, HStack, Image, Skeleton, Stack, Text } from '@chakra-ui/react'
import { ColorModeButton } from 'components/app'
import { Suspense } from 'react'
import { FiBookOpen, FiCheckSquare, FiGrid, FiMap } from 'react-icons/fi'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { appRoutes } from 'routes'

const NAV_ITEMS = [
  { icon: FiGrid, label: 'Soul Binding', path: appRoutes.home.path },
  { icon: FiCheckSquare, label: appRoutes.genusInsight.label, path: appRoutes.genusInsight.path },
  { icon: FiMap, label: appRoutes.interactiveMap.label, path: appRoutes.interactiveMap.path },
]

/** Shared app shell with persistent planner navigation, theme controls and a responsive workspace. */
export default function AppLayout() {
  const { pathname } = useLocation()
  const activeNavIndex = NAV_ITEMS.findIndex(({ path }) => pathname === path)

  return (
    <Box bg="bg.page" color="fg.default" minH="100vh">
      <Box
        _print={{ display: 'none' }}
        as="header"
        bg="bg.page"
        borderBottomColor="border.default"
        borderBottomWidth="1px"
        position="sticky"
        top={0}
        zIndex="sticky"
      >
        <Flex
          align="center"
          columnGap={{ base: 4, md: 10 }}
          flexWrap="wrap"
          maxW="workspace"
          mx="auto"
          px={{ base: 3, md: 5, lg: 6 }}
          py={{ base: 3, md: 4 }}
          rowGap={3}
        >
          <HStack gap={3}>
            <Image alt="" boxSize={10} flexShrink={0} src="/soulforge.svg" />
            <Stack gap={0}>
              <Text textStyle="title">Soulforge</Text>
              <Text color="fg.muted" textStyle="bodyCompact">
                AION 2 · PvE Planner
              </Text>
            </Stack>
          </HStack>

          <Grid
            aria-label="Soulforge navigation"
            as="nav"
            bg="bg.subtle"
            borderColor="border.default"
            borderRadius="md"
            borderWidth="1px"
            order={{ base: 3, md: 2 }}
            p={1}
            templateColumns={`repeat(${NAV_ITEMS.length}, minmax(0, 1fr))`}
            w={{ base: 'full', md: 'auto' }}
          >
            <Box
              _motionReduce={{ transition: 'none' }}
              aria-hidden="true"
              bg="primary.subtle"
              borderRadius="sm"
              gridArea="1 / 1"
              opacity={activeNavIndex < 0 ? 0 : 1}
              pointerEvents="none"
              transform={`translateX(${activeNavIndex * 100}%)`}
              transitionDuration="moderate"
              transitionProperty="transform"
              transitionTimingFunction="ease-in-out"
            />
            {NAV_ITEMS.map(({ icon: ItemIcon, label, path }, index) => {
              const isActive = pathname === path

              return (
                <Button
                  _active={{ bg: 'primary.solid', color: 'primary.contrast' }}
                  _focusVisible={{ outlineColor: 'primary.focusRing' }}
                  _hover={{ bg: 'bg.hover', color: 'fg.default' }}
                  asChild
                  bg="transparent"
                  color={isActive ? 'primary.fg' : 'fg.muted'}
                  gridArea={`1 / ${index + 1}`}
                  key={path}
                  position="relative"
                  variant="ghost"
                >
                  <NavLink end to={path}>
                    <ItemIcon aria-hidden="true" />
                    {label}
                  </NavLink>
                </Button>
              )
            })}
          </Grid>
          <HStack gap={1} ml="auto" order={{ base: 2, md: 3 }}>
            <Button
              aria-label="Component guide"
              asChild
              color={pathname === appRoutes.components.path ? 'primary.fg' : 'fg.muted'}
              size="sm"
              title="Component guide"
              variant="ghost"
            >
              <NavLink to={appRoutes.components.path}>
                <FiBookOpen aria-hidden="true" />
                <Text as="span" display={{ base: 'none', lg: 'inline' }}>
                  Components
                </Text>
              </NavLink>
            </Button>
            <ColorModeButton />
          </HStack>
        </Flex>
      </Box>

      <Box
        _print={{ p: 0 }}
        as="main"
        maxW="workspace"
        minW={0}
        mx="auto"
        pb={12}
        pt={{ base: 5, md: 7 }}
        px={{ base: 3, md: 5, lg: 6 }}
      >
        <Suspense
          fallback={
            <Stack aria-busy="true" aria-label="Loading page" gap={6} minH="60vh" role="status">
              <Skeleton h={24} />
              <Skeleton h="60vh" />
            </Stack>
          }
        >
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  )
}
