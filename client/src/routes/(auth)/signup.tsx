import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useSignupMutation } from "@/libs/queries/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const signupSchema = z.object({
    username: z.string().min(2, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const Route = createFileRoute('/(auth)/signup')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate();

    const { mutate: signup } = useSignupMutation({
        onSuccess: () => navigate({ to: '/chat' }),
        onError: (error) => {
            const msg = error.response.errors?.[0].message
            if (!msg) return

            if (msg.includes("user")) {
                setError("username", {
                    message: msg
                });
            }

            if (msg.includes("email")) {
                setError("email", {
                    message: msg
                });
            }

            if (msg.includes("password")) {
                setError("password", {
                    message: msg
                });
            }
        }
    })

    const { control, handleSubmit, setError } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(data: z.infer<typeof signupSchema>) {
        signup(data);
    }

    return (
        <form
            className='grid items-center gap-y-3 animate-fade-in'
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className='flex flex-col items-center'>
                <h1 className='text-2xl font-bold'>Sign Up</h1>
                <p className='text-sm text-muted-foreground'>Create your account</p>
            </div>
            <div className="space-y-2">
                <Controller
                    name="username"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <Input
                            {...field}
                            error={error?.message}
                            placeholder="Username"
                        />
                    )}
                />
                <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <Input
                            {...field}
                            error={error?.message}
                            type="email"
                            placeholder="Email"
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
                Sign Up
            </Button>
            <Link to="/login">
                <Button
                    variant='ghost'
                    className='p-0 w-full'
                    size='sm'
                >
                    Already have an account? Log In!
                </Button>
            </Link>
        </form>
    );
}
