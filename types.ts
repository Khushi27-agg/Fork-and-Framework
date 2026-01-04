
export type CookMood = 'quick' | 'gourmet' | 'comfort' | 'light';

export interface UserProfile {
  diet: 'vegetarian' | 'vegan' | 'non-vegetarian';
  allergies: string[];
  isDiabetic: boolean;
  isLactoseIntolerant: boolean;
  location: string;
}

export interface Ingredient {
  name: string;
  amount?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
  fiber: string;
}

export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  nutrition: NutritionInfo;
  sustainabilityFactor: string;
  sustainabilityScore: number; // 1-10
  prepTime: string;
  cookTime: string;
  moodVibe: {
    ambientSound: string;
  };
  alternativeIngredients: {
    original: string;
    substitute: string;
    reason: string;
  }[];
}

export enum AppMode {
  Onboarding = 'ONBOARDING',
  Dashboard = 'DASHBOARD',
  RecipeView = 'RECIPE_VIEW',
  CookMode = 'COOK_MODE'
}
