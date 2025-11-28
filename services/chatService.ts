import { GoogleGenAI } from "@google/genai";

// TODO: Remove hardcoded key after debugging .env issue
const API_KEY = (process.env.EXPO_PUBLIC_GOOGLE_API_KEY || '3665').trim();

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export const sendMessageToGemini = async (history: ChatMessage[], newMessage: string) => {
    try {
        if (!API_KEY) {
            console.error('Error: API_KEY is missing.');
            throw new Error('API Key is missing');
        }

        console.log('Sending request to Gemini via new SDK...');

        // The new SDK is simpler. We can just send the prompt if we don't need full history management
        // or construct the request as shown in the docs.
        // For a chat, we might want to send the history context if the model supports it in this simple call,
        // but the example provided was a simple generateContent.
        // Let's try to include history in the 'contents' if possible, or just send the new message for now 
        // to verify connectivity as per the user's "quick start" example.
        // However, to keep chat functionality, we should try to pass previous context.
        // The new SDK 'generateContent' accepts a string or a more complex object.

        // Constructing the contents array based on history + new message
        const contents = [
            ...history.map(msg => ({
                role: msg.role,
                parts: msg.parts.map(p => ({ text: p.text }))
            })),
            {
                role: 'user',
                parts: [{ text: newMessage }]
            }
        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents as any, // Casting to any to avoid strict type issues during migration if types differ
        });

        return response.text;

    } catch (error: any) {
        console.error('Error communicating with Gemini SDK:', error);
        throw error;
    }
};
