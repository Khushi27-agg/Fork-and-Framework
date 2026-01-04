
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { UserProfile, Recipe, CookMood } from "../types";

const API_KEY = process.env.API_KEY || "";

export const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function analyzeIngredientsFromImage(base64Data: string): Promise<string[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
        { text: "Identify all food ingredients visible in this image. Return them as a comma-separated list." }
      ]
    },
    config: {
      temperature: 0.4,
    }
  });
  
  const text = response.text || "";
  return text.split(',').map(s => s.trim()).filter(Boolean);
}

export async function generateRecipe(ingredients: string[], profile: UserProfile, mood: CookMood): Promise<Recipe> {
  const moodPrompts = {
    quick: "Make it extremely 'quick and easy' with minimal steps and common pantry staples.",
    gourmet: "Create a 'gourmet adventure' with complex techniques, layered flavors, and restaurant-quality presentation.",
    comfort: "Focus on 'comfort food' - hearty, warm, and soul-satisfying dishes.",
    light: "Ensure it is 'healthy and light' - fresh, nutrient-dense, and lower in calories/heavy fats."
  };

  const prompt = `
    Based on these ingredients: ${ingredients.join(', ')}.
    User Profile:
    - Origin/Location: ${profile.location}
    - Diet: ${profile.diet}
    - Allergies: ${profile.allergies.join(', ')}
    - Health: ${profile.isDiabetic ? 'Diabetic' : ''} ${profile.isLactoseIntolerant ? 'Lactose Intolerant' : ''}
    
    COOK MOOD: ${moodPrompts[mood]}

    Generate a healthy, sustainable recipe. 
    IMPORTANT: Incorporate culinary influences or regional specialties associated with the user's location (${profile.location}) if it fits the ingredients.
    Ensure it respects all dietary restrictions.
    Include a mood-specific vibe with an ambient sound suggestion (BUT NO MUSIC SUGGESTIONS).
    Provide alternative ingredient swaps for key components.

    The response must be a JSON object matching this schema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          nutrition: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.NUMBER },
              protein: { type: Type.STRING },
              carbs: { type: Type.STRING },
              fats: { type: Type.STRING },
              fiber: { type: Type.STRING }
            }
          },
          sustainabilityFactor: { type: Type.STRING },
          sustainabilityScore: { type: Type.NUMBER },
          prepTime: { type: Type.STRING },
          cookTime: { type: Type.STRING },
          moodVibe: {
            type: Type.OBJECT,
            properties: {
              ambientSound: { type: Type.STRING, description: "Background ambient sound like 'Rainy jazz cafe' or 'Bustling Italian market'" }
            }
          },
          alternativeIngredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                substitute: { type: Type.STRING },
                reason: { type: Type.STRING }
              }
            }
          }
        },
        required: ["title", "description", "ingredients", "instructions", "nutrition", "sustainabilityFactor", "sustainabilityScore", "prepTime", "cookTime", "moodVibe", "alternativeIngredients"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function chatWithAI(message: string, context?: any) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
      You are an expert chef and nutritionist for the app "Fork and Framework". 
      Help the user with their culinary questions. 
      Context: ${JSON.stringify(context || {})}
      User message: ${message}
    `,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
}

export async function generateSpeech(text: string): Promise<string | undefined> {
  const genAI = new GoogleGenAI({ apiKey: API_KEY });
  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Chef voice: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Zephyr' },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}
