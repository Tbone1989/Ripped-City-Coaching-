
import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import ProtocolTracker from './ProtocolTracker';
import { getDailyCoachBriefing } from '../geminiService';

const Dashboard: React.FC<{ role: UserRole }> = ({ role }) => {
  const isCoach = role === UserRole.COACH;
  const [activeView, setActiveView] = useState<'OVERVIEW' | 'BIOMETRICS' | 'PROTOCOLS'>('OVERVIEW');
  const [systemInsight, setSystemInsight] = useState("Initializing protocol link... Analyzing biological integrity.");
  const [briefing, setBriefing] = useState<any>(null);

  useEffect(() => {
    const insights = isCoach 
      ? "SYSTEM: Unit Delta integrity score at 94%. Adherence deviation detected in Subject 02. Recommend specialist intervention."
      : "SYSTEM: Biological markers indicate optimal CNS recovery. 98% Adherence. Ready for tactical volume escalation.";
    
    const timer = setTimeout(() => setSystemInsight(insights), 2000);
    
    if (isCoach) {
      getDailyCoachBriefing({ unitIntegrity: 94, deviations: 3, pendingChecks: 12 }).then(setBriefing);
    }

    return () => clearTimeout(timer);
  }, [isCoach]);

  const coachStats = [
    { label: 'Integrity Index', value: '94.2', sub: 'Target: 95.0', color: 'text-red-500' },
    { label: 'Active Subjects', value: '18', sub: 'Unit Capacity: 85%', color: 'text-white' },
    { label: 'Pending Audits', value: '3', sub: 'Critical Biologicals', color: 'text-blue-500' },
    { label: 'Growth Velocity', value: '12%', sub: 'Month-over-Month', color: 'text-green-500' },
  ];

  const clientStats = [
    { label: 'Integrity Score', value: '98%', sub: 'Protocol Adherence', color: 'text-red-500' },
    { label: 'HRV Baseline', value: '82ms', sub: 'CNS Status: Optimal', color: 'text-blue-500' },
    { label: 'Metabolic Flux', value: '2.4', sub: 'Stable Efficiency', color: 'text-green-500' },
    { label: 'Prep Status', value: 'D-84', sub: 'Phase: Hardening', color: 'text-white' },
  ];

  const currentStats = isCoach ? coachStats : clientStats;

  return (
    <div className="space-y-8 p-8 animate-in fade-in duration-700 relative h-full">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">
              {isCoach ? 'COMMAND CENTER' : 'ATHLETE INTERFACE'}
            </h2>
            <div className="px-2 py-0.5 bg-red-600/10 border border-red-600/30 rounded text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">
              ELITE CORE v3.27
            </div>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            {isCoach ? 'Unit Synchronization: Delta / Gamma / Epsilon' : 'Tactical Roadmap: Phase II Intensification'}
          </p>
        </div>
        <div className="flex gap-2">
           {['OVERVIEW', 'BIOMETRICS', 'PROTOCOLS'].map(v => (
             <button 
              key={v}
              onClick={() => setActiveView(v as any)}
              className={`px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest border transition-all ${activeView === v ? 'bg-red-600 border-red-500 text-white' : 'glass border-gray-800 text-gray-500'}`}
             >
               {v}
             </button>
           ))}
        </div>
      </div>

      <div className="glass bg-red-600/5 border border-red-900/30 p-4 rounded-xl flex items-center gap-4 relative z-10 animate-in slide-in-from-top-4 duration-500">
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
          <i className="fas fa-microchip text-white text-sm"></i>
        </div>
        <p className="text-[11px] font-mono text-red-400 font-bold leading-relaxed italic flex-1">
          {systemInsight}
        </p>
        <button className="text-[10px] font-black uppercase text-red-500 hover:text-white transition-colors">Protocol Feed</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {currentStats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-gray-800 hover:border-red-600/30 transition-all group relative overflow-hidden">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-4xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 italic">{stat.sub}</p>
            <div className="mt-4 flex gap-1 h-1 items-end">
              {[...Array(10)].map((_, j) => (
                <div key={j} className={`flex-1 rounded-full ${j < 7 ? 'bg-red-600' : 'bg-gray-800'}`} style={{ height: `${Math.random() * 100}%` }}></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 space-y-8">
           {isCoach && briefing && (
             <div className="glass p-8 rounded-[2rem] border-l-4 border-l-red-600 border border-gray-800 animate-in slide-in-from-left duration-500">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-black italic uppercase tracking-tighter text-red-500 text-xl">High-Priority Directives</h3>
                 <span className="text-[8px] font-black text-gray-500 uppercase">Neural Synthesis Complete</span>
               </div>
               <div className="space-y-4">
                 {briefing.highPriorityTasks?.map((task: any, idx: number) => (
                   <div key={idx} className="flex gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-800 group hover:border-red-600 transition-all">
                      <div className="w-8 h-8 rounded bg-red-600/10 flex items-center justify-center text-red-500 font-black text-xs">{idx + 1}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-black uppercase tracking-widest">{task.title}</p>
                          <span className="text-[10px] font-black text-red-600">{task.urgency}</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Subject: {task.athlete} • {task.action}</p>
                      </div>
                   </div>
                 ))}
               </div>
               <div className="mt-6 p-4 bg-blue-600/5 border border-blue-900/20 rounded-xl">
                  <p className="text-[10px] font-black uppercase text-blue-500 mb-1">Strategic Insight</p>
                  <p className="text-xs text-gray-400 italic font-bold">"{briefing.strategicInsight}"</p>
               </div>
             </div>
           )}

           <div className="glass rounded-[2rem] border border-gray-800 p-8 h-80 relative overflow-hidden">
             <div className="flex justify-between items-center mb-10">
                <h3 className="font-black italic uppercase tracking-tighter text-xl">Integrity Heatmap</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_10px_#dc2626]"></span>
                    <span className="text-[9px] font-black uppercase text-gray-500">Biological Stress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_#2563eb]"></span>
                    <span className="text-[9px] font-black uppercase text-gray-500">Integrity Score</span>
                  </div>
                </div>
             </div>
             <div className="h-40 flex items-end gap-2">
                {[70, 45, 80, 50, 95, 30, 85, 92, 40, 75, 60, 100].map((v, i) => (
                  <div key={i} className="flex-1 group relative">
                    <div className={`w-full rounded-t transition-all duration-700 ${v > 80 ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'bg-gray-800'}`} style={{ height: `${v}%` }}></div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-gray-600 uppercase">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                  </div>
                ))}
             </div>
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="glass p-6 rounded-2xl border border-gray-800">
                <h4 className="text-[10px] font-black uppercase italic text-gray-500 mb-6">Phase Roadmap</h4>
                <div className="space-y-3">
                   {['Accumulation Phase', 'Intensification Phase', 'Peaking Protocol'].map((p, i) => (
                     <div key={i} className="flex justify-between items-center p-3 bg-gray-900/50 rounded-xl border border-gray-800">
                        <span className="text-[10px] font-black uppercase">{p}</span>
                        <i className={`fas ${i === 1 ? 'fa-circle-play text-red-500' : i === 0 ? 'fa-circle-check text-green-500' : 'fa-lock text-gray-700'}`}></i>
                     </div>
                   ))}
                </div>
              </div>
              <div className="glass p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-red-600/30 flex items-center justify-center animate-spin-slow">
                   <i className="fas fa-fingerprint text-red-600 text-2xl"></i>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-gray-500">Protocol Integrity</p>
                   <p className="text-xl font-black italic">OPTIMAL</p>
                </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           {!isCoach && <ProtocolTracker />}
           <div className="glass p-8 rounded-[2rem] border border-gray-800">
             <h3 className="text-xs font-black uppercase text-gray-500 mb-6 tracking-widest">Immediate Actions</h3>
             <div className="space-y-4">
                {(isCoach ? [
                  { t: 'Audit Subject 02', s: 'Stress Deviation', i: 'fa-vial' },
                  { t: 'Refeed Unit Delta', s: 'Metabolic Dip', i: 'fa-utensils' },
                  { t: 'Expand Capacity', s: 'Lead Velocity +20%', i: 'fa-users' }
                ] : [
                  { t: 'Morning Weight', s: 'Sync Required', i: 'fa-weight-scale' },
                  { t: 'Cardio Protocol', s: '45m LISS @ 125bpm', i: 'fa-person-running' },
                  { t: 'Sleep Audit', s: 'Submit Oura Data', i: 'fa-moon' }
                ]).map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 glass rounded-xl border border-gray-800 hover:border-red-600 transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded bg-gray-950 flex items-center justify-center text-red-600 border border-gray-800 group-hover:bg-red-600 group-hover:text-white transition-all">
                      <i className={`fas ${a.i}`}></i>
                    </div>
                    <div>
                       <p className="text-[11px] font-black uppercase">{a.t}</p>
                       <p className="text-[9px] font-bold text-gray-500 uppercase">{a.s}</p>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
