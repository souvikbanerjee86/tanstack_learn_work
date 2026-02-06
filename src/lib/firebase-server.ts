import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
    const serviceAccountString = process.env.APP_FIREBASE_SERVICE_ACCOUNT_JSON;

    if (!serviceAccountString) {
        throw new Error(
            "The FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set."
        );
    }
    // const serviceAccount = JSON.parse(serviceAccountString);
    // initializeApp({
    //     credential: cert(serviceAccount),
    // });

    initializeApp()
}

export const adminAuth = getAuth();