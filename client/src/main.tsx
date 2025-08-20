import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { env } from './env.ts'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import reportWebVitals from './reportWebVitals.ts'
import './styles.css'
import type { User } from './types/user.ts'

interface AuthContext {
  user: User & {
    email: string;
  }
}

export interface RouterContext {
  auth: AuthContext | null
}

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: env.VITE_GRAPHQL_URL,
    credentials: 'include',
  }),
  cache: new InMemoryCache(),
  connectToDevTools: true
});

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    auth: null
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
  return (
    <ApolloProvider client={apolloClient}>
      <RouterProvider
        router={router}
        context={{ auth: null }}
      />
    </ApolloProvider>
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
