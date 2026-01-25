
import React, { useState } from 'react';
import { Recipe } from '../types';

interface Props {
  recipe: Recipe;
  isSaved: boolean;
  onToggleSave: (recipe: Recipe) => void;
  onCookMode: () => void;
  onBack: () => void;
}

export const RecipeView: React.FC<Props> = ({ recipe, isSaved, onToggleSave, onCookMode, onBack }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = () => {
    const json = JSON.stringify(recipe);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    const url = `${window.location.origin}${window.location.pathname}#recipe=${base64}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 px-4 md:px-0">
        <button onClick={onBack} className="flex items-center gap-3 text-stone-500 hover:text-stone-900 font-black uppercase text-[10px] tracking-widest transition-all group">
          <div className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center group-hover:border-stone-900 transition-colors">
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          Return to Kitchen
        </button>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleShare}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white text-stone-600 border border-stone-200 font-bold text-xs uppercase tracking-widest hover:bg-stone-50 transition-all shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            {copySuccess ? 'Link Copied!' : 'Share Recipe'}
          </button>
          <button 
            onClick={() => onToggleSave(recipe)}
            className={`flex items-center gap-3 px-8 py-3 rounded-2xl transition-all font-black text-xs uppercase tracking-widest border shadow-lg ${
              isSaved 
                ? 'bg-emerald-600 text-white border-emerald-500' 
                : 'bg-stone-900 text-white border-stone-800 hover:bg-stone-800'
            }`}
          >
            <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {isSaved ? 'Saved to Studio' : 'Save Selection'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-stone-100 relative">
        <header className="bg-stone-900 p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-emerald-900/40 rounded-full blur-[120px]"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                 <span className="bg-emerald-500/10 text-emerald-400 px-5 py-2 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.3em]">AI Crafted Creation</span>
                 <div className="flex items-center gap-1 text-emerald-500">
                    {[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                 </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black leading-tight serif-font tracking-tight">{recipe.title}</h1>
              <p className="text-stone-400 text-xl md:text-2xl leading-relaxed font-medium max-w-3xl italic">{recipe.description}</p>
            </div>
            
            <div className="shrink-0 text-center lg:text-right bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 flex flex-col justify-center min-w-[200px]">
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Eco Performance</p>
              <p className="text-7xl font-black text-white">{recipe.sustainabilityScore}<span className="text-2xl text-emerald-500/50">/10</span></p>
              <div className="mt-4 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${recipe.sustainabilityScore * 10}%` }}></div>
              </div>
              <p className="text-[10px] font-bold text-stone-500 mt-4 uppercase tracking-widest">{recipe.sustainabilityFactor}</p>
            </div>
          </div>
        </header>

        <div className="bg-stone-50/80 backdrop-blur-md border-b border-stone-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left">
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] mb-2">Preparation</p>
            <p className="font-bold text-lg text-stone-800">{recipe.prepTime}</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] mb-2">Total Cook Time</p>
            <p className="font-bold text-lg text-stone-800">{recipe.cookTime}</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] mb-2">Studio Vibe</p>
            <p className="font-bold text-lg text-stone-800">{recipe.moodVibe.ambientSound}</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.3em] mb-2">Complexity</p>
            <p className="font-bold text-lg text-emerald-600">Pro-Level</p>
          </div>
        </div>

        <div className="p-12 md:p-20 grid grid-cols-1 lg:grid-cols-12 gap-20">
          <aside className="lg:col-span-4 space-y-16">
            <section>
              <h3 className="text-2xl font-black text-stone-900 serif-font mb-8 flex items-center gap-4">
                <span className="w-2 h-8 bg-emerald-600 rounded-full"></span>
                The Ingredients
              </h3>
              <ul className="space-y-5">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-4 text-stone-600 font-semibold group cursor-default">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-stone-200 group-hover:bg-emerald-500 transition-colors shrink-0"></div>
                    <span className="text-base leading-relaxed">{ing}</span>
                  </li>
                ))}
              </ul>
            </section>

            {recipe.alternativeIngredients.length > 0 && (
              <section className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm">
                <h3 className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.3em] mb-6">Chef's Adaptations</h3>
                <div className="space-y-6">
                  {recipe.alternativeIngredients.map((alt, i) => (
                    <div key={i} className="space-y-2">
                      <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Swap {alt.original} for</p>
                      <p className="text-emerald-900 font-black text-lg tracking-tight">{alt.substitute}</p>
                      <p className="text-emerald-800/60 text-xs italic leading-relaxed">{alt.reason}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </aside>

          <main className="lg:col-span-8 space-y-16">
            <section>
              <h3 className="text-2xl font-black text-stone-900 serif-font mb-10 flex items-center gap-4">
                <span className="w-2 h-8 bg-emerald-600 rounded-full"></span>
                Culinary Execution
              </h3>
              <div className="space-y-12">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="shrink-0 w-14 h-14 bg-stone-50 text-stone-400 rounded-3xl flex items-center justify-center font-black text-xl group-hover:bg-stone-900 group-hover:text-white transition-all shadow-sm border border-stone-100">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="space-y-5 pt-2 flex-1">
                      <p className="text-stone-700 text-xl md:text-2xl leading-relaxed font-medium">{step.text}</p>
                      {step.ingredientsUsed && step.ingredientsUsed.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {step.ingredientsUsed.map((ing, idx) => (
                            <span key={idx} className="bg-stone-50 text-stone-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-stone-200 group-hover:border-emerald-200 group-hover:text-emerald-700 transition-all">
                              {ing}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>

        <footer className="bg-stone-950 p-12 md:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col md:flex-row items-center gap-16">
             <div className="text-center md:text-left">
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Nutrition Matrix</p>
                <div className="flex gap-4 items-baseline">
                   <p className="text-6xl font-black">{recipe.nutrition.calories}</p>
                   <p className="text-stone-500 font-black uppercase text-[12px] tracking-[0.2em]">KCAL / SERVING</p>
                </div>
             </div>
             <div className="h-16 w-px bg-white/10 hidden md:block"></div>
             <div className="flex gap-12 text-center md:text-left">
                <div><p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2">PROTEIN</p><p className="font-bold text-xl">{recipe.nutrition.protein}</p></div>
                <div><p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2">CARBS</p><p className="font-bold text-xl">{recipe.nutrition.carbs}</p></div>
                <div><p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2">FATS</p><p className="font-bold text-xl">{recipe.nutrition.fats}</p></div>
             </div>
          </div>
          
          <button
            onClick={onCookMode}
            className="w-full md:w-auto bg-emerald-500 text-stone-950 px-16 py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-4 group"
          >
            <div className="w-8 h-8 rounded-full bg-stone-950/10 flex items-center justify-center animate-pulse">🍳</div>
            Begin Guided Cooking
          </button>
        </footer>
      </div>
    </div>
  );
};
