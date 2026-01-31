

import { redirect } from "@tanstack/react-router";
import { adminAuth } from "./firebase-server";
import { createServerFn } from "@tanstack/react-start";
import { setCookie, deleteCookie, getCookie } from '@tanstack/react-start/server';

export const loginFn = createServerFn({ method: 'POST' })
    .inputValidator((idToken: string) => idToken)
    .handler(async ({ data: idToken }) => {
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        try {
            const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

            setCookie("session", sessionCookie, {
                maxAge: expiresIn,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
            });

            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            throw new Error("Unauthorized");
        }
    })


export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
    deleteCookie("session");
    return { success: true };
})

export const getUserFn = createServerFn({ method: 'GET' }).handler(async () => {
    const session = getCookie("session");

    if (!session) {
        throw redirect({ to: "/login" })
    }

    try {
        const decodedClaims = await adminAuth.verifySessionCookie(session, true);
        return decodedClaims;
    } catch (error) {
        return null;
    }
})

