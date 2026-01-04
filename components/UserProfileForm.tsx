
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

  const removeAllergy = (a: string) => {
    setProfile({ ...profile, allergies: profile.allergies.filter(item => item !== a) });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-stone-100 animate-in fade-in zoom-in-95 duration-500">
      <h2 className="text-3xl font-bold mb-6 text-emerald-800">Welcome to Fork & Framework</h2>
      <p className="text-stone-600 mb-8">Let's personalize your culinary experience. We'll tailor recipes to your background and dietary needs.</p>

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wider">Where are you from?</label>
          <input
            type="text"
            placeholder="e.g. Italy, India, New York..."
            className="w-full px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
          />
          <p className="text-[10px] text-stone-400 mt-1 font-medium italic">We'll use this to suggest regional flavors and local ingredient substitutes.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wider">Dietary Preference</label>
          <div className="flex flex-wrap md:flex-nowrap gap-3">
            {['vegetarian', 'vegan', 'non-vegetarian'].map((d) => (
              <button
                key={d}
                onClick={() => setProfile({ ...profile, diet: d as any })}
                className={`flex-1 py-3 px-2 rounded-xl border capitalize font-bold text-sm transition ${
                  profile.diet === d
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-emerald-300'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2 uppercase tracking-wider">Health & Allergies</label>
          <div className="flex flex-wrap gap-6 mb-4">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={profile.isDiabetic}
                onChange={(e) => setProfile({ ...profile, isDiabetic: e.target.checked })}
                className="w-5 h-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-stone-700 font-medium group-hover:text-emerald-700 transition">Diabetic</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={profile.isLactoseIntolerant}
                onChange={(e) => setProfile({ ...profile, isLactoseIntolerant: e.target.checked })}
                className="w-5 h-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-stone-700 font-medium group-hover:text-emerald-700 transition">Lactose Intolerant</span>
            </label>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Any other allergies? (e.g. Nuts, Soy)"
              className="flex-1 px-4 py-3 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
            />
            <button
              onClick={addAllergy}
              className="bg-emerald-100 text-emerald-700 px-6 py-3 rounded-xl hover:bg-emerald-200 transition font-bold text-sm"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {profile.allergies.map((a) => (
              <span key={a} className="bg-rose-50 text-rose-700 px-4 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-2 border border-rose-100 shadow-sm animate-in zoom-in-90">
                {a}
                <button onClick={() => removeAllergy(a)} className="hover:text-rose-900 text-base leading-none">&times;</button>
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => onComplete(profile)}
          disabled={!profile.location.trim()}
          className="w-full bg-emerald-700 text-white py-5 rounded-2xl font-bold text-lg hover:bg-emerald-800 transition shadow-xl shadow-emerald-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {profile.location ? "Let's Cook!" : "Please tell us where you're from"}
        </button>
      </div>
    </div>
  );
};
