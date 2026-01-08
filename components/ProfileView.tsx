
import React from 'react';
import { Recipe } from '../types';

interface Props {
  savedRecipes: Recipe[];
  onViewRecipe: (recipe: Recipe) => void;
  onUnsaveRecipe: (recipeTitle: string) => void;
  onBack: () => void;
}

export const ProfileView: React.FC<Props> = ({ savedRecipes, onViewRecipe, onUnsaveRecipe, onBack }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center px-4 md:px-0">
        <button onClick={onBack} className="flex items-center gap-2 text-stone-600 hover:text-emerald-700 font-bold transition drop-shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white/40">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">My Saved Recipes</h1>
        <p className="text-stone-500 mb-8">Your collection of culinary inspiration. Ready to cook something delicious?</p>
        
        {savedRecipes.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-stone-200 rounded-3xl">
            <div className="w-16 h-16 bg-emerald-100/50 rounded-3xl flex items-center justify-center mb-4 mx-auto border border-emerald-200/50 text-emerald-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            </div>
            <h2 className="font-bold text-stone-700 text-xl">No saved recipes yet</h2>
            <p className="text-stone-500 mt-2">Find a recipe you love and save it to see it here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRecipes.map(recipe => (
              <div key={recipe.title} className="bg-white rounded-3xl shadow-lg border border-white/50 overflow-hidden flex flex-col group transition-transform hover:-translate-y-1">
                <div className="p-6 flex-1">
                  <h3 className="font-bold text-lg text-stone-800 group-hover:text-emerald-700 transition-colors">{recipe.title}</h3>
                  <p className="text-sm text-stone-500 mt-2 line-clamp-3">{recipe.description}</p>
                </div>
                <div className="p-4 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button 
                    onClick={() => onViewRecipe(recipe)}
                    className="text-sm font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
                  >
                    View Recipe
                  </button>
                  <button 
                    onClick={() => onUnsaveRecipe(recipe.title)}
                    aria-label={`Unsave ${recipe.title}`}
                    className="p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-100 rounded-full transition"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
