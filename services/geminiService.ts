import { GoogleGenAI } from "@google/genai";

// In a real app, this would be secure. For this demo generator, we use the env var.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const sendMessageToGemini = async (
  message: string, 
  history: { role: string, parts: [{ text: string }] }[] = []
): Promise<string> => {
  try {
    if (!apiKey) {
      return "API Key is missing. Please configure process.env.API_KEY to use the AI bot.";
    }

    const model = 'gemini-2.5-flash';
    
    // Convert our simple history format if needed, or just use generateContent for single turn
    // For a chat experience, we'd maintain history. Here we'll use a simple stateless call for the demo
    // to avoid complex state management in the mock. 
    
    const response = await ai.models.generateContent({
      model,
      contents: message,
      config: {
        systemInstruction: "You are a helpful, witty, and concise social media AI assistant. Keep responses short and engaging, suitable for a chat interface.",
      }
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to my brain right now.";
  }
};