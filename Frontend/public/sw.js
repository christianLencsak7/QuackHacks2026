// Plain service worker — no build step, no bundling dependencies
// Intercepts the Web Share Target POST from iOS/Android share sheet

const CACHE_NAME = 'instaparse-v1';

self.addEventListener('install', (event) => {
    // Activate immediately, don't wait for old SW
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Open (or create) an IndexedDB database and store an image file
function saveImageToIDB(file) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('instaparse-share', 1);

        request.onupgradeneeded = (e) => {
            e.target.result.createObjectStore('images');
        };

        request.onsuccess = (e) => {
            const db = e.target.result;
            const tx = db.transaction('images', 'readwrite');
            tx.objectStore('images').put(file, 'shared-image');
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        };

        request.onerror = () => reject(request.error);
    });
}

// Intercept the share target POST request from the OS share sheet
self.addEventListener('fetch', (event) => {
    if (event.request.method === 'POST' && event.request.url.endsWith('/share-target')) {
        event.respondWith(
            (async () => {
                try {
                    const formData = await event.request.formData();
                    const files = formData.getAll('media');

                    if (files && files.length > 0) {
                        await saveImageToIDB(files[0]);
                    }

                    return Response.redirect('/?shared=true', 303);
                } catch (err) {
                    console.error('[SW] Share target error:', err);
                    return Response.redirect('/?share-error=true', 303);
                }
            })()
        );
    }
});
