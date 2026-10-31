import { Center, Spinner } from '@chakra-ui/react'
import { AppLayout } from 'components/layouts'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { appRoutes } from 'routes'
import Soulforge from 'views/Soulforge/Soulforge'

const Guide = lazy(() => import('views/Component/Guide'))

function App() {
  return (
    <Suspense
      fallback={
        <Center minH="40vh">
          <Spinner color="primary.main" size="lg" />
        </Center>
      }
    >
      <Routes>
        <Route element={<Soulforge />} path={appRoutes.home.path} />
        <Route element={<AppLayout />}>
          <Route element={<Guide />} path={appRoutes.components.path} />
        </Route>
        <Route element={<Navigate replace to={appRoutes.home.path} />} path="*" />
      </Routes>
    </Suspense>
  )
}

export default App
