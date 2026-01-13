
import React, { useState } from 'react';
import { CycleData } from '../types';

const FemaleSuite: React.FC = () => {
  const [isMenopausal, setIsMenopausal] = useState(false);
  const [cycle, setCycle] = useState<CycleData>({
    lastPeriodDate: '2023-11-20',
    cycleLength: 28,
    phase: 'FOLLICULAR',
    symptoms: ['Mild Fatigue', 'Strength Peak']
  });

  const phases = [
    { name: 'MENSTRUAL', color: 'bg-red-600', range: 'Day 1-5' },
    { name: 'FOLLICULAR', color: 'bg-purple-600', range: 'Day 6-12' },
    { name: 'OVULATORY', color: 'bg-pink-500', range: 'Day 13-15' },
    { name: 'LUTEAL', color: 'bg-orange-500', range: 'Day 16-28' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Biological Sync</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Hormonal Phase Integration</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsMenopausal(!isMenopausal)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              isMenopausal ? 'bg-purple-600 border-purple-500 text-white' : 'glass border-gray-800 text-gray-500'
            }`}
          >
            {isMenopausal ? 'Post-Menopausal Mode' : 'Switch to Menopause Track'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cycle Visualizer */}
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-gray-800 relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest">Active Cycle Mapping</h3>
            <div className="text-right">
              <p className="text-2xl font-black italic text-purple-500">DAY 9</p>
              <p className="text-[10px] font-bold text-gray-600 uppercase">Late Follicular Phase</p>
            </div>
          </div>

          <div className="relative h-64 flex items-center justify-center">
            {/* Large Circular Progress for Cycle */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-48 h-48 rounded-full border-[20px] border-purple-600"></div>
            </div>
            
            <div className="grid grid-cols-4 gap-4 w-full h-full relative z-10">
              {phases.map(p => (
                <div key={p.name} className={`rounded-3xl p-6 flex flex-col justify-between border ${
                  cycle.phase === p.name ? 'bg-purple-600/10 border-purple-500' : 'bg-gray-950 border-gray-800 opacity-40'
                }`}>
                  <span className="text-[10px] font-black uppercase text-gray-500">{p.range}</span>
                  <div>
                    <h4 className="font-black italic text-lg uppercase leading-none">{p.name}</h4>
                    {cycle.phase === p.name && (
                      <div className="mt-2 flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                        <span className="text-[8px] font-black text-purple-500 uppercase">Current Phase</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 bg-purple-600/5 border border-purple-900/30 rounded-2xl">
            <h4 className="text-[10px] font-black uppercase text-purple-500 mb-2">Zephyr Training Insight</h4>
            <p className="text-xs font-bold text-gray-300 italic leading-relaxed">
              "Estrogen is peaking. Insulin sensitivity is high. This is your primary strength window. Push intensity on compound lifts. Nutrition protocol: 10% increase in glycogen-retaining carbohydrates today."
            </p>
          </div>
        </div>

        {/* Symptoms & Vitals */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-xs font-black uppercase text-gray-500 mb-6 tracking-widest">Symptom Log</h3>
            <div className="space-y-3">
              {['Energy Level', 'Strength Output', 'Recovery Speed', 'Water Retention'].map(metric => (
                <div key={metric} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
                    <span>{metric}</span>
                    <span>High</span>
                  </div>
                  <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600" style={{ width: '85%' }}></div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-gray-950 border border-gray-800 rounded-2xl text-[10px] font-black uppercase text-gray-400 hover:text-white transition-all">
              Update Daily Symptoms
            </button>
          </div>

          {isMenopausal && (
            <div className="glass p-8 rounded-[2.5rem] border border-purple-900/30 bg-gradient-to-br from-purple-600/10 to-transparent">
              <h3 className="text-xs font-black uppercase text-purple-500 mb-4 tracking-widest">HRT / Menopause Support</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-gray-800">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-500">
                    <i className="fas fa-snowflake"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-200">Hot Flash Incidence</p>
                    <p className="text-[9px] text-gray-500 uppercase">Low - Frequency decreasing</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-gray-800">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-500">
                    <i className="fas fa-bone"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-200">Bone Density Proxy</p>
                    <p className="text-[9px] text-gray-500 uppercase">Markers Stable</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FemaleSuite;
