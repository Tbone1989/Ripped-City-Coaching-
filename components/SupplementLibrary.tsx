
import React, { useState } from 'react';
// Use getArchiveDossier from geminiService as getSubstanceDossier does not exist
import { getArchiveDossier } from '../geminiService';

const SupplementLibrary: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [dossier, setDossier] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      // Use getArchiveDossier which handles both substances and conditions
      const data = await getArchiveDossier(query);
      setDossier(data);
    } catch (err) {
      console.error(err);
      alert("Neural synthesis failed. The compound may be too obscure for current datasets.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Protocol Library</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Clinical Compound Dossier & Interaction Matrix</p>
        </div>
      </div>

      <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
        <form onSubmit={handleSearch} className="relative">
          <input 
            type="text"
            className="w-full bg-gray-950 border-2 border-gray-800 rounded-2xl p-6 pl-14 text-lg font-bold outline-none focus:border-red-600 transition-all text-white placeholder:text-gray-700"
            placeholder="Search Compound (e.g. Ashwagandha, Enclomiphene, Creatine...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 text-xl"></i>
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-xl"
          >
            {loading ? <i className="fas fa-spinner animate-spin"></i> : "Synthesize Dossier"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {dossier ? (
            <div className="glass rounded-[3rem] border border-gray-800 overflow-hidden animate-in slide-in-from-bottom-4 duration-500 flex flex-col">
               <div className="p-10 bg-gradient-to-br from-gray-900 to-black border-b border-gray-800 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black uppercase text-red-500 tracking-[0.3em] mb-2 block">Tactical Dossier: Authorized Access</span>
                    <h3 className="text-5xl font-black italic uppercase tracking-tighter text-white">{dossier.name}</h3>
                  </div>
                  <div className="w-24 h-24 rounded-full border-4 border-red-600/20 flex flex-col items-center justify-center relative">
                     {/* Update field to safetyIndex from getArchiveDossier schema */}
                     <span className="text-4xl font-black text-red-500">{dossier.safetyIndex}</span>
                     <span className="text-[8px] font-black text-gray-500 uppercase">ROI INDEX</span>
                     <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-[spin_3s_linear_infinite]"></div>
                  </div>
               </div>

               <div className="p-10 space-y-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                         <i className="fas fa-microchip"></i> Biological Mechanism
                       </h4>
                       <p className="text-sm text-gray-300 leading-relaxed italic font-bold">"{dossier.mechanism}"</p>
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                         <i className="fas fa-bolt"></i> Performance ROI
                       </h4>
                       {/* Update field to performanceImpact from getArchiveDossier schema */}
                       <p className="text-sm text-gray-300 leading-relaxed font-bold italic">"{dossier.performanceImpact}"</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                      <i className="fas fa-triangle-exclamation"></i> Systemic Hazards & Interactions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dossier.hazards.map((h: string, i: number) => (
                        <div key={i} className="p-4 bg-red-600/5 border border-red-900/20 rounded-xl flex items-start gap-3">
                          <i className="fas fa-circle-exclamation text-red-600 mt-1"></i>
                          <p className="text-[11px] font-bold text-gray-400 leading-tight">{h}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 bg-gray-950 border-l-8 border-red-600 rounded-r-3xl">
                     <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4">The Architect's Verdict</h4>
                     <p className="text-2xl font-black italic text-white uppercase leading-none mb-2">"{dossier.verdict}"</p>
                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-4">Security Level: Level 4 Bio-Tech Clearance Required</p>
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-[500px] glass rounded-[3rem] border border-gray-800 border-dashed flex flex-col items-center justify-center p-12 text-center opacity-30">
               <i className="fas fa-dna text-8xl mb-8"></i>
               <h3 className="text-2xl font-black italic uppercase tracking-widest">Awaiting Substance Query</h3>
               <p className="max-w-md text-sm font-bold uppercase mt-4 leading-relaxed">
                 Enter any supplement, nutrient, or pharmacological agent to initiate a neural clinical audit.
               </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
              <h3 className="text-xs font-black uppercase text-gray-500 mb-6 tracking-widest">Trending Protocols</h3>
              <div className="space-y-3">
                 {['Taurine (CNS Utility)', 'Enclomiphene (HPTA)', 'Berberine (AMPK)', 'Magnesium Bisglycinate'].map(item => (
                   <button 
                    key={item} 
                    onClick={() => { setQuery(item.split(' (')[0]); handleSearch({ preventDefault: () => {} } as any); }}
                    className="w-full p-4 bg-gray-950 border border-gray-900 rounded-xl text-left hover:border-red-600 transition-all group"
                   >
                     <p className="text-[10px] font-black text-gray-500 uppercase group-hover:text-red-500">{item}</p>
                   </button>
                 ))}
              </div>
           </div>

           <div className="glass p-8 rounded-[2.5rem] border border-yellow-900/30 bg-yellow-600/5">
              <h3 className="text-xs font-black uppercase text-yellow-500 mb-4 tracking-widest">Architect Master Warning</h3>
              <p className="text-xs text-gray-400 italic leading-relaxed font-bold">
                "Substances are not solutions; they are levers. Pushing a lever without established biological foundations (sleep, hydration, caloric surplus) will eventually snap the mechanism. Audit your basics before your stack."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SupplementLibrary;
