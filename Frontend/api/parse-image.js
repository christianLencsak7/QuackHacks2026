import { GoogleGenAI } from '@google/genai';

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb',
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('[parse-image] GEMINI_API_KEY is not set');
        return res.status(500).json({ error: 'Server misconfiguration: GEMINI_API_KEY not set.' });
    }

    try {
        const { imageBase64, mimeType } = req.body;

        if (!imageBase64) {
            return res.status(400).json({ error: 'imageBase64 is required in the request body.' });
        }

        console.log(`[parse-image] Received image: mimeType=${mimeType}, base64Length=${imageBase64.length}`);

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are an expert event detail extractor. Look at this screenshot and extract any event information you can find.

Return ONLY a valid JSON object with exactly these fields (use null for any field not found):
{
  "title": "String - name of the event",
  "startDate": "YYYY-MM-DD or null",
  "endDate": "YYYY-MM-DD or null",
  "startTime": "HH:MM in 24hr format or null",
  "endTime": "HH:MM in 24hr format or null",
  "location": "String or null",
  "typeTags": ["String array of tags like Concert, Party, Meeting, Academic, Sports"],
  "cost": "String like Free or $20 or null",
  "host": "String - organizer name or null",
  "notes": "String - any other relevant details or null"
}

Do not wrap the JSON in markdown code blocks. Return raw JSON only.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                data: imageBase64,
                                mimeType: mimeType || 'image/jpeg',
                            }
                        }
                    ]
                }
            ],
            config: {
                responseMimeType: 'application/json',
            }
        });

        // Safely extract text from response
        let rawText;
        if (typeof response.text === 'string') {
            rawText = response.text;
        } else if (typeof response.text === 'function') {
            rawText = response.text();
        } else {
            rawText = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        }

        console.log('[parse-image] Raw Gemini response:', rawText.substring(0, 500));

        // Strip markdown code fences if Gemini wrapped the JSON anyway
        const cleaned = rawText
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```\s*$/i, '')
            .trim();

        let parsedData;
        try {
            parsedData = JSON.parse(cleaned);
        } catch (parseErr) {
            console.error('[parse-image] JSON parse failed. Raw text was:', rawText);
            return res.status(500).json({
                error: 'Gemini returned non-JSON output',
                raw: rawText,
                details: parseErr.message
            });
        }

        console.log('[parse-image] Parsed data:', JSON.stringify(parsedData));
        return res.status(200).json(parsedData);

    } catch (error) {
        console.error('[parse-image] Error:', error?.message, error?.status, error?.errorDetails);
        return res.status(500).json({
            error: 'Failed to process AI request',
            details: error.message,
            status: error.status ?? null,
        });
    }
}
