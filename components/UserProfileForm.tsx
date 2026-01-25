import React, { useState } from 'react';
import { UserProfile } from '../types';

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export const UserProfileForm: React.FC<Props> = ({ onComplete }) => {
  const [profile, setProfile] = useState<UserProfile>({
    diet: 'non-vegetarian',
    allergies: [],
    isDiabetic: false,
    isLactoseIntolerant: false,
    location: '',
  });

  const [allergyInput, setAllergyInput] = useState('');

  const addAllergy = () => {
    if (allergyInput.trim() && !profile.allergies.includes(allergyInput.trim())) {
      setProfile({ ...profile, allergies: [...profile.allergies, allergyInput.trim()] });
      setAllergyInput('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-12 bg-white rounded-[3rem] shadow-2xl border border-stone-100 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-emerald-900 rounded-[1.5rem] flex items-center justify-center text-white text-3xl mx-auto mb-6 shadow-xl shadow-emerald-900/10">👨‍🍳</div>
        <h2 className="text-4xl font-black text-stone-900 serif-font mb-4">Chef's Profile</h2>
        <p className="text-stone-500 font-medium">Help us tailor your recipes to your health and heritage.</p>
      </div>

      <div className="space-y-10">
        <div>
          <label className="block text-[10px] font-black text-emerald-600 mb-3 uppercase tracking-[0.2em]">Regional Origin</label>
          <input
            type="text"
            placeholder="e.g. Kyoto, Tuscany, Mumbai..."
            className="w-full px-6 py-4 rounded-2xl border border-stone-200 outline-none input-glow transition-all bg-white text-stone-800 font-medium shadow-sm"
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
          />
        </div>

        <fieldset>
          <legend className="block text-[10px] font-black text-emerald-600 mb-4 uppercase tracking-[0.2em]">Dietary Style</legend>
          <div className="grid grid-cols-3 gap-3">
            {['vegetarian', 'vegan', 'non-vegetarian'].map((d) => (
              <button
                key={d}
                onClick={() => setProfile({ ...profile, diet: d as any })}
                className={`py-4 px-2 rounded-2xl border text-xs font-bold transition-all capitalize ${
                  profile.diet === d
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-lg shadow-emerald-900/10'
                    : 'bg-stone-50 text-stone-500 border-stone-100 hover:border-emerald-200 hover:bg-white'
                }`}
              >
                {d.replace('-', ' ')}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="block text-[10px] font-black text-emerald-600 mb-4 uppercase tracking-[0.2em]">Health Priorities</legend>
          <div className="flex flex-wrap gap-8 mb-6">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 rounded-lg border-stone-300 text-emerald-600 focus:ring-emerald-500/20"
                checked={profile.isDiabetic}
                onChange={(e) => setProfile({ ...profile, isDiabetic: e.target.checked })}
              />
              <span className="text-stone-700 font-bold text-sm group-hover:text-emerald-700 transition-colors">Diabetic Friendly</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-5 h-5 rounded-lg border-stone-300 text-emerald-600 focus:ring-emerald-500/20"
                checked={profile.isLactoseIntolerant}
                onChange={(e) => setProfile({ ...profile, isLactoseIntolerant: e.target.checked })}
              />
              <span className="text-stone-700 font-bold text-sm group-hover:text-emerald-700 transition-colors">Lactose Free</span>
            </label>
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Allergies? (e.g. Peanuts, Shellfish)"
              className="flex-1 px-6 py-4 rounded-2xl border border-stone-200 outline-none input-glow transition-all bg-white text-stone-800 font-medium shadow-sm"
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
            />
            <button
              onClick={addAllergy}
              className="bg-stone-900 text-white px-8 py-4 rounded-2xl hover:bg-emerald-800 transition-all font-bold text-xs uppercase tracking-widest shadow-lg"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.allergies.map((a) => (
              <span key={a} className="bg-rose-50 text-rose-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-rose-100">
                {a}
                <button onClick={() => setProfile({ ...profile, allergies: profile.allergies.filter(i => i !== a) })} className="hover:text-rose-900 font-bold">×</button>
              </span>
            ))}
          </div>
        </fieldset>

        <button
          onClick={() => onComplete(profile)}
          disabled={!profile.location.trim()}
          className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-200 active:scale-[0.98] disabled:opacity-20 disabled:grayscale"
        >
          Initialize Culinary Journey
        </button>
      </div>
    </div>
  );
};