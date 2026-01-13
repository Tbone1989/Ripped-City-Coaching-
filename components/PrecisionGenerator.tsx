
import React, { useState } from 'react';
import { generateMealPlan, generateWorkoutBlock, generateRehabProtocol } from '../geminiService';
import { MealPlan, RehabProtocol } from '../types';

const PrecisionGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeGenType, setActiveGenType] = useState<'MEAL' | 'WORKOUT' | 'REHAB'>('MEAL');
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [workoutBlock, setWorkoutBlock] = useState<any | null>(null);
  const [rehabProtocol, setRehabProtocol] = useState<RehabProtocol | null>(null);
  const [profile, setProfile] = useState({
    name: 'Gifford (Demo)',
    status: 'Enhanced',
    bloodType: 'O+',
    goal: 'Hypertrophy / Fat Loss',
    schedule: '6 AM - 6 PM Corporate',
    injuries: 'Torn Labrum (Right)',
    allergens: 'Shellfish, Peanuts, Dairy'
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const allergenList = profile.allergens.split(',').map(s => s.trim()).filter(s => s);
      if (activeGenType === 'MEAL') {
        const data = await generateMealPlan({ ...profile, allergens: allergenList });
        setMealPlan(data);
      } else if (activeGenType === 'WORKOUT') {
        const data = await generateWorkoutBlock(profile);
        setWorkoutBlock(data);
      } else {
        const data = await generateRehabProtocol({ injury: profile.injuries, status: profile.status });
        setRehabProtocol(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-8">
      <div className="text-center">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">Tactical Generation Engine</h2>
        <div className="flex justify-center gap-4 mt-4">
          {['MEAL', 'WORKOUT', 'REHAB'].map((type) => (
            <button 
              key={type}
              onClick={() => setActiveGenType(type as any)}
              className={`px-6 py-2 rounded font-black uppercase text-xs tracking-widest transition-all ${activeGenType === type ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              {type === 'MEAL' ? 'Nutrition' : type === 'WORKOUT' ? 'Kinetic' : 'Clinical Rehab'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-2xl border border-gray-800 space-y-6">
          <div className="space-y-4">
            <h3 className="font-black italic uppercase tracking-wider text-red-600">Athlete Variable Input</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-500">Biological Status</label>
                <select 
                  className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-sm focus:border-red-600 outline-none"
                  value={profile.status}
                  onChange={e => setProfile({...profile, status: e.target.value})}
                >
                  <option>Natural</option>
                  <option>Enhanced</option>
                  <option>TRT Optimized</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-500">Blood Type</label>
                <input 
                  className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-sm focus:border-red-600 outline-none"
                  value={profile.bloodType}
                  onChange={e => setProfile({...profile, bloodType: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-red-500 font-black">Allergens (Leit-Risk)</label>
              <input 
                className="w-full bg-red-600/5 border border-red-900/40 rounded px-3 py-2 text-sm focus:border-red-600 outline-none text-red-400 font-bold"
                value={profile.allergens}
                onChange={e => setProfile({...profile, allergens: e.target.value})}
                placeholder="e.g. Shellfish, Peanuts..."
              />
              <p className="text-[8px] text-red-900 font-black uppercase mt-1">* GENERATOR WILL STRICTLY EXCLUDE THESE SUBSTANCES</p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-500">Objective Goal</label>
              <input 
                className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-sm focus:border-red-600 outline-none"
                value={profile.goal}
                onChange={e => setProfile({...profile, goal: e.target.value})}
              />
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-800 text-white font-black uppercase tracking-widest rounded transition-all shadow-xl shadow-red-600/10"
          >
            {loading ? <i className="fas fa-spinner animate-spin mr-2"></i> : <i className="fas fa-microchip mr-2"></i>}
            Execute Tactical Synthesis
          </button>
        </div>

        <div className="glass rounded-2xl border border-gray-800 overflow-hidden flex flex-col min-h-[500px]">
          {activeGenType === 'MEAL' && mealPlan && (
            <div className="flex-1 p-8 space-y-6 overflow-y-auto animate-in fade-in duration-500">
               <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                  <h4 className="font-black italic uppercase text-red-500">Allergen-Safe Protocol</h4>
                  <div className="flex gap-2">
                    <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-green-600/20 text-green-500 border border-green-600/40 rounded">Allergy Verified</span>
                    <span className="text-xl font-black">{mealPlan.calories} kcal</span>
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 text-center">
                    <p className="text-[8px] text-gray-500 font-black uppercase">Protein</p>
                    <p className="font-black text-red-500">{mealPlan.macros.protein}g</p>
                  </div>
                  <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 text-center">
                    <p className="text-[8px] text-gray-500 font-black uppercase">Carbs</p>
                    <p className="font-black text-blue-500">{mealPlan.macros.carbs}g</p>
                  </div>
                  <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 text-center">
                    <p className="text-[8px] text-gray-500 font-black uppercase">Fats</p>
                    <p className="font-black text-white">{mealPlan.macros.fats}g</p>
                  </div>
               </div>
               <div className="space-y-4">
                  {mealPlan.schedule.map((m, i) => (
                    <div key={i} className="flex gap-4 p-4 glass rounded-xl border border-gray-800">
                      <span className="font-black italic text-red-500 text-[10px] w-12 pt-0.5">{m.time}</span>
                      <div className="space-y-1">
                        <p className="text-xs font-bold uppercase">{m.meal}</p>
                        <p className="text-[9px] text-gray-500">{m.ingredients.join(', ')}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
          {/* ... other types ... */}
        </div>
      </div>
    </div>
  );
};

export default PrecisionGenerator;
