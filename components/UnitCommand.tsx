
import React, { useState } from 'react';
import { runBatchAudit } from '../geminiService';
import { TeamAthlete } from '../types';

const UnitCommand: React.FC = () => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [batchSummary, setBatchSummary] = useState<any>(null);

  // Added required 'discipline' and 'tier' properties to each athlete object to comply with TeamAthlete interface
  const athletes: TeamAthlete[] = [
    { id: '1', name: 'Marcus V.', discipline: 'BODYBUILDING', tier: 'ELITE', adherence: 92, status: 'OPTIMAL', lastCheckin: '2h ago', criticalMetric: 'Macros' },
    { id: '2', name: 'Sara K.', discipline: 'ENDURANCE', tier: 'INTERMEDIATE', adherence: 65, status: 'CRITICAL', lastCheckin: '2d ago', criticalMetric: 'Integrity' },
    { id: '3', name: 'Jake R.', discipline: 'POWERLIFTING', tier: 'ADVANCED', adherence: 88, status: 'DEVIATING', lastCheckin: '5h ago', criticalMetric: 'HRV' },
    { id: '4', name: 'Elena D.', discipline: 'TEAM_SPORTS', tier: 'ELITE', adherence: 98, status: 'OPTIMAL', lastCheckin: '1h ago', criticalMetric: 'Macros' },
    { id: '5', name: 'Tyson W.', discipline: 'ENDURANCE', tier: 'ADVANCED', adherence: 72, status: 'DEVIATING', lastCheckin: '12h ago', criticalMetric: 'Sleep' },
    { id: '6', name: 'Mia L.', discipline: 'LIFESTYLE', tier: 'BEGINNER', adherence: 95, status: 'OPTIMAL', lastCheckin: '3h ago', criticalMetric: 'Weight' },
  ];

  const handleBatchAudit = async () => {
    setIsAuditing(true);
    try {
      const summary = await runBatchAudit({ athletes, unitName: 'Pro-Prep Unit Delta' });
      setBatchSummary(summary);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Tactical Unit Delta</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">High-Precision Group Accountability</p>
        </div>
        <button 
          onClick={handleBatchAudit}
          disabled={isAuditing}
          className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all flex items-center gap-3 shadow-xl shadow-red-600/20"
        >
          {isAuditing ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-microchip"></i>}
          Zephyr Batch Audit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Heatmap Grid */}
        <div className="lg:col-span-2 glass rounded-[2.5rem] p-8 border border-gray-800">
          <h3 className="text-xs font-black uppercase text-gray-500 mb-8 tracking-widest">Unit Integrity Grid</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {athletes.map(athlete => (
              <div key={athlete.id} className="glass p-6 rounded-2xl border border-gray-800 hover:border-red-600/50 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-3 h-3 rounded-full ${
                    athlete.status === 'OPTIMAL' ? 'bg-green-500' : 
                    athlete.status === 'DEVIATING' ? 'bg-yellow-500' : 'bg-red-600'
                  } shadow-[0_0_10px_currentColor]`}></div>
                  <span className="text-[10px] font-black text-gray-600">{athlete.lastCheckin}</span>
                </div>
                <h4 className="font-black italic uppercase text-lg group-hover:text-white transition-colors">{athlete.name}</h4>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                    <span className="text-gray-500">Adherence</span>
                    <span className={athlete.adherence < 70 ? 'text-red-500' : 'text-gray-300'}>{athlete.adherence}%</span>
                  </div>
                  <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                    <div className={`h-full ${athlete.adherence < 70 ? 'bg-red-600' : 'bg-green-600'}`} style={{ width: `${athlete.adherence}%` }}></div>
                  </div>
                </div>
                <p className="text-[9px] font-black uppercase text-gray-600 mt-3 tracking-widest">FOCUS: {athlete.criticalMetric}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Panel */}
        <div className="space-y-6">
          <div className="glass bg-red-600/5 border border-red-900/30 p-8 rounded-[2.5rem]">
            <h3 className="text-xs font-black uppercase text-red-500 mb-6 tracking-widest">AI Tactical Analysis</h3>
            {batchSummary ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-gray-500">Executive Summary</p>
                  <p className="text-xs font-medium text-gray-300 leading-relaxed italic">"{batchSummary.executiveSummary}"</p>
                </div>
                
                <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-xl">
                  <p className="text-[10px] font-black uppercase text-red-500 mb-1">Targeted Risk: Weakest Link</p>
                  <p className="text-sm font-black text-white italic uppercase">{batchSummary.weakestLink.name}</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase">{batchSummary.weakestLink.reason}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-gray-500">Group Adjustment Protocol</p>
                  <p className="text-xs font-bold text-blue-400">{batchSummary.groupAdjustment}</p>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase text-gray-500">Red Flag Log</p>
                  {batchSummary.redFlags.map((flag: string, i: number) => (
                    <div key={i} className="flex gap-2 items-start text-[10px] font-bold text-gray-400">
                      <span className="text-red-600 mt-1"><i className="fas fa-circle-exclamation"></i></span>
                      {flag}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                <i className="fas fa-tower-broadcast text-5xl"></i>
                <p className="text-xs font-black uppercase tracking-widest">Awaiting Batch Sync...</p>
              </div>
            )}
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-xs font-black uppercase text-gray-500 mb-6 tracking-widest">Unit Broadcaster</h3>
            <textarea 
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-xs font-bold outline-none focus:border-red-600 h-24 transition-all"
              placeholder="Broadcast protocol adjustment to all Unit members..."
            ></textarea>
            <button className="w-full mt-4 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-gray-200 transition-all">
              Execute Unit Command
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCommand;
