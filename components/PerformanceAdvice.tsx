
import React, { useState } from 'react';
import { getStrategicPerformanceAdvice } from '../geminiService';
import { AthleticDiscipline } from '../types';

const PerformanceAdvice: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any>(null);
  const [athleteData, setAthleteData] = useState({
    name: 'Tyson W.',
    discipline: 'ENDURANCE' as AthleticDiscipline,
    targetEvent: 'Ironman 70.3',
    currentStruggle: 'Lactate threshold plateau and sleep disturbances',
    bioData: 'HRV: 42ms, Sleep: 5.5h, VO2: 58'
  });

  const handleGenerateAdvice = async () => {
    setLoading(true);
    try {
      const data = await getStrategicPerformanceAdvice(athleteData);
      setAdvice(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const provisionFollowUp = (timeline: string) => {
    alert(`Strategic Follow-up Provisioned: Biological re-audit scheduled for ${timeline}. Handshake synchronized.`);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Strategic Advice Engine</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Cross-Disciplinary Performance Architecture</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-gray-800 space-y-6">
            <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
              <i className="fas fa-radar"></i> Subject Parameters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-600 ml-1">Discipline</label>
                <select 
                  value={athleteData.discipline}
                  onChange={e => setAthleteData({...athleteData, discipline: e.target.value as AthleticDiscipline})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-xs font-bold outline-none focus:border-red-600 transition-all text-gray-200"
                >
                  <option value="BODYBUILDING">Physique / Aesthetics</option>
                  <option value="POWERLIFTING">Strength / Power</option>
                  <option value="ENDURANCE">Endurance / Oxidative</option>
                  <option value="COMBAT">Combat / Tactical</option>
                  <option value="TEAM_SPORTS">Team Dynamics / Speed</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-600 ml-1">Current Narrative</label>
                <textarea 
                  value={athleteData.currentStruggle}
                  onChange={e => setAthleteData({...athleteData, currentStruggle: e.target.value})}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-xs font-bold outline-none focus:border-red-600 h-32 transition-all text-gray-200 resize-none"
                  placeholder="Describe plateaus, bio-feedback, or upcoming performance targets..."
                />
              </div>
            </div>
            <button 
              onClick={handleGenerateAdvice}
              disabled={loading}
              className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-red-600/30 flex items-center justify-center gap-3"
            >
              {loading ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-brain-circuit"></i>}
              Engineer Performance Strategy
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 glass rounded-[2.5rem] border border-gray-800 overflow-hidden flex flex-col min-h-[600px]">
          {advice ? (
            <div className="flex-1 p-10 space-y-8 animate-in fade-in duration-500">
               <div className="flex justify-between items-start border-b border-gray-800 pb-6">
                 <div>
                   <span className={`text-[10px] font-black uppercase px-2 py-1 rounded mb-2 block w-fit ${
                     advice.priority === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-blue-600/10 text-blue-500'
                   }`}>{advice.priority} Priority</span>
                   <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">{advice.title}</h3>
                 </div>
                 <div className="text-right">
                   <p className="text-[9px] font-black text-gray-600 uppercase">Analysis ID</p>
                   <p className="font-mono text-sm text-gray-400">SPA-{Math.floor(Math.random()*10000)}</p>
                 </div>
               </div>

               <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-red-500 tracking-widest mb-2">Disciplinary Audit</h4>
                      <p className="text-xs text-gray-300 leading-relaxed font-bold italic">"{advice.disciplineAnalysis}"</p>
                    </div>
                    <div className="p-5 bg-gray-950 border border-gray-800 rounded-2xl">
                      <h4 className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-3">Biological Rationale</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{advice.biologicalRationale}</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="p-6 bg-red-600/5 border border-red-900/30 rounded-2xl">
                      <h4 className="text-[10px] font-black uppercase text-red-500 tracking-widest mb-3">Tactical Correction</h4>
                      <p className="text-sm font-black text-white italic">"{advice.tacticalCorrection}"</p>
                    </div>
                    <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                       <h4 className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-4">Implementation Timeline</h4>
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full border-2 border-red-600 flex items-center justify-center text-red-600">
                             <i className="fas fa-hourglass-start"></i>
                          </div>
                          <div>
                             <p className="text-xs font-black text-white uppercase">{advice.followUpTimeline}</p>
                             <p className="text-[9px] font-bold text-gray-600 uppercase">Window for Re-Audit</p>
                          </div>
                       </div>
                    </div>
                 </div>
               </div>

               <div className="mt-auto pt-8 border-t border-gray-800 flex justify-end gap-4">
                  <button 
                    onClick={() => provisionFollowUp(advice.followUpTimeline)}
                    className="px-8 py-4 bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl hover:bg-gray-200 transition-all shadow-xl"
                  >
                    Provision Follow-up
                  </button>
               </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
              <i className="fas fa-chess-knight text-8xl mb-6"></i>
              <h3 className="text-2xl font-black italic uppercase tracking-widest">Awaiting Strategic Input</h3>
              <p className="max-w-md text-sm font-bold uppercase mt-2 leading-relaxed">
                Define the athlete's discipline and current state to engineer a high-level performance strategy and follow-up protocol.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceAdvice;
