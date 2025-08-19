import { env } from '@/env';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { TanstackDevtools } from '@tanstack/react-devtools';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

const client = new ApolloClient({
  uri: env.VITE_GRAPHQL_URL,
  cache: new InMemoryCache(),
  connectToDevTools: true
});

export const Route = createRootRoute({
  component: () => (
    <>
      <ApolloProvider client={client}>
        <Outlet />
        <TanstackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </ApolloProvider>
    </>
  ),
})
