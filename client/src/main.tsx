import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { GraphQLClient } from 'graphql-request'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import Spinner from './components/ui/Spinner.tsx'
import { env } from './env.ts'
import { USER_QUERY } from './libs/graphql/auth.ts'
import { USER_CACHE_KEY } from './libs/queries/auth.ts'
import reportWebVitals from './reportWebVitals.ts'
import './styles.css'
import type { AuthUser } from './types/user.ts'

const QUERY_STALE_TIME = 1000 * 60 * 3 // 3 minutes

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME,
    }
  }
})

const graphqlClient = new GraphQLClient(
  env.VITE_GRAPHQL_URL,
  {
    credentials: 'include'
  }
)

interface AuthContext {
  user: AuthUser
}

export interface RouterContext {
  auth: AuthContext | null
  queryClient: typeof queryClient
  graphqlClient: typeof graphqlClient
}


// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: null,
    queryClient,
    graphqlClient
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  const { data: user, isLoading } = useQuery({
    queryKey: [USER_CACHE_KEY],
    queryFn: async () => await graphqlClient.request(USER_QUERY),
  }, queryClient)

  if (isLoading) return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <Spinner variant='ping' size='lg' />
    </div>
  )

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        context={{
          auth: user
            ? { user: user.user as AuthUser }
            : null
        }}
      />
    </QueryClientProvider>
  );
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
