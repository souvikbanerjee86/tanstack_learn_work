import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// if (!getApps().length) {
//     console.log(process.env.APP_FIREBASE_PROJECT_ID)
//     console.log(process.env.APP_FIREBASE_CLIENT_EMAIL)
//     console.log(process.env.APP_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'))
//     initializeApp({
//         credential: cert({
//             projectId: process.env.APP_FIREBASE_PROJECT_ID,
//             clientEmail: process.env.APP_FIREBASE_CLIENT_EMAIL,
//             // Handle newline characters in private key
//             privateKey: process.env.APP_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//         }),
//     });
// }


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

export const db = (() => {
    if (getApps().length === 0) {
        initializeApp({

        })
    }
    return getFirestore("default")
})()

export const adminAuth = getAuth();