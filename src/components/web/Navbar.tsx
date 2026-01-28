import { Link } from "@tanstack/react-router";
import { Button, buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";
import { User, onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { logoutFn } from "@/lib/auth";

export function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);


    const handleSignout = async () => {
        await signOut(auth).then(() => {
            setUser(null);
            toast("Logged out successfully");
        }).catch((error) => {
            console.log(error);
            toast(error.message)
        });
        await logoutFn();
    }

    return (
        <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <img src="https://tanstack.com/images/logos/logo-color-banner-600.png" alt="Tanstack Start" className="size-8" />
                    <p className="text-lg font-semibold">TanStack</p>
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    {loading ? null : user ? (
                        <>
                            <Button onClick={handleSignout}>Logout</Button>
                            <Link to="/" className={buttonVariants({ 'variant': 'secondary' })}>Dashboard</Link>
                        </>

                    ) : (
                        <>
                            <Link to="/login" className={buttonVariants({ 'variant': 'secondary' })}>Login</Link>
                            <Link to="/signup" className={buttonVariants()}>Get Started</Link>
                        </>
                    )}
                </div>

            </div>

        </nav>
    );

}