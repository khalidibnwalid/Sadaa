import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from '@tanstack/react-router';
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute('/(auth)/login')({
    component: RouteComponent,
})

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

function RouteComponent() {
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(data: z.infer<typeof loginSchema>) {
        console.log(data);
    }

    return (
        <form
            className='grid items-center gap-y-3'
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className='flex flex-col items-center'>
                <h1 className='text-2xl font-bold'>Login</h1>
                <p className='text-sm text-muted-foreground'>Please enter your credentials</p>
            </div>
            <div className="gap-y-2" >
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
