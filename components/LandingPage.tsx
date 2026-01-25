
import React from 'react';

interface Props {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<Props> = ({ onGetStarted }) => {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 pt-32 md:pt-48 pb-32 flex flex-col items-center text-center z-10">
      
      {/* Floating Background Elements */}
      <div className="hidden md:block absolute top-20 left-20 text-7xl animate-float-slow opacity-90 select-none hover:scale-110 transition-transform cursor-pointer">🍅</div>
      <div className="hidden md:block absolute top-32 right-20 text-7xl animate-float-delayed opacity-90 select-none hover:scale-110 transition-transform cursor-pointer">🥦</div>
      <div className="hidden md:block absolute bottom-20 left-32 text-7xl animate-float opacity-90 select-none hover:scale-110 transition-transform cursor-pointer">🥓</div>
      <div className="hidden md:block absolute bottom-40 right-40 text-7xl animate-float-slow opacity-90 select-none hover:scale-110 transition-transform cursor-pointer">🍕</div>
      
      {/* Central Mascot/Icon */}
      <div className="mb-12 relative">
         <div className="text-9xl animate-bounce-slow select-none">🥑</div>
         <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-3 bg-black/5 rounded-[100%] blur-sm"></div>
      </div>

      <div className="inline-block mb-6 px-6 py-3 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm uppercase tracking-[0.2em] border border-emerald-100 shadow-sm">
        Fork & Framework
      </div>

      <h1 className="text-4xl md:text-5xl font-black text-stone-800 mb-12 serif-font tracking-tight">
        Where ideas meet flavor
      </h1>

      <button
        onClick={onGetStarted}
        className="group relative bg-emerald-500 hover:bg-emerald-400 text-white text-xl font-bold px-16 py-6 rounded-3xl transition-all transform hover:-translate-y-1 shadow-2xl shadow-emerald-500/30 flex items-center gap-4 overflow-hidden"
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
        <span>Enter Kitchen</span>
        <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
      </button>

    </div>
  );
};
