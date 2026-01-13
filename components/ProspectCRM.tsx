
import React, { useState } from 'react';
import { Prospect } from '../types';

const ProspectCRM: React.FC = () => {
  const [prospects] = useState<Prospect[]>([
    { id: '1', name: 'Alexander T.', email: 'alex@fitmail.com', status: 'NEW', goal: 'Classic Physique Prep', timestamp: '2h ago' },
    { id: '2', name: 'Jessica M.', email: 'jess@power.io', status: 'CONTACTED', goal: 'Wellness Division Build', timestamp: '5h ago' },
    { id: '3', name: 'Robert S.', email: 'rob.strong@web.com', status: 'QUALIFIED', goal: 'Rehab from Labrum Tear', timestamp: '1d ago' },
    { id: '4', name: 'Sarah L.', email: 'sarah.fit@net.com', status: 'ONBOARDING', goal: 'Lifestyle Transformation', timestamp: '3d ago' },
  ]);

  const handleSchedule = (name: string) => {
    alert(`Provisioning Strategy Slot for ${name}... Redirecting to Temporal Matrix.`);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Prospect Hub</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Lead Capture & Conversion Intelligence</p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-8 py-4 rounded-2xl border border-gray-800 text-center shadow-xl">
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Growth Velocity</p>
             <p className="text-3xl font-black text-green-500 italic">14.2%</p>
          </div>
          <button className="px-8 py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-2xl shadow-red-600/30 flex items-center gap-3">
            <i className="fas fa-file-export"></i> Export Intelligence
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {['NEW', 'CONTACTED', 'QUALIFIED', 'ONBOARDING'].map(status => (
          <div key={status} className="space-y-6">
            <div className="flex justify-between items-center px-5 py-3 bg-gray-950 border border-gray-900 rounded-xl">
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">{status}</span>
              <span className="text-[10px] font-black text-red-500 bg-red-600/10 px-2 py-0.5 rounded-full">{prospects.filter(p => p.status === status).length}</span>
            </div>
            <div className="space-y-4">
              {prospects.filter(p => p.status === status).map(p => (
                <div key={p.id} className="glass p-6 rounded-[2rem] border border-gray-800 hover:border-red-600/40 transition-all group cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-3xl group-hover:bg-red-600/10 transition-all"></div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-black italic uppercase text-sm tracking-tight text-white group-hover:text-red-500 transition-colors">{p.name}</h4>
                    <span className="text-[8px] font-black text-gray-600 uppercase">{p.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold truncate mb-6 leading-relaxed">"{p.goal}"</p>
                  
                  <div className="flex gap-2 pt-4 border-t border-gray-800/50">
                    <button 
                      onClick={() => handleSchedule(p.name)}
                      className="flex-1 py-2 bg-gray-900 border border-gray-800 rounded-lg text-[8px] font-black uppercase text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                    >
                      Provision Call
                    </button>
                    <button className="w-10 h-8 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-all">
                      <i className="fas fa-ellipsis-h text-[10px]"></i>
                    </button>
                  </div>
                </div>
              ))}
              {prospects.filter(p => p.status === status).length === 0 && (
                <div className="h-32 rounded-[2rem] border-2 border-dashed border-gray-900 flex items-center justify-center opacity-20">
                  <span className="text-[10px] font-black uppercase tracking-widest">Slot Standby</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProspectCRM;
