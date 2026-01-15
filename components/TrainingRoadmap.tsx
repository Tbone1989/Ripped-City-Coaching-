
import React from 'react';

const TrainingRoadmap: React.FC = () => {
  const weeks = Array.from({ length: 12 }, (_, i) => ({
    week: i + 1,
    status: i < 3 ? 'COMPLETED' : i === 3 ? 'ACTIVE' : 'LOCKED',
    focus: i < 4 ? 'Hypertrophy Base' : i < 8 ? 'Intensification' : 'Peak / Hardening',
    sessions: 5
  }));

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Evolution Roadmap</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">12-Week Structural Architecture • Phase II</p>
        </div>
        <div className="glass px-6 py-4 rounded-2xl border border-gray-800">
           <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Block Completion</p>
           <p className="text-2xl font-black text-red-500 italic">32%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {weeks.map((w) => (
          <div 
            key={w.week}
            className={`p-6 rounded-[2rem] border transition-all flex flex-col justify-between h-48 relative overflow-hidden ${
              w.status === 'COMPLETED' ? 'bg-green-600/5 border-green-600/30' :
              w.status === 'ACTIVE' ? 'bg-red-600 border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.2)]' :
              'bg-gray-900/40 border-gray-800 opacity-40'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className={`text-xl font-black italic ${w.status === 'ACTIVE' ? 'text-white' : 'text-gray-500'}`}>W{w.week}</span>
              {w.status === 'COMPLETED' && <i className="fas fa-check-circle text-green-500 text-xs"></i>}
              {w.status === 'LOCKED' && <i className="fas fa-lock text-gray-700 text-xs"></i>}
            </div>
            
            <div className="space-y-1">
              <p className={`text-[8px] font-black uppercase tracking-widest ${w.status === 'ACTIVE' ? 'text-red-100' : 'text-gray-600'}`}>{w.focus}</p>
              <p className={`text-[10px] font-bold ${w.status === 'ACTIVE' ? 'text-white' : 'text-gray-400'}`}>{w.sessions} Protocols</p>
            </div>

            {w.status === 'ACTIVE' && (
              <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 blur-2xl rounded-full animate-pulse"></div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
           <h3 className="text-xs font-black uppercase text-gray-500 mb-6 tracking-widest">Phase Intelligence</h3>
           <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500 shrink-0">
                  <i className="fas fa-mountain"></i>
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-white">Current Plateau Hazard</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed italic mt-1">"Systemic fatigue is rising in Week 4. We are shifting to a 'Double-Progression' model for compound lifts to maintain CNS integrity."</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0">
                  <i className="fas fa-wave-square"></i>
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-white">Metabolic Volatility</p>
                  <p className="text-[10px] text-gray-500 leading-relaxed italic mt-1">"Phase III will introduce aggressive caloric manipulation to drive stage-ready dryess."</p>
                </div>
              </div>
           </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border border-gray-800 bg-gradient-to-br from-red-600/10 to-transparent">
           <h3 className="text-xs font-black uppercase text-red-500 mb-6 tracking-widest">Architect Master Note</h3>
           <p className="text-lg font-black italic text-gray-200 leading-tight">
             "The first 3 weeks established the baseline. Now, we begin the process of deliberate biological overload. Do not compromise on rest intervals. Every second matters."
           </p>
           <button className="mt-8 px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Download Full PDF Roadmap</button>
        </div>
      </div>
    </div>
  );
};

export default TrainingRoadmap;
