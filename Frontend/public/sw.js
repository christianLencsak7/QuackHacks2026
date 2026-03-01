// Plain service worker — no build step, no bundling dependencies
// Intercepts the Web Share Target POST from iOS/Android share sheet

const CACHE_NAME = 'instaparse-v1';

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

// Log ALL fetch events so we can see what the SW intercepts
self.addEventListener('fetch', (event) => {
    const { method, url } = event.request;

    // Only log non-asset requests to avoid noise
    if (!url.includes('/_next') && !url.includes('/static') && !url.match(/\.(js|css|png|svg|ico|woff)$/)) {
        console.log(`[SW] Fetch intercepted: ${method} ${url}`);
    }

    if (method === 'POST' && url.endsWith('/share-target')) {
        console.log('[SW] 🎯 Share target POST detected!');
        event.respondWith(
            (async () => {
                try {
                    const formData = await event.request.formData();
                    console.log('[SW] FormData keys:', [...formData.keys()]);

                    const files = formData.getAll('media');
                    console.log('[SW] Files received:', files.length, files.map(f => `${f.name} (${f.type}, ${f.size}b)`));

                    if (files && files.length > 0) {
                        await saveImageToIDB(files[0]);
                    } else {
                        console.warn('[SW] No files found in share formData');
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
