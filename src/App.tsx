import { 
  Outlet, 
  RouterProvider, 
  createRouter, 
  createRootRoute,
  createRoute 
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from './pages/home'
import AboutPage from './pages/about'
import FaqsPage from './pages/faqs'
import ContactPage from './pages/contact'
import { Header } from './components/header'
import { Footer } from './components/footer'
import TermsPage from './pages/terms';
import { NotFoundPage } from './pages/404'
import { PaymentStatusPage } from './pages/payment-status'

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

// Create a root route
const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-slate-900 text-white">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  ),
})

// Create routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
})

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
})

const faqsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faqs',
  component: FaqsPage,
})

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: () => <div>Privacy Policy Page</div>, // Placeholder
})

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
})

// Create payment status route with search params validation
const paymentStatusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-status',
  validateSearch: (search: Record<string, unknown>) => {
  
    return {
      order_id : search.order_id as string,
    } as const;
  },
  component: PaymentStatusPage,
})

// Create a catch-all route for 404
const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
})

// Create and configure the router
const routeTree = rootRoute.addChildren([
  homeRoute,
  aboutRoute,
  contactRoute,
  faqsRoute,
  privacyRoute,
  termsRoute,
  paymentStatusRoute, // Add payment status route
  notFoundRoute, // Add the catch-all route last
])

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
