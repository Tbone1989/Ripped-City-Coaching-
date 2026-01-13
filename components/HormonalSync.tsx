
import React, { useState } from 'react';
import { BiologicalSex, HormonalData } from '../types';

const HormonalSync: React.FC = () => {
  const [sex, setSex] = useState<BiologicalSex>(BiologicalSex.MALE);
  const [data, setData] = useState<HormonalData>({
    sex: BiologicalSex.MALE,
    androgenStatus: 'OPTIMAL',
    estrogenStatus: 'OPTIMAL',
    symptoms: ['High Libido', 'Optimal Recovery'],
    lastMarkerUpdate: '2023-11-25'
  });

  const [femaleData, setFemaleData] = useState<HormonalData>({
    sex: BiologicalSex.FEMALE,
    phase: 'FOLLICULAR',
    estrogenStatus: 'OPTIMAL',
    symptoms: ['Strength Peak', 'Clear Skin'],
    lastMarkerUpdate: '2023-11-20'
  });

  const renderMaleHUD = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2.5rem] border border-gray-800 relative overflow-hidden">
          <h3 className="text-xs font-black uppercase text-gray-500 mb-8 tracking-widest">Androgen Profile</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black text-gray-600 uppercase">Total Testosterone</p>
                <p className="text-3xl font-black text-white">1142 <span className="text-sm font-normal text-gray-500">ng/dL</span></p>
              </div>
              <span className="text-[10px] font-black uppercase text-green-500 bg-green-600/10 px-2 py-1 rounded border border-green-600/30">SUPRA-PHYSIOLOGICAL</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black text-gray-600 uppercase">Free Testosterone</p>
                <p className="text-3xl font-black text-white">28.4 <span className="text-sm font-normal text-gray-500">pg/mL</span></p>
              </div>
              <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-600/10 px-2 py-1 rounded border border-blue-600/30">OPTIMAL FLUX</span>
            </div>
          </div>
          <div className="mt-10 p-4 bg-red-600/5 border border-red-900/30 rounded-xl">
            <p className="text-[10px] font-black uppercase text-red-500 mb-1">Architect Directive</p>
            <p className="text-xs text-gray-400 italic">"Androgen-to-Estrogen ratio is currently 42:1. Optimal for hardening phase. Monitor hematocrit levels."</p>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
          <h3 className="text-xs font-black uppercase text-gray-500 mb-8 tracking-widest">Ancillary Bio-Feedback</h3>
          <div className="space-y-4">
             {['SHBG', 'Prolactin', 'Estradiol (E2)', 'PSA'].map((marker, i) => (
               <div key={marker} className="flex justify-between items-center p-3 bg-gray-950 border border-gray-900 rounded-xl">
                 <span className="text-[10px] font-black text-gray-500 uppercase">{marker}</span>
                 <span className="text-xs font-black text-gray-200">{15 + i * 10} {i === 2 ? 'pg/mL' : 'nmol/L'}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFemaleHUD = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-gray-800 relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest">Cycle Mapping</h3>
            <div className="text-right">
              <p className="text-2xl font-black italic text-purple-500 uppercase">{femaleData.phase}</p>
              <p className="text-[10px] font-bold text-gray-600 uppercase">Day 9 - Late Follicular</p>
            </div>
          </div>

          <div className="relative h-64 flex items-center justify-center">
            <div className="grid grid-cols-4 gap-4 w-full h-full relative z-10">
              {['MENSTRUAL', 'FOLLICULAR', 'OVULATORY', 'LUTEAL'].map(p => (
                <div key={p} className={`rounded-3xl p-6 flex flex-col justify-between border ${
                  femaleData.phase === p ? 'bg-purple-600/10 border-purple-500' : 'bg-gray-950 border-gray-800 opacity-40'
                }`}>
                  <span className="text-[10px] font-black uppercase text-gray-500">Day {p === 'MENSTRUAL' ? '1-5' : p === 'FOLLICULAR' ? '6-12' : p === 'OVULATORY' ? '13-15' : '16-28'}</span>
                  <h4 className="font-black italic text-lg uppercase leading-none">{p}</h4>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-6 bg-purple-600/5 border border-purple-900/30 rounded-2xl">
            <h4 className="text-[10px] font-black uppercase text-purple-500 mb-2">Hormonal Strategy</h4>
            <p className="text-xs font-bold text-gray-300 italic leading-relaxed">
              "Estrogen is peaking. Push volume. Insulin sensitivity is maximized. Carbohydrate tolerance is high."
            </p>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
          <h3 className="text-xs font-black uppercase text-gray-500 mb-8 tracking-widest">Symptom Tracking</h3>
          <div className="space-y-4">
             {['Strength Level', 'Bloating', 'Mood Stability'].map(s => (
               <div key={s} className="space-y-2">
                 <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
                   <span>{s}</span>
                   <span>High</span>
                 </div>
                 <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                   <div className="h-full bg-purple-600" style={{ width: '90%' }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Biological Sync</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Hormonal Profile & Phase Optimization</p>
        </div>
        <div className="flex p-1 bg-gray-900 border border-gray-800 rounded-2xl">
          <button 
            onClick={() => setSex(BiologicalSex.MALE)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${sex === BiologicalSex.MALE ? 'bg-red-600 text-white' : 'text-gray-500'}`}
          >
            MALE HUD
          </button>
          <button 
            onClick={() => setSex(BiologicalSex.FEMALE)}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${sex === BiologicalSex.FEMALE ? 'bg-purple-600 text-white' : 'text-gray-500'}`}
          >
            FEMALE HUD
          </button>
        </div>
      </div>

      {sex === BiologicalSex.MALE ? renderMaleHUD() : renderFemaleHUD()}
    </div>
  );
};

export default HormonalSync;
