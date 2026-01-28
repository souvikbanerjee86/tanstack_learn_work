
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { auth } from "@/lib/firebase"
import { loginSchema } from "@/schemas/auth"
import { useForm } from "@tanstack/react-form"
import { Link, useNavigate } from "@tanstack/react-router"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { loginFn } from "@/lib/auth"
import { signInWithEmailAndPassword } from "firebase/auth"
import { toast } from "sonner"

export function LoginForm() {
    const navigate = useNavigate()
    const form = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        validators: {
            onSubmit: loginSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, value.email, value.password);
                const user = userCredential.user;
                const idToken = await user.getIdToken();
                const res = await loginFn({ data: idToken });
                console.log(res);
                toast.success("Login successful")
                navigate({ to: "/" })
            } catch (error: any) {
                const errorMessage = error.message;
                toast.error(errorMessage)
            }
        },
    })

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            await loginFn({ data: idToken });
            toast.success("Login successful")
            navigate({ to: "/" })
        } catch (error: any) {
            const errorMessage = error.message;
            toast.error(errorMessage)
        }
    }

    return (

        <Card className="max-w-md w-full">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                }}>
                    <FieldGroup>
                        <form.Field
                            name="email"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="john.doe@example.com"
                                            type="email"
                                            autoComplete="off"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />
                        <form.Field
                            name="password"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched && !field.state.meta.isValid
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                        <Input
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            aria-invalid={isInvalid}
                                            placeholder="*****"
                                            type="password"
                                            autoComplete="off"
                                        />
                                        {isInvalid && (
                                            <FieldError errors={field.state.meta.errors} />
                                        )}
                                    </Field>
                                )
                            }}
                        />
                        <Field>
                            <Button type="submit">Login</Button>
                            <Button variant="outline" type="button" onClick={handleGoogleLogin}>
                                Login with Google
                            </Button>
                            <FieldDescription className="text-center">
                                Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
