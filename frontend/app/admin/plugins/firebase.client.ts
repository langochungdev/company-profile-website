import { initFirebase } from "@/admin/config/firebase.config";
import { initAuth } from "@/admin/services/auth.service";

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();

    const firebaseConfig = {
        apiKey: config.public.firebaseApiKey as string,
        authDomain: config.public.firebaseAuthDomain as string,
        projectId: config.public.firebaseProjectId as string,
        storageBucket: config.public.firebaseStorageBucket as string,
        messagingSenderId: config.public.firebaseMessagingSenderId as string,
        appId: config.public.firebaseAppId as string,
        measurementId: config.public.firebaseMeasurementId as string,
    };

    const { app, db, analytics, auth } = initFirebase(firebaseConfig);

    if (app) {
        initAuth(app);
    }

    return {
        provide: {
            db,
            analytics,
            auth,
        },
    };
});
