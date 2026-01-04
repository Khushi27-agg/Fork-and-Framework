
import React, { useState, useRef, useEffect } from 'react';
import { Recipe } from '../types';
import { generateSpeech } from '../services/geminiService';

interface Props {
  recipe: Recipe;
  onExit: () => void;
}

export const CookMode: React.FC<Props> = ({ recipe, onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const steps = recipe.instructions;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const decodeBase64 = (base64: string) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const handleReadAloud = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);

    try {
      const base64Audio = await generateSpeech(steps[currentStep]);
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioData = decodeBase64(base64Audio);
        const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error("Speech generation failed", err);
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-950 z-[100] flex flex-col overflow-hidden text-stone-100">
      {/* Header */}
      <div className="p-4 md:p-6 bg-stone-900/50 backdrop-blur-md flex justify-between items-center border-b border-stone-800">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-800 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-emerald-950">
            👨‍🍳
          </div>
          <div>
            <h2 className="font-bold text-stone-100 truncate max-w-[200px] md:max-w-md">{recipe.title}</h2>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Cook Mode Active</p>
          </div>
        </div>
        <button 
          onClick={onExit} 
          className="w-10 h-10 flex items-center justify-center bg-stone-800 hover:bg-stone-700 rounded-full transition-colors group"
        >
          <svg className="w-5 h-5 text-stone-400 group-hover:text-stone-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 bg-stone-800 w-full relative">
        <div 
          className="h-full bg-emerald-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main Step Focus */}
        <div className="flex-1 flex flex-col p-8 md:p-16 justify-center bg-stone-950 relative">
          <div className="absolute top-12 left-12 text-[120px] font-black text-stone-900/40 select-none pointer-events-none leading-none">
            {currentStep + 1}
          </div>
          
          <div className="max-w-3xl mx-auto z-10 w-full">
            <div className="flex items-center gap-3 mb-8">
               <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
                 Current Phase
               </span>
               <button 
                onClick={handleReadAloud}
                disabled={isSpeaking}
                className={`p-2 rounded-full transition ${isSpeaking ? 'bg-emerald-500 text-stone-900 animate-pulse' : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-100'}`}
                title="Read Instruction"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                 </svg>
               </button>
            </div>
            
            <p className="text-3xl md:text-5xl lg:text-6xl text-white font-serif leading-[1.2] animate-in slide-in-from-bottom-8 duration-500 transition-all">
              {steps[currentStep]}
            </p>

            <div className="mt-12 flex items-center gap-6 opacity-40">
               <div className="flex -space-x-2">
                 {[...Array(3)].map((_, i) => (
                   <div key={i} className="w-8 h-8 rounded-full bg-emerald-900 border-2 border-stone-950 flex items-center justify-center text-[10px]">
                     🍳
                   </div>
                 ))}
               </div>
               <p className="text-xs font-medium tracking-wide">AI Culinary Guidance Enabled</p>
            </div>
          </div>
        </div>

        {/* Sidebar Steps List */}
        <div className="hidden lg:flex w-96 flex-col border-l border-stone-800 bg-stone-900/30 backdrop-blur-sm overflow-hidden">
          <div className="p-6 border-b border-stone-800">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500">Navigation Map</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {steps.map((step, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 flex gap-4 group ${
                  currentStep === i 
                    ? 'bg-emerald-500/10 border border-emerald-500/30' 
                    : 'hover:bg-stone-800/50 border border-transparent opacity-40 hover:opacity-100'
                }`}
              >
                <span className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center font-bold text-xs ${
                  currentStep === i ? 'bg-emerald-500 text-stone-950' : 'bg-stone-800 text-stone-500'
                }`}>
                  {i + 1}
                </span>
                <span className={`text-sm leading-relaxed ${currentStep === i ? 'text-white font-medium' : 'text-stone-400 group-hover:text-stone-200'} line-clamp-3`}>
                  {step}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-6 md:p-8 flex gap-4 bg-stone-900/80 backdrop-blur-xl border-t border-stone-800">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex-1 py-4 md:py-6 bg-stone-800 text-stone-300 rounded-[1.5rem] font-bold disabled:opacity-20 transition active:scale-[0.98] hover:bg-stone-700 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Previous
        </button>
        {currentStep === steps.length - 1 ? (
          <button
            onClick={onExit}
            className="flex-[2] py-4 md:py-6 bg-emerald-600 text-stone-950 rounded-[1.5rem] font-bold shadow-2xl shadow-emerald-500/10 transition active:scale-[0.98] hover:bg-emerald-500 flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            Complete Recipe
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            className="flex-[2] py-4 md:py-6 bg-emerald-600 text-stone-950 rounded-[1.5rem] font-bold shadow-2xl shadow-emerald-500/10 transition active:scale-[0.98] hover:bg-emerald-500 flex items-center justify-center gap-2"
          >
            Next Step
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};
