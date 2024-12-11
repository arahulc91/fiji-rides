import { 
  Outlet, 
  RouterProvider, 
  createRouter, 
  createRootRoute,
  createRoute 
} from '@tanstack/react-router'
import HomePage from './pages/home'
import { Header } from './components/header'

// Create a root route
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  ),
})

// Create the home route
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

// Create and configure the router
const routeTree = rootRoute.addChildren([homeRoute])
const router = createRouter({ routeTree })

// Register the router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return <RouterProvider router={router} />
}

export default App
