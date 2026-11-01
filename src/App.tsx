import { AppLayout } from 'components/layouts'
import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { appRoutes } from 'routes'
import Soulforge from 'views/Soulforge/Soulforge'

const Guide = lazy(() => import('views/Component/Guide'))
const GenusInsight = lazy(() => import('views/GenusInsight/GenusInsight'))
const InteractiveMap = lazy(() => import('views/InteractiveMap/InteractiveMap'))

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<Soulforge />} path={appRoutes.home.path} />
        <Route element={<GenusInsight />} path={appRoutes.genusInsight.path} />
        <Route element={<InteractiveMap />} path={appRoutes.interactiveMap.path} />
        <Route element={<Guide />} path={appRoutes.components.path} />
      </Route>
      <Route element={<Navigate replace to={appRoutes.home.path} />} path="*" />
    </Routes>
  )
}

export default App
