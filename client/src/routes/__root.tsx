import { USER_QUERY } from '@/libs/graphql/auth';
import { apolloClient, type RouterContext } from '@/main';
import { TanstackDevtools } from '@tanstack/react-devtools';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
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
    </>
  ),
  beforeLoad: async () => {
    try {
      const { data } = await apolloClient.query({ query: USER_QUERY, fetchPolicy: 'network-only' })
      return {
        auth: data?.user?.id !== undefined
          ? { user: data.user } as RouterContext['auth']
          : null
      } satisfies RouterContext
    } catch (error) {
      console.error("Error fetching user:", error)
      return {
        auth: null
      } satisfies RouterContext
    }
  }
})
