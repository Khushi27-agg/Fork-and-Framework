
import React, { useEffect, useState } from "react";
import { SpeedInsights } from '@vercel/speed-insights/react';
import { UserProfile, AppMode, Recipe, CookMood } from "./types";

import { UserProfileForm } from "./components/UserProfileForm";
import { RecipeView } from "./components/RecipeView";
import { CookMode } from "./components/CookMode";
import { ProfileView } from "./components/ProfileView";
import { Chatbot } from "./components/Chatbot";
import { LandingPage } from "./components/LandingPage";

import {
  generateRecipe,
  analyzeIngredientsFromImage,
} from "./services/geminiService";

const MOODS: { id: CookMood; label: string; icon: string; desc: string }[] = [
  { id: "quick", label: "Quick & Easy", icon: "⚡", desc: "Under 20 mins" },
  { id: "gourmet", label: "Chef Special", icon: "✨", desc: "Complex flavors" },
  { id: "comfort", label: "Hearty Soul", icon: "🥘", desc: "Warm & filling" },
  { id: "light", label: "Fresh & Lean", icon: "🥗", desc: "Vibrant greens" },
];

const STORAGE_KEY = "fork_and_framework_saved_recipes";

const App: React.FC = () => {
  // Start on Landing Page
  const [mode, setMode] = useState<AppMode>(AppMode.Landing);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [ingredientsText, setIngredientsText] = useState("");
  const [analyzedIngredients, setAnalyzedIngredients] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<CookMood>("quick");

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);

  /* -------------------- INIT -------------------- */
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setSavedRecipes(saved);
    
    // Check if user has profile, if so maybe skip landing? 
    // For this demo, let's always show Landing to match the user request for "presentable form"
  }, []);

  /* -------------------- HELPERS -------------------- */
  const handleToggleSaveRecipe = (recipe: Recipe) => {
    const exists = savedRecipes.some((r) => r.title === recipe.title);
    const updated = exists
      ? savedRecipes.filter((r) => r.title !== recipe.title)
      : [...savedRecipes, recipe];

    setSavedRecipes(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleManualAdd = () => {
    if (!ingredientsText.trim()) return;

    const items = ingredientsText
      .split(/[,|\n]/)
      .map((i) => i.trim())
      .filter(Boolean);

    setAnalyzedIngredients((prev) => [...new Set([...prev, ...items])]);
    setIngredientsText("");
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingImage(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];
        const detected = await analyzeIngredientsFromImage(base64);
        setAnalyzedIngredients((prev) => [
          ...new Set([...prev, ...detected]),
        ]);
      } catch {
        alert("Image scan failed. Please add ingredients manually.");
      } finally {
        setIsAnalyzingImage(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!profile || analyzedIngredients.length === 0) return;

    setIsGenerating(true);
    try {
      const recipe = await generateRecipe(
        analyzedIngredients,
        profile,
        selectedMood
      );
      setSelectedRecipe(recipe);
      setMode(AppMode.RecipeView);
    } catch {
      alert("AI chef is busy. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-stone-50 selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* ---------- HEADER ---------- */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          mode === AppMode.Landing 
            ? 'bg-white/80 backdrop-blur-md py-5 border-b border-transparent' 
            : 'bg-white/90 backdrop-blur-xl py-4 border-b border-stone-200 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-12 items-center gap-4">
          
          {/* 1. Logo Section (Left) */}
          <div className="col-span-1 md:col-span-3 flex items-center justify-start">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setMode(AppMode.Landing)}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                👨‍🍳
              </div>
              <div className="leading-none">
                <h1 className="text-xl font-black text-stone-900 tracking-tight font-display">
                  Fork & Framework
                </h1>
                {mode !== AppMode.Landing && (
                   <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mt-0.5">
                     Studio
                   </p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Navigation Links (Center - Hidden on Mobile) */}
          <nav className="hidden md:col-span-6 md:flex items-center justify-center">
             {/* Empty nav for cleaner look */}
          </nav>

          {/* 3. Action Buttons (Right) */}
          <div className="col-span-1 md:col-span-3 flex items-center justify-end gap-4">
            {mode === AppMode.Landing ? (
              <>
                 <button 
                   onClick={() => setMode(AppMode.Onboarding)}
                   className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 text-sm"
                 >
                   Get Started
                 </button>
              </>
            ) : (
              <>
                {profile && (
                  <button
                    onClick={() => setMode(AppMode.Profile)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-100 transition-colors bg-white border border-stone-200/50"
                  >
                    <span>📚</span>
                    <span className="hidden md:inline">Saved</span>
                  </button>
                )}
                {profile && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-stone-800 to-stone-900 text-white flex items-center justify-center text-xs font-bold border-2 border-white ring-2 ring-stone-100 shadow-sm cursor-help" title={profile.location}>
                     {profile.location.charAt(0).toUpperCase()}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* ---------- MAIN ---------- */}
      <main className="w-full">
        {mode === AppMode.Landing && (
           <LandingPage onGetStarted={() => setMode(AppMode.Onboarding)} />
        )}

        {mode === AppMode.Onboarding && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <UserProfileForm
              onComplete={(p) => {
                setProfile(p);
                setMode(AppMode.Dashboard);
              }}
            />
          </div>
        )}

        {mode === AppMode.Dashboard && (
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* LEFT */}
            <div className="lg:col-span-7 space-y-10">
              <section>
                <h2 className="text-4xl font-black serif-font mb-3 text-stone-900">
                  Your Pantry
                </h2>
                <p className="text-stone-500 mb-6 font-medium">
                  What's in your kitchen today? Add items or scan your fridge.
                </p>

                <div className="relative group">
                  <textarea
                    className="w-full h-44 p-6 rounded-3xl border border-stone-200 text-lg bg-white shadow-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none"
                    placeholder="e.g. 2 ripe avocados, pasta, cherry tomatoes, basil..."
                    value={ingredientsText}
                    onChange={(e) => setIngredientsText(e.target.value)}
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                     <label className="p-3 rounded-xl bg-stone-100 text-stone-600 hover:bg-emerald-50 hover:text-emerald-600 cursor-pointer transition-colors" title="Scan Image">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                     </label>
                     <button
                        onClick={handleManualAdd}
                        className="px-6 py-3 rounded-xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 transition-colors"
                     >
                        Add Items
                     </button>
                  </div>
                  {isAnalyzingImage && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10">
                       <div className="flex flex-col items-center">
                          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                          <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest">Analyzing...</span>
                       </div>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-black serif-font mb-5 text-stone-900">
                  Cooking Mood
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {MOODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMood(m.id)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all group ${
                        selectedMood === m.id
                          ? "border-emerald-500 bg-emerald-50 shadow-md"
                          : "border-transparent bg-white shadow-sm hover:border-emerald-100"
                      }`}
                    >
                      <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">{m.icon}</div>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${selectedMood === m.id ? 'text-emerald-700' : 'text-stone-500'}`}>
                        {m.label}
                      </p>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-stone-100 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-bl-[100%] -mr-10 -mt-10 opacity-50"></div>
                
                <h3 className="text-2xl font-black serif-font mb-6 flex items-center gap-3 relative z-10">
                   <span className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg">🧺</span>
                   Chef’s Basket
                </h3>

                <div className="flex-1 bg-stone-50 rounded-2xl p-4 mb-6 overflow-y-auto max-h-[300px] border border-stone-100 relative z-10 custom-scrollbar">
                  {analyzedIngredients.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-stone-400">
                       <span className="text-4xl mb-2 opacity-30">🥕</span>
                       <p className="text-sm font-medium">Basket is empty</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {analyzedIngredients.map((i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold uppercase text-stone-700 shadow-sm flex items-center gap-2 group cursor-pointer hover:border-rose-200"
                          onClick={() => setAnalyzedIngredients(prev => prev.filter(item => item !== i))}
                        >
                          {i}
                          <span className="text-stone-300 group-hover:text-rose-400">×</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  disabled={isGenerating || analyzedIngredients.length === 0}
                  onClick={handleGenerate}
                  className="w-full py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] relative z-10"
                >
                  {isGenerating ? (
                     <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Generating...
                     </div>
                  ) : "Generate Recipe"}
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === AppMode.RecipeView && selectedRecipe && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <RecipeView
              recipe={selectedRecipe}
              isSaved={savedRecipes.some(
                (r) => r.title === selectedRecipe.title
              )}
              onToggleSave={handleToggleSaveRecipe}
              onCookMode={() => setMode(AppMode.CookMode)}
              onBack={() => setMode(AppMode.Dashboard)}
            />
          </div>
        )}

        {mode === AppMode.Profile && (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <ProfileView
              savedRecipes={savedRecipes}
              onViewRecipe={(r) => {
                setSelectedRecipe(r);
                setMode(AppMode.RecipeView);
              }}
              onUnsaveRecipe={(title) =>
                handleToggleSaveRecipe({ title } as Recipe)
              }
              onBack={() => setMode(AppMode.Dashboard)}
            />
          </div>
        )}

        {mode === AppMode.CookMode && selectedRecipe && (
          <CookMode
            recipe={selectedRecipe}
            onExit={() => setMode(AppMode.RecipeView)}
          />
        )}
      </main>
      
      {/* Footer for Landing */}
      {mode === AppMode.Landing && (
        <footer className="w-full py-8 text-center text-stone-400 text-sm font-medium border-t border-stone-100 bg-white">
          <p>© 2025 Fork & Framework. All rights reserved.</p>
        </footer>
      )}

      {mode !== AppMode.Landing && mode !== AppMode.CookMode && (
        <Chatbot
          context={
            selectedRecipe || {
              profile,
              analyzedIngredients,
              currentMood: selectedMood,
            }
          }
        />
      )}
      <SpeedInsights />
    </div>
  );
};

export default App;
