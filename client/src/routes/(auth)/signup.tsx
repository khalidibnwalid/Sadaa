import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from '@tanstack/react-router';
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute('/(auth)/signup')({
    component: RouteComponent,
})

const signupSchema = z.object({
    username: z.string().min(2, { message: "Username is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

function RouteComponent() {
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    function onSubmit(data: z.infer<typeof signupSchema>) {
        console.log(data);
    }

    return (
        <form
            className='grid items-center gap-y-3'
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className='flex flex-col items-center'>
                <h1 className='text-2xl font-bold'>Sign Up</h1>
                <p className='text-sm text-muted-foreground'>Create your account</p>
            </div>
            <div className="grid gap-y-2">
                <Controller
                    name="username"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <Input
                            {...field}
                            error={error?.message}
                            label="Username"
                            type="text"
                            placeholder="username..."
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
                            label="Email"
                            type="email"
                            placeholder="me@example.com"
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
                            label="Password"
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
