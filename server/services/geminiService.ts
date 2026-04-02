const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash';

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

function getGeminiKey() {
  return process.env.GEMINI_API_KEY?.trim() ?? '';
}

function getGeminiModel() {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

export function hasGeminiConfig() {
  return getGeminiKey().length > 0;
}

export async function generateGeminiText(prompt: string, options?: { json?: boolean }) {
  const apiKey = getGeminiKey();

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing.');
  }

  const model = getGeminiModel();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: options?.json
        ? {
            temperature: 0.4,
            responseMimeType: 'application/json',
          }
        : {
            temperature: 0.6,
          },
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Gemini request failed (${response.status}): ${body || 'No body'}`);
  }

  const data = await response.json() as GeminiGenerateResponse;
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();

  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return text;
}
