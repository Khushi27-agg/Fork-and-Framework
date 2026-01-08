# Run and deploy the app

This contains everything you need to run the app locally.

View the app in AI Studio: https://ai.studio/apps/drive/1VJwXqTaQk3Tu9xl_YHdR-MtSFjRzbhA1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## ✨ Features

- 🍽️ **Personalized Recipe Suggestions**  
  Recommends dishes based on user location, dietary preference, and inputs.

- 🌍 **Region-Based Flavor Customization**  
  Adapts recipes to local cuisines and ingredient availability.

- 🥗 **Dietary Preference Support**  
  Supports Vegetarian, Vegan, and Non-Vegetarian options.

- ⚕️ **Health & Allergy Awareness**  
  Allows users to specify health conditions and allergies for safer recommendations.

- 🧠 **AI-Powered Reasoning**  
  Uses structured prompts with Gemini AI to generate intelligent and creative outputs.

- 🖥️ **Clean & Responsive UI**  
  Simple, intuitive interface optimized for both mobile and desktop.

- 🔐 **API-Key Safe Design**  
  Runs without exposing API keys; AI features activate only when a key is provided.
