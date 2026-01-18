import { initFirebase } from "@/admin/config/firebase.config";

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

    const { db, analytics } = initFirebase(firebaseConfig);

    return {
        provide: {
            db,
            analytics,
        },
    };
});
