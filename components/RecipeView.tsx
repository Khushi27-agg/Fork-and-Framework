
import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';

interface Props {
  recipe: Recipe;
  onCookMode: () => void;
  onBack: () => void;
}

const STORAGE_KEY = 'fork_and_framework_saved_recipes';

export const RecipeView: React.FC<Props> = ({ recipe, onCookMode, onBack }) => {
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const alreadySaved = saved.some((r: Recipe) => r.title === recipe.title);
    setIsSaved(alreadySaved);
  }, [recipe.title]);

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    let newSaved;
    if (isSaved) {
      newSaved = saved.filter((r: Recipe) => r.title !== recipe.title);
      setIsSaved(false);
    } else {
      newSaved = [...saved, recipe];
      setIsSaved(true);
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSaved));
  };

  const generateShareableLink = () => {
    try {
      const json = JSON.stringify(recipe);
      const base64 = btoa(unescape(encodeURIComponent(json)));
      const url = new URL(window.location.href);
      url.hash = `recipe=${base64}`;
      return url.toString();
    } catch (e) {
      console.error("Link generation failed", e);
      return window.location.href;
    }
  };

  const handleShare = async () => {
    const shareUrl = generateShareableLink();
    const shareText = `Check out this healthy recipe from Fork & Framework: ${recipe.title}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Fork & Framework: ${recipe.title}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      copyLink();
    }
  };

  const copyLink = async () => {
    const shareUrl = generateShareableLink();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareToPlatform = (platform: 'whatsapp' | 'x' | 'facebook') => {
    const shareUrl = generateShareableLink();
    const shareText = encodeURIComponent(`Check out this healthy recipe from Fork & Framework: ${recipe.title}\n\n`);
    const encodedUrl = encodeURIComponent(shareUrl);

    let url = '';
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${shareText}${encodedUrl}`;
        break;
      case 'x':
        url = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12 relative">
      {/* Toast Notifications */}
      {showShareToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-stone-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl z-[60] animate-in slide-in-from-top-4 duration-300 flex items-center gap-2 border border-stone-700">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-bold text-sm">Recipe link copied to clipboard!</span>
        </div>
      )}

      {showSaveToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-emerald-900/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl shadow-2xl z-[60] animate-in slide-in-from-top-4 duration-300 flex items-center gap-2 border border-emerald-800">
          <svg className="w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <span className="font-bold text-sm">Recipe saved to your collection!</span>
        </div>
      )}

      <div className="flex justify-between items-center px-4 md:px-0">
        <button onClick={onBack} className="flex items-center gap-2 text-stone-600 hover:text-emerald-700 font-bold transition drop-shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
        
        <div className="flex gap-2">
          <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition font-bold text-sm border shadow-sm ${
              isSaved 
                ? 'bg-emerald-600 text-white border-emerald-500' 
                : 'bg-white/80 backdrop-blur-sm text-stone-600 border-stone-200 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isSaved ? 'Saved' : 'Save'}
          </button>

          <button 
            onClick={handleShare}
            className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-xl hover:bg-emerald-800 transition font-bold text-sm border border-emerald-600 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/50">
        <div className="bg-emerald-900 p-8 text-white relative overflow-hidden">
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
        </div>

        <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-6 flex flex-wrap gap-8 items-center border-b border-blue-100/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-200/50 rounded-xl text-blue-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Ambient Vibe</p>
              <p className="text-blue-900 font-medium text-sm">{recipe.moodVibe.ambientSound}</p>
            </div>
          </div>
        </div>

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
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-emerald-600 rounded-full"></span>
                Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 text-stone-600 group">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-200 rounded-full shrink-0 group-hover:bg-emerald-500 transition"></span>
                    {ing}
                  </li>
                ))}
              </ul>
            </section>

            {recipe.alternativeIngredients.length > 0 && (
              <section className="bg-stone-50/50 p-6 rounded-3xl border border-stone-100">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-stone-500 uppercase tracking-widest">
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
            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-stone-800">
                <span className="w-2 h-6 bg-stone-300 rounded-full"></span>
                Share to any platform
              </h3>
              <div className="bg-stone-50/50 p-6 rounded-2xl border border-stone-100">
                <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-4">Direct Share</p>
                <div className="flex flex-wrap gap-4 mb-6">
                   <button 
                    onClick={() => shareToPlatform('whatsapp')}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.408 0 12.045c0 2.12.554 4.189 1.602 6.06L0 24l6.12-1.605a11.777 11.777 0 005.927 1.603h.005c6.635 0 12.046-5.407 12.05-12.044a11.824 11.824 0 00-3.539-8.53z"/></svg>
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase">WhatsApp</span>
                  </button>
                  <button 
                    onClick={() => shareToPlatform('x')}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase">X (Twitter)</span>
                  </button>
                   <button 
                    onClick={() => shareToPlatform('facebook')}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase">Facebook</span>
                  </button>
                </div>

                <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-4">Recipe Link</p>
                <div className="flex gap-2">
                  <input 
                    readOnly 
                    value={generateShareableLink()}
                    className="flex-1 bg-white/50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-500 font-mono overflow-hidden whitespace-nowrap text-ellipsis"
                  />
                  <button 
                    onClick={copyLink}
                    className="bg-stone-200 hover:bg-emerald-100 hover:text-emerald-700 text-stone-600 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-orange-600">
                <span className="w-2 h-6 bg-orange-400 rounded-full"></span>
                Sustainability Note
              </h3>
              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                <p className="text-stone-700 italic leading-relaxed">{recipe.sustainabilityFactor}</p>
              </div>
            </section>
          </div>
        </div>

        <div className="p-8 pt-0 border-t border-stone-50 flex flex-col md:flex-row items-center justify-between gap-6 bg-stone-50/30">
          <div className="flex-1 w-full">
            <h4 className="text-stone-500 text-[10px] font-bold uppercase tracking-widest mb-4">How was this recipe?</h4>
            <div className="flex gap-4">
              <button 
                onClick={() => setFeedback('like')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border transition-all duration-300 ${
                  feedback === 'like' 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200' 
                    : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300'
                }`}
              >
                <svg className="w-5 h-5" fill={feedback === 'like' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                Like
              </button>
              <button 
                onClick={() => setFeedback('dislike')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border transition-all duration-300 ${
                  feedback === 'dislike' 
                    ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-200' 
                    : 'bg-white text-stone-600 border-stone-200 hover:border-rose-300'
                }`}
              >
                <svg className="w-5 h-5" fill={feedback === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 3h4.017c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" /></svg>
                Dislike
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <button
              onClick={onCookMode}
              className="w-full bg-emerald-700 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-emerald-800 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Enter Cook Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
