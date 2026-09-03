import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;
let model = null;

function getModel() {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY is not configured. Get a free key at https://aistudio.google.com/apikey');
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }
  return model;
}

export async function generateJSON(prompt, fallback = null) {
  try {
    const m = getModel();
    const result = await m.generateContent(prompt);
    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('Gemini API call failed, using fallback parser:', err.message);
    if (fallback) return fallback();
    throw err;
  }
}

export async function generateText(prompt) {
  const m = getModel();
  const result = await m.generateContent(prompt);
  return result.response.text();
}
