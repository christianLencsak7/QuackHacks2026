'use client';

import dynamic from 'next/dynamic';

// We dynamically import App.jsx with ssr: false because the Vite React app heavily relies on
// browser APIs (window, indexedDB, localStorage) right on mount.
const AppWithoutSSR = dynamic(() => import('../src/App'), {
    ssr: false,
});

export default function Page() {
    return <AppWithoutSSR />;
}
