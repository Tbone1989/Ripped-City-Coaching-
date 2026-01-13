
import React, { useState } from 'react';
import { analyzeBodyScan } from '../geminiService';
import { BodyScanMetrics, ExperienceTier } from '../types';

const BodyScannerHub: React.FC<{ tier: ExperienceTier }> = ({ tier }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [scans, setScans] = useState<BodyScanMetrics[]>([
    { 
      date: '2023-11-20', weight: 98.4, skeletalMuscleMass: 48.2, bodyFatPercent: 8.2, bmr: 2450, ecwRatio: 0.380,
      analysis: 'Extracellular water is stabilizing. Skeletal muscle mass is trending upward while body fat percent remains in the elite stage-prep range.'
    },
    { 
      date: '2023-10-15', weight: 102.1, skeletalMuscleMass: 47.5, bodyFatPercent: 12.4, bmr: 2380, ecwRatio: 0.392 
    }
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      try {
        const data = await analyzeBodyScan(base64String, tier, file.type || 'image/jpeg');
        const newScan: BodyScanMetrics = {
          ...data,
          date: new Date().toISOString().split('T')[0]
        };
        setScans([newScan, ...scans]);
      } catch (err) {
        console.error(err);
        alert("OCR failed to extract metrics. Ensure lighting is optimal on the InBody report.");
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const latest = scans[0];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Bio-Impedance Sync Hub</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">InBody & DXA Biological Reconciliation</p>
        </div>
        <div className="relative">
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            onChange={handleFileUpload}
            accept="image/*"
            disabled={analyzing}
          />
          <button className={`px-8 py-4 bg-red-600 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-xl shadow-red-600/20 flex items-center gap-3 ${analyzing ? 'opacity-50' : 'hover:bg-red-700'}`}>
            {analyzing ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-file-export"></i>}
            Sync Scan Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          { label: 'Skeletal Muscle Mass', value: latest.skeletalMuscleMass + 'kg', sub: 'Target: Gain 0.5kg/mo', icon: 'fa-dumbbell', color: 'text-red-500' },
          { label: 'Percent Body Fat', value: latest.bodyFatPercent + '%', sub: 'Phase: Hardening', icon: 'fa-fire-flame-curved', color: 'text-blue-500' },
          { label: 'ECW Ratio', value: latest.ecwRatio, sub: 'Status: ' + (latest.ecwRatio > 0.39 ? 'Inflamed' : 'Dry'), icon: 'fa-droplet', color: 'text-white' },
          { label: 'BMR Intensity', value: latest.bmr + ' kcal', sub: 'Metabolic Ceiling', icon: 'fa-bolt', color: 'text-yellow-500' },
        ].map((m, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-gray-800 group hover:border-red-600/30 transition-all">
             <div className="flex justify-between items-center mb-4">
               <i className={`fas ${m.icon} ${m.color}`}></i>
               <span className="text-[8px] font-black uppercase text-gray-600">Metric Link</span>
             </div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{m.label}</p>
             <p className={`text-3xl font-black ${m.color}`}>{m.value}</p>
             <p className="text-[9px] font-bold text-gray-500 uppercase mt-2 italic">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border border-gray-800">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest">Composition Trends (SMM vs PBF)</h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-red-600"></span>
                   <span className="text-[9px] font-black text-gray-500 uppercase">Muscle</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                   <span className="text-[9px] font-black text-gray-500 uppercase">Fat %</span>
                 </div>
              </div>
           </div>
           <div className="h-64 flex items-end gap-3 px-4">
              {[70, 75, 72, 80, 85, 82, 88, 92, 90, 95].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                   <div className="w-full bg-red-600/10 group-hover:bg-red-600 transition-all rounded-t-sm" style={{ height: `${v}%` }}></div>
                   <div className="w-full bg-blue-600/10 group-hover:bg-blue-600 transition-all rounded-t-sm" style={{ height: `${100-v}%` }}></div>
                </div>
              ))}
           </div>
           <div className="mt-6 flex justify-between px-4">
              {['JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV'].map(m => (
                <span key={m} className="text-[8px] font-black text-gray-600 uppercase">{m}</span>
              ))}
           </div>
        </div>

        <div className="space-y-6">
           <div className="glass p-8 rounded-[2.5rem] border-l-4 border-l-red-600 border border-gray-800 bg-red-600/5">
              <h3 className="text-xs font-black uppercase text-red-500 mb-6 tracking-widest flex items-center gap-2">
                <i className="fas fa-brain-circuit"></i> Architect Composition Audit
              </h3>
              <p className="text-sm font-bold text-gray-300 leading-relaxed italic">
                "{latest.analysis || "Input report metadata to trigger structural integrity audit."}"
              </p>
              {tier === 'PRO' && latest.ecwRatio > 0.39 && (
                <div className="mt-6 p-4 bg-red-600 text-white rounded-xl">
                   <p className="text-[10px] font-black uppercase tracking-widest mb-1">CRITICAL DRIFT ALERT</p>
                   <p className="text-xs font-black italic">"Water retention (ECW Ratio {latest.ecwRatio}) is sabotaging your stage definition. Sodium protocol failed. Adjust potassium-to-sodium ratio immediately."</p>
                </div>
              )}
           </div>

           <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
              <h3 className="text-xs font-black uppercase text-gray-500 mb-6 tracking-widest">Protocol Adjustment Sync</h3>
              <div className="space-y-4">
                 <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Training Volume</span>
                    <span className="text-[10px] font-black text-green-500 uppercase">+15% Scaled</span>
                 </div>
                 <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Carb Refeed</span>
                    <span className="text-[10px] font-black text-red-500 uppercase">Suspended</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BodyScannerHub;
