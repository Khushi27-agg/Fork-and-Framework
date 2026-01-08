// Demo Mode Service
// Gemini / API calls are disabled in deployed version
// Full AI features are available in Google AI Studio

import { UserProfile, Recipe, CookMood } from "../types";

/**
 * Demo: Analyze ingredients from image
 */
export async function analyzeIngredientsFromImage(
  _base64Data: string
): Promise<string[]> {
  return ["Tomato", "Onion", "Olive Oil", "Garlic"];
}

/**
 * Demo: Generate recipe
 */
export async function generateRecipe(
  ingredients: string[],
  profile: UserProfile,
  mood: CookMood
): Promise<Recipe> {
  const moodMap: Record<CookMood, string> = {
    quick: "Quick & Easy",
    gourmet: "Gourmet Style",
    comfort: "Comfort Food",
    light: "Healthy & Light",
  };

  return {
    title: `Demo Recipe – ${moodMap[mood]}`,
    description:
      "This is a demo preview. Full AI-powered recipe generation is available in Google AI Studio.",
    ingredients:
      ingredients.length > 0
        ? ingredients
        : ["Tomato", "Onion", "Olive Oil", "Garlic"],
    instructions: [
      {
        text: "Heat olive oil and sauté onions and garlic.",
        ingredientsUsed: ["Olive Oil", "Onion", "Garlic"],
      },
      {
        text: "Add tomatoes and simmer until soft.",
        ingredientsUsed: ["Tomato"],
      },
    ],
    nutrition: {
      calories: 220,
      protein: "6g",
      carbs: "28g",
      fats: "9g",
      fiber: "5g",
    },
    sustainabilityFactor: "Uses seasonal, plant-based ingredients",
    sustainabilityScore: 8,
    prepTime: "10 minutes",
    cookTime: "15 minutes",
    moodVibe: {
      ambientSound: "Calm kitchen ambience",
    },
    alternativeIngredients: [
      {
        original: "Olive Oil",
        substitute: "Mustard Oil",
        reason: "Common regional alternative",
      },
    ],
  };
}

/**
 * Demo: Chat with AI
 */
export async function chatWithAI(message: string) {
  return {
    text: `Demo response to: "${message}". Full AI chat is available in Google AI Studio.`,
    sources: [],
  };
}

/**
 * Demo: Generate speech (disabled)
 */
export async function generateSpeech(
  _text: string
): Promise<string | undefined> {
  return undefined;
}
