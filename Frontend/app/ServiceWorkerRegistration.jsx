'use client';
import { useEffect } from 'react';

// Registers the service worker once on mount so that the Web Share Target
// interception works on Android. The SW lives at /sw.js (in public/).
export default function ServiceWorkerRegistration() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/sw.js')
                .then(reg => console.log('[App] SW registered, scope:', reg.scope))
                .catch(err => console.error('[App] SW registration failed:', err));
        }
    }, []);

    return null;
}
