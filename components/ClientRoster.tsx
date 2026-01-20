
import React, { useState, useEffect } from 'react';
import { TeamAthlete, UserRole, AthleticDiscipline } from '../types';
import { getAthleteBriefing } from '../geminiService';
import { getAllClients } from '../firestoreService';

const ClientRoster: React.FC = () => {
  const [selectedAthlete, setSelectedAthlete] = useState<any | null>(null);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [loadedClients, setLoadedClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load real clients from Firestore
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await getAllClients();
        setLoadedClients(clients);
        console.log('📋 Loaded clients for roster:', clients.length);
      } catch (error) {
        console.error('Error loading clients:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);
  
  // Convert client data to TeamAthlete format
  const realClients: TeamAthlete[] = loadedClients.map((client: any) => ({
    id: client.id,
    name: client.fullName || 'Unknown',
    discipline: 'BODYBUILDING' as AthleticDiscipline,
    tier: client.experience?.includes('Advanced') ? 'ADVANCED' : client.experience?.includes('Intermediate') ? 'INTERMEDIATE' : 'BEGINNER',
    adherence: 85,
    status: 'OPTIMAL',
    lastCheckin: 'New',
    criticalMetric: 'Onboarding',
    performanceMetrics: {
      'Age': client.age || 'N/A',
      'Weight': client.weight ? `${client.weight}lbs` : 'N/A',
      'Height': client.height || 'N/A',
      'Goal': client.goal || 'N/A',
      'Email': client.email || 'N/A',
      'Phone': client.phone || 'N/A'
    }
  }));

  // Demo clients (keep a few for demonstration)
  const demoClients: TeamAthlete[] = [
    { 
      id: 'demo1', name: 'Marcus V. (Demo)', discipline: 'BODYBUILDING', tier: 'ELITE', adherence: 92, status: 'OPTIMAL', lastCheckin: '2h ago', criticalMetric: 'Macros', 
      performanceMetrics: { 'Weight': '94kg', 'BF%': '8.4%', 'Stage Lean': '82%' }
    },
    { 
      id: 'demo2', name: 'Sara K. (Demo)', discipline: 'ENDURANCE', tier: 'INTERMEDIATE', adherence: 65, status: 'CRITICAL', lastCheckin: '2d ago', criticalMetric: 'Integrity',
      performanceMetrics: { 'VO2 Max': '62', 'Lactate Threshold': '168bpm', 'Resting HR': '42bpm' }
    },
  ];
  
  // Combine real clients with demo clients
  const clients: TeamAthlete[] = [...realClients, ...demoClients];

  const handleViewDossier = async (athlete: any) => {
    setSelectedAthlete(athlete);
    setBriefing(null);
    setLoadingBriefing(true);
    try {
      const summary = await getAthleteBriefing(athlete);
      setBriefing(summary || "No briefing available.");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBriefing(false);
    }
  };

  const getDisciplineIcon = (disc: AthleticDiscipline) => {
    switch(disc) {
      case 'BODYBUILDING': return 'fa-dumbbell';
      case 'ENDURANCE': return 'fa-person-running';
      case 'POWERLIFTING': return 'fa-weight-hanging';
      case 'TEAM_SPORTS': return 'fa-volleyball';
      case 'COMBAT': return 'fa-hand-fist';
      default: return 'fa-bolt';
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Tactical Roster</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Live Subject Management & Dossier Link</p>
        </div>
        <div className="flex gap-4">
           <div className="glass px-6 py-3 rounded-xl border border-gray-800">
             <p className="text-[10px] font-black text-gray-500 uppercase">Active Disciplines</p>
             <p className="text-xl font-black text-white">5 Categories</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-250px)]">
        {/* Left Side: Client List */}
        <div className="glass rounded-[2.5rem] border border-gray-800 overflow-hidden flex flex-col">
          <div className="p-6 bg-gray-900/50 border-b border-gray-800 flex justify-between items-center">
            <span className="text-xs font-black uppercase text-gray-500 tracking-widest italic">Active Subjects</span>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {clients.map(client => (
              <div 
                key={client.id}
                onClick={() => handleViewDossier(client)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between ${
                  selectedAthlete?.id === client.id 
                    ? 'bg-red-600/10 border-red-600/50 scale-[1.02]' 
                    : 'bg-gray-950 border-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-full bg-gray-900 border-2 flex items-center justify-center text-lg ${
                    client.status === 'OPTIMAL' ? 'border-green-500 text-green-500' :
                    client.status === 'DEVIATING' ? 'border-yellow-500 text-yellow-500' :
                    'border-red-600 text-red-600 shadow-[0_0_15px_#dc2626]'
                  }`}>
                    <i className={`fas ${getDisciplineIcon(client.discipline)}`}></i>
                  </div>
                  <div>
                    <h4 className="font-black italic uppercase text-lg text-white group-hover:text-red-500 transition-colors">{client.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{client.discipline.replace('_',' ')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-black italic ${client.adherence < 80 ? 'text-red-600' : 'text-white'}`}>{client.adherence}%</p>
                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">ADHERENCE</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Dossier View */}
        <div className="glass rounded-[2.5rem] border border-gray-800 overflow-hidden flex flex-col relative">
          {selectedAthlete ? (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right duration-500">
               <div className="p-8 bg-gradient-to-br from-gray-900 to-black border-b border-gray-800">
                 <div className="flex justify-between items-start mb-6">
                   <div>
                     <span className="text-[10px] font-black uppercase text-red-500 tracking-[0.3em] mb-1 block">CLASSIFIED {selectedAthlete.discipline} DOSSIER</span>
                     <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white">{selectedAthlete.name}</h3>
                   </div>
                   <div className="text-right">
                     <p className="text-[9px] font-black text-gray-600 uppercase">ARCHIVE REF</p>
                     <p className="font-mono text-sm text-gray-400">ARCH-{selectedAthlete.discipline.substring(0,3)}-0{selectedAthlete.id}</p>
                   </div>
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                   {Object.entries(selectedAthlete.performanceMetrics || {}).map(([key, val]) => (
                     <div key={key} className="bg-black/40 border border-gray-800 p-4 rounded-xl text-center group hover:border-red-600/50 transition-all">
                        <p className="text-[8px] font-black text-gray-600 uppercase mb-1">{key}</p>
                        <p className="text-sm font-black text-gray-200 group-hover:text-red-500 transition-colors">{val as string}</p>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="p-8 space-y-8 flex-1 overflow-y-auto">
                 <div className="p-6 bg-red-600/5 border-l-4 border-l-red-600 border border-red-900/20 rounded-xl">
                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <i className="fas fa-brain-circuit"></i> Disciplinary Performance Briefing
                    </h4>
                    {loadingBriefing ? (
                      <p className="text-[10px] font-black uppercase text-gray-500 italic animate-pulse">Running disciplinary heuristics...</p>
                    ) : (
                      <p className="text-sm font-bold text-gray-300 leading-relaxed italic">"{briefing}"</p>
                    )}
                 </div>

                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-6 bg-gray-950 border border-gray-800 rounded-2xl space-y-4">
                       <h5 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Discipline Variable Stack</h5>
                       <div className="space-y-3">
                         {['Fatigue Resistance', 'Explosive Index', 'Metabolic Flux'].map((v, i) => (
                           <div key={i} className="space-y-1">
                             <div className="flex justify-between text-[9px] font-black uppercase">
                               <span className="text-gray-400">{v}</span>
                               <span className="text-white">{80 + i * 5}%</span>
                             </div>
                             <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                               <div className="h-full bg-red-600" style={{ width: `${80 + i * 5}%` }}></div>
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>
                    <div className="p-6 bg-gray-950 border border-gray-800 rounded-2xl flex flex-col justify-center text-center space-y-4">
                       <i className="fas fa-microchip text-3xl text-gray-700"></i>
                       <p className="text-[10px] font-black uppercase text-gray-500">Biological Drift Analysis</p>
                       <p className="text-xl font-black text-green-500 uppercase italic">STABLE</p>
                    </div>
                 </div>
               </div>

               <div className="p-6 border-t border-gray-800 bg-black/40 flex justify-between gap-4">
                  <button className="flex-1 py-3 bg-red-600 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-red-700 transition-all">Provision Advice</button>
                  <button className="flex-1 py-3 glass border border-gray-800 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-gray-800 transition-all">Full Performance Log</button>
               </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
              <i className="fas fa-users-viewfinder text-8xl mb-6"></i>
              <h3 className="text-2xl font-black italic uppercase tracking-widest">Select Subject</h3>
              <p className="max-w-md text-sm font-bold uppercase mt-2 leading-relaxed">Choose an athlete to initialize disciplinary dossiers and cross-platform biological analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientRoster;
