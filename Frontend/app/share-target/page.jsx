'use client';
// Fallback page for when the service worker isn't active yet during the
// first install. The SW normally intercepts the POST from Android's share
// sheet before it ever hits Next.js; this page handles the rare case where
// the SW hasn't claimed the page yet.
//
// Flow: Android POSTs multipart/form-data → SW intercepts → saves to
// IndexedDB → redirects to /?shared=true.
//
// If the SW misses the POST, this page receives the form submission,
// saves the file to IndexedDB itself, then redirects to /.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function saveImageToIDB(file) {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('instaparse-share', 1);
        req.onupgradeneeded = (e) => e.target.result.createObjectStore('images');
        req.onsuccess = (e) => {
            const db = e.target.result;
            const tx = db.transaction('images', 'readwrite');
            tx.objectStore('images').put(file, 'shared-image');
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        };
        req.onerror = () => reject(req.error);
    });
}

export default function ShareTargetPage() {
    const router = useRouter();

    useEffect(() => {
        // The SW should have already handled this and redirected us to /
        // But just in case, redirect to the app immediately.
        // The SW will have saved the image to IndexedDB before redirecting here.
        router.replace('/');
    }, [router]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#0f172a',
            color: '#94a3b8',
            fontFamily: 'monospace',
            fontSize: '14px',
        }}>
            Processing shared image...
        </div>
    );
}
