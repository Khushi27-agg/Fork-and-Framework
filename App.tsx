
import React, { useState, useEffect } from 'react';
import { UserProfile, AppMode, Recipe, CookMood } from './types';
import { UserProfileForm } from './components/UserProfileForm';
import { RecipeView } from './components/RecipeView';
import { CookMode } from './components/CookMode';
import { Chatbot } from './components/Chatbot';
import { generateRecipe, analyzeIngredientsFromImage } from './services/geminiService';

const MOODS: { id: CookMood; label: string; icon: string; desc: string }[] = [
  { id: 'quick', label: 'Quick & Easy', icon: '⚡', desc: 'Minimal prep, maximum speed' },
  { id: 'gourmet', label: 'Gourmet', icon: '✨', desc: 'Advanced techniques & flavors' },
  { id: 'comfort', label: 'Comfort', icon: '❤️', desc: 'Warm, hearty, soul food' },
  { id: 'light', label: 'Healthy & Light', icon: '🌿', desc: 'Nutrient-dense & fresh' }
];

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.Onboarding);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ingredientsText, setIngredientsText] = useState('');
  const [analyzedIngredients, setAnalyzedIngredients] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedMood, setSelectedMood] = useState<CookMood>('quick');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [showAppShareToast, setShowAppShareToast] = useState(false);

  // Handle shared recipe links on load
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#recipe=')) {
        try {
          const base64 = hash.substring(8);
          const json = decodeURIComponent(escape(atob(base64)));
          const sharedRecipe = JSON.parse(json) as Recipe;
          if (sharedRecipe && sharedRecipe.title) {
            setSelectedRecipe(sharedRecipe);
            setMode(AppMode.RecipeView);
          }
        } catch (e) {
          console.error("Failed to parse shared recipe link", e);
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleProfileComplete = (p: UserProfile) => {
    setProfile(p);
    setMode(AppMode.Dashboard);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingImage(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const detected = await analyzeIngredientsFromImage(base64);
        setAnalyzedIngredients(prev => [...new Set([...prev, ...detected])]);
      } catch (err) {
        alert("Failed to analyze image. Please try typing ingredients.");
      } finally {
        setIsAnalyzingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleManualAdd = () => {
    if (ingredientsText.trim()) {
      const newItems = ingredientsText.split(',').map(s => s.trim()).filter(Boolean);
      setAnalyzedIngredients(prev => [...new Set([...prev, ...newItems])]);
      setIngredientsText('');
    }
  };

  const handleGenerateRecipe = async () => {
    if (!profile || analyzedIngredients.length === 0) return;
    setIsGenerating(true);
    try {
      const recipe = await generateRecipe(analyzedIngredients, profile, selectedMood);
      setSelectedRecipe(recipe);
      setMode(AppMode.RecipeView);
    } catch (err) {
      alert("Failed to generate recipe. Try adding more ingredients.");
    } finally {
      setIsGenerating(false);
    }
  };

  const removeIngredient = (ing: string) => {
    setAnalyzedIngredients(prev => prev.filter(i => i !== ing));
  };

  const handleBackToDashboard = () => {
    // Clear hash if we're coming from a shared link
    if (window.location.hash.startsWith('#recipe=')) {
      window.location.hash = '';
    }
    
    if (profile) {
      setMode(AppMode.Dashboard);
    } else {
      setMode(AppMode.Onboarding);
    }
  };

  const handleShareApp = async () => {
    const appUrl = window.location.origin + window.location.pathname;
    const shareData = {
      title: 'Fork & Framework',
      text: 'Check out this amazing AI-powered healthy recipe generator!',
      url: appUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing app:", err);
      }
    } else {
      await navigator.clipboard.writeText(appUrl);
      setShowAppShareToast(true);
      setTimeout(() => setShowAppShareToast(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showAppShareToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-top-4 duration-300 flex items-center gap-2 border border-stone-700">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-bold text-sm">App link copied! Invite your friends.</span>
        </div>
      )}

      <header className="p-6 md:p-8 flex justify-between items-center bg-white/70 backdrop-blur-md sticky top-0 z-30 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-800 text-white p-2.5 rounded-2xl shadow-lg shadow-emerald-100">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <path d="M12 17v-6" />
              <path d="M9 6v3a3 3 0 0 0 6 0V6" />
              <path d="M9 6v2" />
              <path d="M15 6v2" />
              <path d="M12 6v2" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-stone-900 leading-none">Fork & Framework</h1>
            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.3em] mt-1">Where ideas meet flavor</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={handleShareApp}
            className="p-2.5 bg-white/50 border border-stone-200 hover:bg-white rounded-2xl transition group flex items-center gap-2"
            title="Share App"
          >
            <svg className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="hidden md:inline text-xs font-bold text-stone-600">Share App</span>
          </button>

          {profile && mode !== AppMode.Onboarding && (
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-bold text-stone-700">{profile.location}</p>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{profile.diet}</p>
              </div>
              <button onClick={() => setMode(AppMode.Onboarding)} className="p-2.5 bg-white/50 border border-stone-200 hover:bg-white rounded-2xl transition group">
                <svg className="w-5 h-5 text-stone-500 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="px-6 md:px-8 max-w-7xl mx-auto py-8 flex-1">
        {mode === AppMode.Onboarding && (
          <UserProfileForm onComplete={handleProfileComplete} />
        )}

        {mode === AppMode.Dashboard && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white/40">
                <h2 className="text-2xl font-bold mb-2 text-stone-800">What's in your pantry?</h2>
                <p className="text-stone-400 text-sm mb-6">Add ingredients manually or snap a quick photo</p>
                
                <div className="space-y-6">
                  <div className="relative group">
                    <textarea
                      className="w-full h-40 p-5 bg-white/50 border border-stone-200 rounded-3xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-none text-stone-700"
                      placeholder="e.g. Avocado, Lime, Cilantro, Sourdough..."
                      value={ingredientsText}
                      onChange={(e) => setIngredientsText(e.target.value)}
                    />
                    <button 
                      onClick={handleManualAdd}
                      className="absolute bottom-5 right-5 bg-emerald-700 text-white px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-emerald-800 transition shadow-lg shadow-emerald-200"
                    >
                      Add Ingredients
                    </button>
                  </div>

                  <div className="relative">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-stone-200 rounded-[2rem] cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-300 group bg-white/30">
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      {isAnalyzingImage ? (
                        <div className="flex flex-col items-center animate-in zoom-in-95">
                          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                          <span className="text-emerald-700 font-bold text-sm">Visual Scan in Progress...</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center text-stone-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors mb-2 shadow-sm">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          </div>
                          <span className="text-stone-500 group-hover:text-emerald-700 font-bold text-sm">Smart Image Analysis</span>
                          <span className="text-stone-300 text-xs mt-1">AI will detect multiple items at once</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white/40">
                <h2 className="text-2xl font-bold mb-2 text-stone-800">Choose your Cook Mood</h2>
                <p className="text-stone-400 text-sm mb-6">We'll adjust the vibe and complexity accordingly</p>
                <div className="grid grid-cols-2 gap-4">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`p-5 rounded-3xl border-2 text-left transition-all duration-300 relative overflow-hidden ${
                        selectedMood === mood.id
                          ? 'border-emerald-500 bg-emerald-50/50 ring-4 ring-emerald-500/10'
                          : 'border-white/50 bg-white/40 hover:border-emerald-200'
                      }`}
                    >
                      <div className="text-3xl mb-3">{mood.icon}</div>
                      <p className={`font-bold text-sm ${selectedMood === mood.id ? 'text-emerald-900' : 'text-stone-700'}`}>{mood.label}</p>
                      <p className="text-stone-400 text-xs mt-1">{mood.desc}</p>
                      {selectedMood === mood.id && (
                        <div className="absolute top-4 right-4 text-emerald-500">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="bg-stone-900/95 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-2xl flex-1 flex flex-col relative overflow-hidden border border-stone-800">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                
                <h2 className="text-2xl font-bold mb-2 text-white flex justify-between items-center">
                  Selected Items
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest font-bold">
                    {analyzedIngredients.length} Items
                  </span>
                </h2>
                
                <div className="flex-1 mt-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                  {analyzedIngredients.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-stone-600 text-center py-12">
                      <div className="w-16 h-16 bg-stone-800/50 rounded-3xl flex items-center justify-center mb-4 border border-stone-700">
                         <svg className="w-8 h-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                      </div>
                      <p className="font-bold text-stone-500">Your basket is empty</p>
                      <p className="text-xs text-stone-600 mt-1 max-w-[200px]">Ingredients you add will appear here for the AI to process</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {analyzedIngredients.map((ing) => (
                        <div key={ing} className="bg-stone-800 px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-stone-700 animate-in zoom-in-90 duration-300">
                          <span className="text-white font-bold text-sm">{ing}</span>
                          <button onClick={() => removeIngredient(ing)} className="text-stone-500 hover:text-rose-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleGenerateRecipe}
                  disabled={analyzedIngredients.length === 0 || isGenerating}
                  className="w-full mt-8 bg-emerald-500 text-white py-5 rounded-[1.5rem] font-bold text-lg hover:bg-emerald-400 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-20 disabled:grayscale shadow-xl shadow-emerald-500/20"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="tracking-wide">Analyzing Mood & Ingredients...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">{MOODS.find(m => m.id === selectedMood)?.icon}</span>
                      <span className="tracking-wide">Healthy Recipe</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === AppMode.RecipeView && selectedRecipe && (
          <RecipeView 
            recipe={selectedRecipe} 
            onCookMode={() => setMode(AppMode.CookMode)}
            onBack={handleBackToDashboard}
          />
        )}
      </main>

      {/* FOOTER SECTION */}
      <footer className="mt-20 bg-stone-900 text-stone-300 py-16 px-6 md:px-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Mission Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3 opacity-90">
                <div className="bg-emerald-800 text-white p-2 rounded-xl">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <path d="M12 17v-6" />
                    <path d="M9 6v3a3 3 0 0 0 6 0V6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white font-serif">Fork & Framework Mission</h3>
              </div>
              <p className="text-stone-400 leading-relaxed max-w-lg italic">
                "Fork & Framework is more than just a recipe generator; it's a movement towards mindful eating and zero food waste. Our mission is to transform your pantry's hidden gems into healthy, chef-curated masterpieces, respecting your dietary needs and our planet's sustainability."
              </p>
              <div className="flex gap-4">
                 <a href="#" className="hover:text-emerald-400 transition-colors">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                 </a>
                 <a href="#" className="hover:text-emerald-400 transition-colors">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                 </a>
                 <a href="#" className="hover:text-emerald-400 transition-colors">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                 </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Navigation</h3>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => setMode(AppMode.Dashboard)} className="hover:text-emerald-400 transition-colors">Dashboard</button></li>
                <li><button onClick={() => setMode(AppMode.Onboarding)} className="hover:text-emerald-400 transition-colors">User Profile</button></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Contact info */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">Get in Touch</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span>hello@forkframework.ai</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-stone-500">
            <p>© 2026 Fork & Framework. All rights reserved.</p>
            <div className="flex gap-6">
              <span>Made with ❤️ for the Planet</span>
              <span>v1.2.0</span>
            </div>
          </div>
        </div>
      </footer>

      {mode === AppMode.CookMode && selectedRecipe && (
        <CookMode 
          recipe={selectedRecipe} 
          onExit={() => setMode(AppMode.RecipeView)} 
        />
      )}

      <Chatbot context={selectedRecipe || { profile, analyzedIngredients, currentMood: selectedMood }} />
    </div>
  );
};

export default App;
