/**
 * Compresses an image File/Blob to a max width and quality,
 * then sends it to the Gemini API endpoint and returns parsed event data.
 *
 * @param {File|Blob} imageFile
 * @returns {Promise<object>} Parsed event data + screenshotUrl
 */
export async function extractEventFromImage(imageFile) {
    console.log('[extract] Starting extraction for:', imageFile.name, imageFile.type, imageFile.size + 'b');

    // Compress large images on a canvas before sending to reduce payload size
    const compressed = await compressImage(imageFile, 1280, 0.85);
    console.log('[extract] Compressed size:', compressed.size + 'b');

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.readAsDataURL(compressed);
        reader.onload = async () => {
            const base64Data = reader.result.split(',')[1];
            const mimeType = compressed.type || 'image/jpeg';
            console.log('[extract] Sending to /api/parse-image, base64 length:', base64Data.length);

            try {
                const res = await fetch('/api/parse-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageBase64: base64Data, mimeType }),
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error('[extract] API error response:', data);
                    throw new Error(data.error || `API error ${res.status}`);
                }

                console.log('[extract] ✅ Parsed data:', data);
                const screenshotUrl = URL.createObjectURL(imageFile);
                resolve({ ...data, screenshotUrl });
            } catch (err) {
                console.error('[extract] ❌ Fetch/parse error:', err);
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
    });
}

/**
 * Compresses an image to maxWidth x auto-height at given quality using a canvas.
 * Falls back to the original file if the browser doesn't support canvas or if
 * the image is already small enough.
 */
function compressImage(file, maxWidth = 1280, quality = 0.85) {
    return new Promise((resolve) => {
        // Skip compression for small images
        if (file.size < 500_000) {
            console.log('[extract] Image small enough, skipping compression');
            return resolve(file);
        }

        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);
            if (img.width <= maxWidth) {
                console.log('[extract] Image within maxWidth, skipping compression');
                return resolve(file);
            }
            const scale = maxWidth / img.width;
            const canvas = document.createElement('canvas');
            canvas.width = maxWidth;
            canvas.height = Math.round(img.height * scale);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
                (blob) => {
                    console.log('[extract] Compressed from', file.size, 'to', blob.size, 'bytes');
                    resolve(blob || file);
                },
                'image/jpeg',
                quality
            );
        };
        img.onerror = () => {
            console.warn('[extract] Image load failed, using original');
            resolve(file);
        };
        img.src = url;
    });
}
