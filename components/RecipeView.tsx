
import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';

interface Props {
  recipe: Recipe;
  isSaved: boolean;
  onToggleSave: (recipe: Recipe) => void;
  onCookMode: () => void;
  onBack: () => void;
}

export const RecipeView: React.FC<Props> = ({ recipe, isSaved, onToggleSave, onCookMode, onBack }) => {
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [showSaveToast, setShowSaveToast] = useState(false);
  // Removed showShareToast state as sharing is removed

  const handleSaveClick = () => {
    onToggleSave(recipe);
    if (!isSaved) {
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
    }
  };
  
  // Keeping generateShareableLink function as it might be useful for other internal purposes
  // even if direct sharing UI is removed.
  const generateShareableLink = () => {
    try {
      const json = JSON.stringify(recipe);
      const base64 = btoa(unescape(encodeURIComponent(json)));
      const url = new URL(window.location.href);
      url.search = '';
      url.hash = `recipe=${base64}`;
      return url.toString();
    } catch (e) {
      console.error("Link generation failed", e);
      return window.location.href;
    }
  };

  // Removed handleShare, copyLink, and shareToPlatform functions as sharing is removed

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12 relative">
      {/* Removed showShareToast JSX */}
      {showSaveToast && (
        <div role="status" aria-live="polite" className="fixed top-8 left-1/2 -translate-x-1/2 bg-emerald-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl z-[60] animate-in slide-in-from-top-4 duration-300 flex items-center gap-2 border border-emerald-800">
          <svg className="w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <span className="font-bold text-sm">Recipe saved to your collection!</span>
        </div>
      )}

      <div className="flex justify-between items-center px-4 md:px-0">
        <button onClick={onBack} className="flex items-center gap-2 text-stone-600 hover:text-emerald-700 font-bold transition drop-shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
        
        <div className="flex gap-2">
          <button 
            onClick={handleSaveClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition font-bold text-sm border shadow-sm ${
              isSaved 
                ? 'bg-emerald-600 text-white border-emerald-500' 
                : 'bg-white/80 backdrop-blur-sm text-stone-600 border-stone-200 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isSaved ? 'Saved' : 'Save'}
          </button>
          {/* Removed Share button */}
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50">
        <header className="bg-emerald-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold leading-tight mb-4">{recipe.title}</h1>
              <p className="text-emerald-100 opacity-90 text-lg leading-relaxed">{recipe.description}</p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <span className="text-emerald-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Eco Score</span>
              <div className="flex items-center gap-2 bg-emerald-800/50 px-4 py-2 rounded-2xl border border-emerald-700/50">
                <span className="text-3xl font-bold">{recipe.sustainabilityScore}</span>
                <span className="text-emerald-400">/ 10</span>
              </div>
            </div>
          </div>
        </header>

        <section className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-6 flex flex-wrap gap-8 items-center border-b border-blue-100/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-200/50 rounded-xl text-blue-700" aria-hidden="true">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Ambient Vibe</p>
              <p className="text-blue-900 font-medium text-sm">{recipe.moodVibe.ambientSound}</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-stone-100 border-b border-stone-100">
          {[
            { label: 'Calories', val: recipe.nutrition.calories },
            { label: 'Protein', val: recipe.nutrition.protein },
            { label: 'Carbs', val: recipe.nutrition.carbs },
            { label: 'Prep Time', val: recipe.prepTime }
          ].map((stat, i) => (
            <div key={i} className="p-6 text-center">
              <p className="text-stone-400 text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-stone-800">{stat.val}</p>
            </div>
          ))}
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section aria-labelledby="ingredients-heading">
              <h3 id="ingredients-heading" className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 text-stone-600 group">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-200 rounded-full shrink-0 group-hover:bg-emerald-500 transition" aria-hidden="true"></span>
                    {ing}
                  </li>
                ))}
              </ul>
            </section>

            {recipe.alternativeIngredients.length > 0 && (
              <section aria-labelledby="swaps-heading" className="bg-stone-50/50 p-6 rounded-3xl border border-stone-100">
                <h3 id="swaps-heading" className="text-sm font-bold mb-4 flex items-center gap-2 text-stone-500 uppercase tracking-widest">
                  Chef's Smart Swaps
                </h3>
                <div className="space-y-4">
                  {recipe.alternativeIngredients.map((alt, i) => (
                    <div key={i} className="text-sm">
                      <p className="text-stone-800 font-bold mb-1">If no {alt.original}:</p>
                      <p className="text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 inline-block">
                        Try <span className="font-bold">{alt.substitute}</span>
                      </p>
                      <p className="text-stone-500 mt-1 text-xs italic">{alt.reason}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
             {/* Removed Share section */}
            <section aria-labelledby="sustainability-heading" className="space-y-8">
              <h3 id="sustainability-heading" className="text-xl font-bold flex items-center gap-2 text-orange-600">
                <span className="w-2 h-6 bg-orange-400 rounded-full" aria-hidden="true"></span>
                Sustainability Note
              </h3>
              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                <p className="text-stone-700 italic leading-relaxed">{recipe.sustainabilityFactor}</p>
              </div>
            </section>
            
            <section aria-labelledby="instructions-heading">
              <h3 id="instructions-heading" className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-emerald-600 rounded-full" aria-hidden="true"></span>
                Instructions
              </h3>
              <ol className="space-y-6">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="text-stone-600">
                    <span className="font-bold text-stone-800">{i + 1}. </span>
                    {step.text}
                    {step.ingredientsUsed && step.ingredientsUsed.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {step.ingredientsUsed.map((ing, idx) => (
                          <span key={idx} className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-medium border border-stone-200 shadow-sm">
                            {ing}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>

        <div className="p-8 pt-0 border-t border-stone-50 flex flex-col md:flex-row items-center justify-between gap-6 bg-stone-50/30">
          <fieldset className="flex-1 w-full">
            <legend className="text-stone-500 text-[10px] font-bold uppercase tracking-widest mb-4">How was this recipe?</legend>
            <div className="flex gap-4">
              <button 
                onClick={() => setFeedback('like')}
                aria-label="Like this recipe"
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border transition-all duration-300 ${
                  feedback === 'like' 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200' 
                    : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300'
                }`}
              >
                <svg className="w-5 h-5" fill={feedback === 'like' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                Like
              </button>
              <button 
                onClick={() => setFeedback('dislike')}
                aria-label="Dislike this recipe"
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border transition-all duration-300 ${
                  feedback === 'dislike' 
                    ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-200' 
                    : 'bg-white text-stone-600 border-stone-200 hover:border-rose-300'
                }`}
              >
                <svg className="w-5 h-5" fill={feedback === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.017c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" /></svg>
                Dislike
              </button>
            </div>
          </fieldset>
          
          <div className="w-full md:w-auto">
            <button
              onClick={onCookMode}
              className="w-full bg-emerald-700 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-emerald-800 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Enter Cook Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
