import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        const { imageBase64, mimeType } = req.body;

        if (!imageBase64) {
            return res.status(400).json({ error: 'An image property (imageBase64) is required in the JSON body.' });
        }

        const prompt = `Extract event details from this screenshot. Return STRICTLY valid JSON with these fields (use null if not found):
    {
      "title": "String",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD", 
      "startTime": "HH:MM", // 24-hr format
      "endTime": "HH:MM",
      "location": "String",
      "typeTags": ["String", "String"], // E.g. Concert, Party, Academic
      "cost": "String",
      "host": "String",
      "notes": "String"
    }

    Notes and tags should capture the vibe or extra details.
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                data: imageBase64,
                                mimeType: mimeType || 'image/jpeg'
                            }
                        }
                    ]
                }
            ],
            config: {
                responseMimeType: 'application/json',
            }
        });

        const output = response.text || response.text();
        const parsedData = JSON.parse(output);
        return res.status(200).json(parsedData);
    } catch (error) {
        console.error('Gemini API Error:', error);
        return res.status(500).json({ error: 'Failed to process AI request', details: error.message });
    }
}
