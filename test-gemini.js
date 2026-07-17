const { GoogleGenAI } = require('@google/genai');

async function test() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: 'Hello world',
    });
    console.log("Success!", response.text);
  } catch (error) {
    console.error("Error from API:", error.message);
  }
}

test();

