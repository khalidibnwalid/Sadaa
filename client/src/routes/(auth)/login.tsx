import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { useLoginMutation, USER_CACHE_KEY } from "@/libs/queries/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
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
    const navigate = Route.useNavigate();
    const { queryClient } = Route.useRouteContext()

    const { mutate: login, isPending } = useLoginMutation({
        onSuccess: (data) => {
            queryClient.setQueryData([USER_CACHE_KEY], { user: data });
            router.invalidate();
            // setTimeout because chat page beforeLoad runs before the invalidate promise resolves
            // which will cause the auth context to still be null, 
            // thus we force it to run late in the event loop using setTimeout
            // and for some reason using .then() or await won't work
            setTimeout(() => navigate({ to: '/chat' }), 0);
        },
        onError: (error) => {
            const msg = error.response.errors?.[0].message
            if (!msg) return

            if (msg.includes("user") || msg.includes("email")) {
                setError("credential", {
                    message: msg
                });
            }

            if (msg.includes("password")) {
                setError("password", {
                    message: msg
                });
            }
        }
    });

    const { control, handleSubmit, setError } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            credential: "",
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof loginSchema>) {
        login(data);
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
                disabled={isPending}
                variant={isPending ? 'outline' : 'default'}
                className="flex items-center justify-center gap-2"
            >
                {isPending && (
                    <Spinner variant="default" size="sm" />
                )}
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
