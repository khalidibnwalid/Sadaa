import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useLoginMutation } from "@/libs/queries/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
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
    const navigate = useNavigate();

    const { mutate: login } = useLoginMutation({
        onSuccess: () => navigate({ to: '/chat' }),
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
