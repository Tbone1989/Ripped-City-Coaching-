
import React, { useState, useEffect } from 'react';
import { getDailyCoachBriefing, protocolEvents } from '../geminiService';
import { TeamAthlete, AthleticDiscipline } from '../types';

const CoachDashboard: React.FC = () => {
  const [systemInsight, setSystemInsight] = useState("Initializing protocol link... Analyzing biological integrity.");
  const [briefing, setBriefing] = useState<any>(null);
  const [selectedAthlete, setSelectedAthlete] = useState<TeamAthlete | null>(null);

  const [clients, setClients] = useState<TeamAthlete[]>([
    { 
      id: '1', name: 'Marcus V.', discipline: 'BODYBUILDING', tier: 'ELITE', adherence: 92, status: 'OPTIMAL', lastCheckin: '2h ago', criticalMetric: 'Macros',
      currentProtocol: { kcal: 2800, p: 250, c: 300, f: 60, supps: ['Whey Iso', 'Creatine', 'Omega-3'] }
    },
    { 
      id: '2', name: 'Sara K.', discipline: 'ENDURANCE', tier: 'INTERMEDIATE', adherence: 65, status: 'CRITICAL', lastCheckin: '2d ago', criticalMetric: 'Integrity',
      currentProtocol: { kcal: 1800, p: 140, c: 200, f: 50, supps: ['BCAAs', 'Electrolytes'] }
    },
  ]);

  useEffect(() => {
    getDailyCoachBriefing({ unitIntegrity: 94, deviations: 3, pendingChecks: 12 }).then(setBriefing);
    const timer = setTimeout(() => setSystemInsight("Sara K. adherence deviation detected. Caloric deficit may be too aggressive for current CNS state."), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateMacros = (field: 'kcal' | 'p' | 'c' | 'f', value: number) => {
    if (!selectedAthlete) return;
    
    protocolEvents.emit({
      type: 'UPDATE_MACROS',
      subject: selectedAthlete.name,
      details: `Adjusted ${field} to ${value}. Previous: ${selectedAthlete.currentProtocol?.[field]}`,
      timestamp: new Date().toLocaleTimeString()
    });

    setClients(prev => prev.map(c => 
      c.id === selectedAthlete.id 
        ? { ...c, currentProtocol: { ...c.currentProtocol!, [field]: value } } 
        : c
    ));
    setSelectedAthlete(prev => prev ? { ...prev, currentProtocol: { ...prev.currentProtocol!, [field]: value } } : null);
  };

  return (
    <div className="space-y-8 p-8 animate-in fade-in duration-700 relative h-full">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-1">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">COMMAND CENTER</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Master Architect Interface v3.27</p>
        </div>
        <div className="flex gap-4">
           {['Integrity: 94%', 'Units: 18', 'Uptime: 99.9%'].map(stat => (
             <div key={stat} className="px-4 py-2 glass border border-gray-800 rounded-lg text-[9px] font-black uppercase text-gray-400">
               {stat}
             </div>
           ))}
        </div>
      </div>

      <div className="glass bg-red-600/5 border border-red-900/30 p-4 rounded-xl flex items-center gap-4 relative z-10">
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
          <i className="fas fa-microchip text-white text-sm"></i>
        </div>
        <p className="text-[11px] font-mono text-red-400 font-bold leading-relaxed italic flex-1">{systemInsight}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        {/* Client Roster Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center mb-2 px-2">
            <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Biological Units</h3>
            <span className="text-[10px] font-black text-red-500">Live Handshake</span>
          </div>
          <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto pr-2 custom-scrollbar">
            {clients.map(client => (
              <div 
                key={client.id}
                onClick={() => {
                  setSelectedAthlete(client);
                  protocolEvents.emit({ type: 'VIEW_STATS', subject: client.name, details: 'Opening deep biological dossier.', timestamp: new Date().toLocaleTimeString() });
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
                  selectedAthlete?.id === client.id ? 'bg-red-600/10 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.1)]' : 'bg-gray-950 border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black italic uppercase text-white tracking-tight">{client.name}</h4>
                    <p className="text-[9px] text-gray-500 font-bold uppercase">{client.discipline} • {client.tier}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black ${client.status === 'OPTIMAL' ? 'text-green-500' : 'text-red-500'}`}>{client.adherence}%</span>
                    <p className="text-[7px] text-gray-600 font-black uppercase">Adherence</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protocol Forge Main */}
        <div className="lg:col-span-3 space-y-6">
          {selectedAthlete ? (
            <div className="glass p-8 rounded-[2.5rem] border border-gray-800 animate-in slide-in-from-right duration-500">
               <div className="flex justify-between items-start border-b border-gray-800 pb-6 mb-8">
                 <div>
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Protocol Forge</span>
                    <h3 className="text-5xl font-black italic uppercase text-white tracking-tighter">{selectedAthlete.name}</h3>
                 </div>
                 <div className="flex gap-4">
                    <button className="px-6 py-3 glass border border-gray-800 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:text-white transition-all">
                      <i className="fas fa-file-medical mr-2"></i> Clinical Archive
                    </button>
                    <button className="px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-red-600/20">
                      Push Protocol
                    </button>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {/* Column 1: Nutrition */}
                 <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-widest flex items-center gap-2">
                        <i className="fas fa-utensils text-red-500"></i> Nutrition
                      </h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                           <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Daily Kcal</p>
                           <input 
                              type="number" 
                              value={selectedAthlete.currentProtocol?.kcal} 
                              onChange={(e) => handleUpdateMacros('kcal', parseInt(e.target.value))}
                              className="w-full bg-transparent text-2xl font-black text-white outline-none focus:text-red-500 transition-colors"
                           />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                           {['p', 'c', 'f'].map(macro => (
                             <div key={macro} className="p-3 bg-gray-900 rounded-xl border border-gray-800 text-center">
                               <p className="text-[8px] font-black text-gray-500 uppercase mb-1">{macro.toUpperCase()} (G)</p>
                               <input 
                                  type="number"
                                  value={(selectedAthlete.currentProtocol as any)[macro]}
                                  onChange={(e) => handleUpdateMacros(macro as any, parseInt(e.target.value))}
                                  className="w-full bg-transparent text-sm font-black text-white text-center outline-none"
                               />
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-widest flex items-center gap-2">
                        <i className="fas fa-flask text-blue-500"></i> Active Stack
                      </h4>
                      <div className="space-y-2">
                        {selectedAthlete.currentProtocol?.supps.map(s => (
                          <div key={s} className="flex justify-between p-4 bg-gray-950 border border-gray-900 rounded-xl group hover:border-blue-900/50 transition-all">
                            <span className="text-[10px] font-bold text-gray-300 uppercase">{s}</span>
                            <button className="text-gray-700 hover:text-red-500 transition-colors"><i className="fas fa-trash-alt text-[10px]"></i></button>
                          </div>
                        ))}
                        <button 
                          onClick={() => protocolEvents.emit({ type: 'ADD_NOTE', subject: selectedAthlete.name, details: 'Initiated substance provision wizard.', timestamp: new Date().toLocaleTimeString() })}
                          className="w-full py-4 border border-dashed border-gray-800 rounded-xl text-[9px] font-black uppercase text-gray-600 hover:text-blue-500 hover:border-blue-900/50 transition-all"
                        >
                          Provision New Substance
                        </button>
                      </div>
                    </div>
                 </div>

                 {/* Column 2: Kinetic & Progress */}
                 <div className="space-y-8 md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <h4 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-widest flex items-center gap-2">
                            <i className="fas fa-chart-line text-green-500"></i> Biological Trends
                          </h4>
                          <div className="glass p-6 rounded-2xl border border-gray-800 h-48 relative overflow-hidden flex flex-col justify-end">
                             <div className="flex justify-between items-center mb-auto">
                                <p className="text-[10px] font-black text-gray-500 uppercase">Weight Velocity</p>
                                <p className="text-lg font-black text-white">-1.2kg <span className="text-[8px] text-gray-600 uppercase">/ Week</span></p>
                             </div>
                             <div className="h-20 flex items-end gap-1">
                                {[40, 55, 45, 70, 60, 85, 75, 90, 80, 100].map((v, i) => (
                                  <div key={i} className="flex-1 bg-green-500/20 rounded-t-sm group relative">
                                     <div className="w-full bg-green-500 absolute bottom-0 rounded-t-sm transition-all duration-1000" style={{ height: `${v}%` }}></div>
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <h4 className="text-xs font-black uppercase text-gray-400 mb-6 tracking-widest flex items-center gap-2">
                            <i className="fas fa-dumbbell text-yellow-500"></i> Kinetic Block
                          </h4>
                          <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 space-y-4">
                             <div className="flex justify-between items-center">
                                <p className="text-xs font-black text-white uppercase italic">Phase II: Intensification</p>
                                <span className="text-[8px] font-black text-gray-600 uppercase">Day 14 / 28</span>
                             </div>
                             <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 w-1/2 shadow-[0_0_10px_rgba(234,179,8,0.3)]"></div>
                             </div>
                             <p className="text-[9px] text-gray-500 font-bold uppercase leading-relaxed">Focus: Mechanical tension and eccentric control. Volume scaling active.</p>
                             <button className="w-full mt-2 py-3 bg-white text-black font-black uppercase text-[9px] rounded-xl hover:bg-yellow-500 hover:text-white transition-all">Edit Training Roadmap</button>
                          </div>
                       </div>
                    </div>

                    <div className="p-6 bg-red-600/5 border border-red-900/30 rounded-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5">
                          <i className="fas fa-brain-circuit text-6xl"></i>
                       </div>
                       <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3">Architect Contextual Notes</h4>
                       <textarea 
                        className="w-full bg-transparent border-none outline-none text-xs text-gray-300 italic font-bold h-32 resize-none leading-relaxed"
                        placeholder="Log behavioral observations, clinical deviations, or protocol feedback..."
                        onChange={(e) => {
                          if (e.target.value.length % 50 === 0) {
                            protocolEvents.emit({ type: 'ADD_NOTE', subject: selectedAthlete.name, details: 'Updating clinical field notes.', timestamp: new Date().toLocaleTimeString() });
                          }
                        }}
                       ></textarea>
                    </div>
                 </div>
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center glass rounded-[3rem] border border-gray-800 border-dashed opacity-30">
              <i className="fas fa-dna text-9xl mb-8 text-gray-800"></i>
              <h3 className="text-3xl font-black italic uppercase tracking-widest">Select Tactical Unit</h3>
              <p className="max-w-md text-sm font-bold uppercase mt-6 leading-relaxed tracking-[0.2em]"> Establish bi-directional biological link <br /> to commence protocol synthesis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachDashboard;
