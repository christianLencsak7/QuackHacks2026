// Plain service worker — no build step, no bundling dependencies
// Intercepts the Web Share Target POST from iOS/Android share sheet

console.log('[SW] Service worker script loaded');

self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    self.skipWaiting();
    console.log('[SW] skipWaiting called — will activate immediately');
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        clients.claim().then(() => {
            console.log('[SW] clients.claim() done — SW is now controlling all pages');
        })
    );
});

// Open (or create) an IndexedDB database and store an image file
function saveImageToIDB(file) {
    console.log('[SW] Saving file to IndexedDB:', file?.name, file?.size, 'bytes', file?.type);
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('instaparse-share', 1);

        request.onupgradeneeded = (e) => {
            console.log('[SW] IndexedDB upgrade needed — creating object store');
            e.target.result.createObjectStore('images');
        };

        request.onsuccess = (e) => {
            console.log('[SW] IndexedDB opened successfully');
            const db = e.target.result;
            const tx = db.transaction('images', 'readwrite');
            tx.objectStore('images').put(file, 'shared-image');
            tx.oncomplete = () => {
                console.log('[SW] File saved to IndexedDB ✅');
                resolve();
            };
            tx.onerror = () => {
                console.error('[SW] IndexedDB transaction error:', tx.error);
                reject(tx.error);
            };
        };

        request.onerror = () => {
            console.error('[SW] IndexedDB open error:', request.error);
            reject(request.error);
        };
    });
}

// Log ALL fetch requests so we can see exactly what the SW intercepts
self.addEventListener('fetch', (event) => {
    const { method, url } = event.request;
    const pathname = new URL(url).pathname;

    // Log every single request (remove this after debugging)
    console.log(`[SW] FETCH: ${method} ${pathname}`);

    if (method === 'POST' && pathname === '/share-target') {
        console.log('[SW] 🎯 Share target POST detected! Handling...');
        event.respondWith(
            (async () => {
                try {
                    const formData = await event.request.formData();
                    const allKeys = [...formData.keys()];
                    console.log('[SW] FormData keys:', allKeys);

                    // Try both 'media' and 'files' in case iOS sends a different field name
                    const files = formData.getAll('media').concat(formData.getAll('files'));
                    console.log('[SW] Files received:', files.length, files.map(f => `${f.name} (${f.type}, ${f.size}b)`));

                    if (files && files.length > 0) {
                        await saveImageToIDB(files[0]);
                    } else {
                        console.warn('[SW] ⚠️ No files found under "media" or "files" keys');
                        console.log('[SW] Full formData entries:', allKeys.map(k => `${k}=${formData.get(k)}`));
                    }

                    console.log('[SW] Redirecting to /?shared=true');
                    return Response.redirect('/?shared=true', 303);
                } catch (err) {
                    console.error('[SW] Share target error:', err);
                    return Response.redirect('/?share-error=true', 303);
                }
            })()
        );
    }
});
