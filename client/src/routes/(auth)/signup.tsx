import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SIGNUP_MUTATION } from "@/libs/graphql/auth";
import { ApolloError, useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router';
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
    const router = useRouter();
    const navigate = useNavigate();

    const [signup] = useMutation(SIGNUP_MUTATION);
    const { control, handleSubmit, setError } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(input: z.infer<typeof signupSchema>) {
        try {
            const { data: res } = await signup({
                variables: {
                    input: {
                        username: input.username,
                        email: input.email,
                        password: input.password
                    }
                }
            });

            if (res?.signup) {
                router.invalidate();
                navigate({ to: '/chat' });
            }
        } catch (error) {
            if (error instanceof ApolloError) {
                if (error.message.includes("user")) {
                    setError("username", {
                        message: error.message
                    });
                }

                if (error.message.includes("email")) {
                    setError("email", {
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
