
import React, { useState } from 'react';
import { getRestaurantAdvice } from '../geminiService';
import { ExperienceTier } from '../types';

const DiningGuide: React.FC<{ tier: ExperienceTier }> = ({ tier }) => {
  const [loading, setLoading] = useState(false);
  const [restaurant, setRestaurant] = useState('');
  const [advice, setAdvice] = useState<any | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant.trim()) return;
    
    setLoading(true);
    try {
      const data = await getRestaurantAdvice(restaurant, tier);
      setAdvice(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fastFoodShortcuts = ['McDonalds', 'Taco Bell', 'Chipotle', 'Starbucks', 'Subway'];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Tactical Dining</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Eating Out without Metabolic Sabotage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-xs font-black uppercase text-gray-500 mb-6 tracking-widest flex items-center gap-2">
              <i className="fas fa-location-dot"></i> Establish Location
            </h3>
            <form onSubmit={handleSearch} className="space-y-4">
              <input 
                type="text"
                placeholder="Restaurant name or cuisine..."
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-xs font-bold outline-none focus:border-red-600 transition-all text-gray-200"
                value={restaurant}
                onChange={e => setRestaurant(e.target.value)}
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-xl shadow-red-600/30 flex items-center justify-center gap-3"
              >
                {loading ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-utensils"></i>}
                Extract Menu Strategy
              </button>
            </form>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Tactical Shortcuts</h3>
            <div className="flex flex-wrap gap-2">
              {fastFoodShortcuts.map(s => (
                <button 
                  key={s}
                  onClick={() => setRestaurant(s)}
                  className="px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-lg text-[9px] font-black text-gray-500 hover:text-red-500 hover:border-red-600 transition-all uppercase"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 glass rounded-[3rem] border border-gray-800 overflow-hidden flex flex-col min-h-[500px]">
          {advice ? (
            <div className="flex-1 p-10 space-y-10 animate-in fade-in duration-500">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-green-600/5 border border-green-600/20 rounded-[2.5rem] space-y-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <i className="fas fa-crown text-5xl"></i>
                  </div>
                  <h4 className="text-[10px] font-black text-green-500 uppercase tracking-widest">The Elite Choice</h4>
                  <p className="text-lg font-black text-white italic leading-tight uppercase">"{advice.eliteChoice}"</p>
                </div>
                
                <div className="p-8 bg-blue-600/5 border border-blue-600/20 rounded-[2.5rem] space-y-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <i className="fas fa-shield-heart text-5xl"></i>
                  </div>
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest">The Survival Choice</h4>
                  <p className="text-lg font-black text-white italic leading-tight uppercase">"{advice.survivalChoice}"</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                  <i className="fas fa-ban"></i> Avoid at All Costs
                </h4>
                <div className="flex flex-wrap gap-3">
                  {advice.avoidList?.map((item: string, i: number) => (
                    <span key={i} className="px-4 py-2 bg-red-600/10 border border-red-600/30 rounded-xl text-[10px] font-black text-red-400 uppercase italic">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-gray-800">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">The Tactical Hack</p>
                  <p className="text-xs font-bold text-gray-300 italic">"{advice.tacticalHack}"</p>
                </div>
                <div className="p-5 glass border border-blue-900/30 bg-blue-600/5 rounded-2xl">
                   <p className="text-[9px] font-black text-blue-500 uppercase mb-2">Architect's Encouragement</p>
                   <p className="text-xs text-gray-400 font-bold italic leading-relaxed">"{advice.encouragement}"</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-20">
              <i className="fas fa-plate-wheat text-8xl mb-6"></i>
              <h3 className="text-2xl font-black italic uppercase tracking-widest">Target Unassigned</h3>
              <p className="max-w-md text-sm font-bold uppercase mt-2 leading-relaxed">Enter a restaurant to deploy tactical menu overrides and biological safeguarding.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiningGuide;
