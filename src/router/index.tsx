import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import BasicLayout from '../layouts/BasicLayout'

const Home = lazy(() => import('../pages/Home'))
const About = lazy(() => import('../pages/About'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <BasicLayout />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<div>Loading...</div>}><Home /></Suspense>,
        // meta: {
        //   breadcrumb: 'home'
        // }
      },
      {
        path: 'about',
        element: <Suspense fallback={<div>Loading...</div>}><About /></Suspense>,
        // meta: {
        //   breadcrumb: 'about'
        // }
      }
    ]
  }
])

export default router