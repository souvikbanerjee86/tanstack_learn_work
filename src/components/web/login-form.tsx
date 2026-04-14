import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { auth } from "@/lib/firebase"
import { loginSchema } from "@/schemas/auth"
import { useForm } from "@tanstack/react-form"
import { Link, useNavigate } from "@tanstack/react-router"
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { loginFn } from "@/lib/auth"
import { signInWithEmailAndPassword } from "firebase/auth"
import { toast } from "sonner"
import { useState, useTransition } from "react"
import { getUserRole } from "@/lib/server-function"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertTriangleIcon, Mail, Lock, LogIn, Loader2 } from "lucide-react"


export function LoginForm() {
    const navigate = useNavigate()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const form = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        validators: {
            onSubmit: loginSchema,
        },
        onSubmit: async ({ value }) => {
            startTransition(async () => {
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, value.email, value.password);
                    const user = userCredential.user;
                    const idToken = await user.getIdToken();
                    await loginFn({ data: idToken });
                    const roleResponse = await getUserRole({ data: { user_id: user.uid } });
                    if (roleResponse.role != null) {
                        toast.success("Login successful")
                        navigate({ to: "/" })
                    } else {
                        await signOut(auth).then(async () => {
                        }).catch((error) => {
                            console.log(error);
                        });

                        setError("You are not authorized to login")
                    }

                } catch (error: any) {
                    const errorMessage = error.message;
                    toast.error(errorMessage)
                }
            });

        },
    })

    const handleGoogleLogin = async () => {
        startTransition(async () => {
            try {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const idToken = await result.user.getIdToken();
                await loginFn({ data: idToken });
                const roleResponse = await getUserRole({ data: { user_id: result.user.uid } });
                console.log(roleResponse);
                if (roleResponse.role != null) {
                    toast.success("Login successful")
                    navigate({ to: "/" })
                } else {
                    await signOut(auth).then(async () => {
                    }).catch((error) => {
                        console.log(error);
                    });
                    setError("You are not authorized to login")
                }
            } catch (error: any) {
                const errorMessage = error.message;
                toast.error(errorMessage)
            }
        })
    }


    return (
        <div className="w-full">
            <div className="mb-10 space-y-3 px-2">
                <h2 className="text-4xl font-black tracking-tight">Welcome back</h2>
                <p className="text-muted-foreground font-medium text-lg">Please enter your details to sign in.</p>
            </div>

            <Card className="rounded-3xl border-muted-foreground/10 bg-background/50 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden">
                <CardContent className="p-8 lg:p-10">
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }} className="space-y-8">
                        <FieldGroup className="space-y-4">
                            <form.Field
                                name="email"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid} className="space-y-2">
                                            <FieldLabel className="text-[11px] font-black uppercase tracking-widest opacity-60">Email Address</FieldLabel>
                                            <div className="relative group">
                                                <Mail className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    aria-invalid={isInvalid}
                                                    placeholder="name@company.com"
                                                    type="email"
                                                    className="pl-10 h-10 rounded-xl bg-background/50 border-muted-foreground/10 focus:ring-primary/20 transition-all shadow-sm"
                                                    autoComplete="off"
                                                />
                                            </div>
                                            {isInvalid && <FieldError errors={field.state.meta.errors} className="text-[10px] font-bold" />}
                                        </Field>
                                    )
                                }}
                            />
                            <form.Field
                                name="password"
                                children={(field) => {
                                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                    return (
                                        <Field data-invalid={isInvalid} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <FieldLabel className="text-[11px] font-black uppercase tracking-widest opacity-60">Password</FieldLabel>
                                                <Link to="/" className="text-[10px] font-bold text-primary hover:underline">Forgot password?</Link>
                                            </div>
                                            <div className="relative group">
                                                <Lock className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    aria-invalid={isInvalid}
                                                    placeholder="••••••••"
                                                    type="password"
                                                    className="pl-10 h-10 rounded-xl bg-background/50 border-muted-foreground/10 focus:ring-primary/20 transition-all shadow-sm"
                                                    autoComplete="off"
                                                />
                                            </div>
                                            {isInvalid && <FieldError errors={field.state.meta.errors} className="text-[10px] font-bold" />}
                                        </Field>
                                    )
                                }}
                            />
                        </FieldGroup>

                        <div className="space-y-4">
                            <Button disabled={isPending} type="submit" className="w-full h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                                {isPending ? "Logging in..." : "Sign in"}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-muted-foreground/10" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest px-2 text-muted-foreground/40 bg-[#f8fafc] dark:bg-zinc-950">
                                    Or continue with
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={isPending}
                                className="w-full h-11 rounded-xl font-bold bg-background shadow-sm hover:bg-muted/50 border-muted-foreground/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Google
                            </Button>
                        </div>

                        <p className="text-center text-sm font-medium text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link to="/signup" className="text-primary font-bold hover:underline underline-offset-4">
                                Sign up for free
                            </Link>
                        </p>

                        {error && (
                            <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5">
                                <AlertTriangleIcon className="h-4 w-4" />
                                <AlertTitle className="text-xs font-black uppercase tracking-widest mt-0.5">Authentication Error</AlertTitle>
                                <AlertDescription className="text-[11px] font-medium opacity-90 leading-relaxed">
                                    {error}. Please check with Admin at admin@eazyAI.com
                                </AlertDescription>
                            </Alert>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

