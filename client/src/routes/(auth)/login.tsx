import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { LOGIN_MUTATION } from "@/libs/graphql/auth";
import { ApolloError, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router';
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
    credential: z.string(),
    password: z.string(),
});

export const Route = createFileRoute('/(auth)/login')({
    component: RouteComponent,
})

function RouteComponent() {
    const router = useRouter();
    const navigate = useNavigate();

    const [login] = useMutation(LOGIN_MUTATION);
    const { control, handleSubmit, setError } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            credential: "",
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof loginSchema>) {
        try {
            const { data: res } = await login({
                variables: {
                    input: {
                        credential: data.credential,
                        password: data.password
                    }
                }
            });

            if (res?.login) {
                router.invalidate()
                navigate({ to: '/chat' })
            }
        } catch (error) {
            if (error instanceof ApolloError) {
                if (error.message.includes("user") || error.message.includes("email")) {
                    setError("credential", {
                        message: error.message
                    });
                }

                if (error.message.includes("password")) {
                    setError("password", {
                        message: error.message
                    });
                }
            }
        }
    }

    return (
        <form
            className='grid items-center gap-y-3 animate-fade-in'
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className='flex flex-col items-center'>
                <h1 className='text-2xl font-bold'>Login</h1>
                <p className='text-sm text-muted-foreground'>Please enter your credentials</p>
            </div>
            <div className="space-y-2">
                <Controller
                    name="credential"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <Input
                            {...field}
                            error={error?.message}
                            className="flex-1 w-full"
                            placeholder="Email or Username"
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <Input
                            {...field}
                            error={error?.message}
                            type="password"
                            placeholder="••••••••"
                        />
                    )}
                />
            </div>

            <Button
                type='submit'
            >
                Login
            </Button>
            <Link to="/signup">
                <Button
                    variant='ghost'
                    className='p-0 w-full'
                    size='sm'
                >
                    New User? Sign Up!
                </Button>
            </Link>
        </form>
    )
}
