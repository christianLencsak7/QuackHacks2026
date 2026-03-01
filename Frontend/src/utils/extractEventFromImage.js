/**
 * Sends an image File/Blob to the Gemini API serverless endpoint
 * and returns structured event data to populate EventVerificationView.
 *
 * @param {File|Blob} imageFile - The image file to parse
 * @returns {Promise<object>} - Parsed event data + screenshotUrl
 */
export async function extractEventFromImage(imageFile) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.readAsDataURL(imageFile);
        reader.onload = async () => {
            const base64Data = reader.result.split(',')[1];

            try {
                const res = await fetch('/api/parse-image', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        imageBase64: base64Data,
                        mimeType: imageFile.type || 'image/jpeg',
                    }),
                });

                if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err.error || 'Failed to parse image with Gemini');
                }

                const data = await res.json();
                const screenshotUrl = URL.createObjectURL(imageFile);
                resolve({ ...data, screenshotUrl });
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read image file'));
    });
}
