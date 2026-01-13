
import React, { useState } from 'react';
import { generateMarketingCopy } from '../geminiService';

const SocialMarketing: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [athleteData, setAthleteData] = useState({
    name: 'Marcus V.',
    win: 'Lost 4kg in 14 days while increasing bench press by 10kg.',
    phase: 'Aggressive Fat Loss',
    specialistNote: 'CNS recovery is peaking despite caloric deficit.'
  });

  const postQueue = [
    { platform: 'Instagram', title: ' Marcus V. - Transformation Breakdown', time: 'Tomorrow 09:00', status: 'READY' },
    { platform: 'Twitter', title: 'Why HRV is the primary growth signal', time: 'Wed 12:00', status: 'DRAFT' },
  ];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const copy = await generateMarketingCopy(athleteData);
      setResults(copy);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePush = (platform: string) => {
    alert(`Synthesizing API handshake for ${platform}... Protocol Pushed.`);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Growth Engine</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">High-Authority Marketing & Social Synthesis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border border-gray-800 space-y-6">
            <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
              <i className="fas fa-pen-nib"></i> Intelligence Source Data
            </h3>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-600 ml-1">Athlete Target</label>
                  <input type="text" value={athleteData.name} onChange={e => setAthleteData({...athleteData, name: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 text-sm font-bold outline-none focus:border-red-600 transition-all text-gray-200" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-600 ml-1">Phase Status</label>
                  <input type="text" value={athleteData.phase} onChange={e => setAthleteData({...athleteData, phase: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 text-sm font-bold outline-none focus:border-red-600 transition-all text-gray-200" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-600 ml-1">Evolution Narrative / Quantitative Win</label>
                <textarea value={athleteData.win} onChange={e => setAthleteData({...athleteData, win: e.target.value})} className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-5 text-sm font-bold outline-none focus:border-red-600 h-32 transition-all text-gray-200 resize-none" />
              </div>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-red-600/30 flex items-center justify-center gap-3"
            >
              {loading ? <i className="fas fa-spinner animate-spin text-xl"></i> : <i className="fas fa-bolt-lightning"></i>}
              Synthesize Authority Assets
            </button>
          </div>

          <div className="space-y-6">
            {results ? (
              <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                <div className="glass p-8 rounded-[2.5rem] border border-gray-800 relative overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]"><i className="fab fa-instagram mr-2"></i> IG Blueprint</span>
                    <button onClick={() => handlePush('Instagram')} className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:border-red-600 transition-all"><i className="fas fa-paper-plane text-[10px]"></i></button>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-bold italic flex-1">"{results.instagram}"</p>
                </div>

                <div className="glass p-8 rounded-[2.5rem] border border-gray-800 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]"><i className="fab fa-twitter mr-2"></i> Twitter Hook</span>
                    <button onClick={() => handlePush('Twitter')} className="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 hover:text-white hover:border-blue-600 transition-all"><i className="fas fa-paper-plane text-[10px]"></i></button>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-bold flex-1">{results.twitter}</p>
                </div>
              </div>
            ) : (
              <div className="h-64 glass rounded-[2.5rem] border border-gray-800 flex flex-col items-center justify-center text-center opacity-20">
                <i className="fas fa-robot text-6xl mb-4"></i>
                <p className="text-xs font-black uppercase tracking-widest leading-loose">Define win parameters to <br /> initiate neural content synthesis.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-xs font-black uppercase text-gray-500 mb-8 tracking-widest">Tactical Queue</h3>
            <div className="space-y-4">
              {postQueue.map((post, i) => (
                <div key={i} className="p-4 bg-black/40 rounded-2xl border border-gray-800 flex justify-between items-center group hover:border-red-900/50 transition-all">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{post.platform}</p>
                    <p className="text-[11px] font-bold text-gray-200 truncate w-40">{post.title}</p>
                    <p className="text-[9px] text-gray-600 font-bold uppercase">{post.time}</p>
                  </div>
                  <span className={`text-[8px] font-black uppercase px-2 py-1 rounded ${post.status === 'READY' ? 'bg-green-600/10 text-green-500' : 'bg-gray-800 text-gray-600'}`}>
                    {post.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-4 glass border border-gray-800 border-dashed rounded-xl text-[9px] font-black uppercase text-gray-600 hover:text-white hover:border-gray-600 transition-all">
              Manage Content Calendar
            </button>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-red-900/30 bg-red-600/5">
             <h3 className="text-xs font-black uppercase text-red-500 mb-4 tracking-widest">Authority Tip</h3>
             <p className="text-xs text-gray-400 italic leading-relaxed">
               "Data-backed scarcity is the ultimate conversion mechanism. Use the synthesized email assets to provision new 'Waitlist Only' openings for Unit Delta."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMarketing;
