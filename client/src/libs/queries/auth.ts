import type { AuthUser } from "@/types/user"
import { useMutation } from "@tanstack/react-query"
import { useRouteContext } from "@tanstack/react-router"
import type { ClientError } from "graphql-request"
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "../graphql/auth"

export const USER_CACHE_KEY = 'user'

// updates the cache automatically on login
export function useLoginMutation({
    onSuccess,
    onError,
}: {
    onSuccess?: (data: AuthUser | null | undefined) => void
    onError?: (error: ClientError) => void,
}) {
    const { graphqlClient, queryClient } = useRouteContext({
        from: '__root__'
    })

    return useMutation({
        mutationFn: async ({ credential, password }: { credential: string; password: string }) => {
            const { login } = await graphqlClient.request(LOGIN_MUTATION, {
                input: {
                    credential,
                    password
                }
            })

            return login
        },
        onSuccess: (data) => {
            if (!data) return;

            queryClient.setQueryData([USER_CACHE_KEY], data)
            onSuccess?.(data)
        },
        onError,
    })
}

// updates the cache automatically on signup
export function useSignupMutation({
    onSuccess,
    onError,
}: {
    onSuccess?: (data: AuthUser | null | undefined) => void
    onError?: (error: ClientError) => void,
}) {
    const { graphqlClient, queryClient } = useRouteContext({
        from: '__root__'
    })

    return useMutation({
        mutationFn: async ({ username, email, password }: { username: string; email: string; password: string }) => {
            const { signup } = await graphqlClient.request(SIGNUP_MUTATION, {
                input: {
                    username,
                    email,
                    password
                }
            })

            return signup
        },
        onSuccess: (data) => {
            if (!data) return;

            queryClient.setQueryData([USER_CACHE_KEY], data)
            onSuccess?.(data)
        },
        onError,
    })
}