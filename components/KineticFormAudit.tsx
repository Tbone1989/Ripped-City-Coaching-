
import React, { useState } from 'react';
import { auditKineticForm } from '../geminiService';
import { FormAuditResult } from '../types';

const KineticFormAudit: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [exercise, setExercise] = useState('Deadlift');
  const [result, setResult] = useState<FormAuditResult | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      try {
        const data = await auditKineticForm(base64String, exercise);
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Kinetic Form Audit</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Biomechanical Correction & Injury Mitigation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-xs font-black uppercase text-gray-500 mb-6 tracking-widest">Capture Frame</h3>
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-gray-500 ml-1">Exercise Selection</label>
              <select 
                value={exercise}
                onChange={e => setExercise(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-sm font-bold outline-none focus:border-red-600 transition-all text-gray-200"
              >
                <option>Deadlift</option>
                <option>Squat</option>
                <option>Bench Press</option>
                <option>Overhead Press</option>
                <option>Barbell Row</option>
              </select>
            </div>

            <div className="relative h-64 border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center group hover:border-red-600/50 transition-colors bg-gray-950/50 mt-6 overflow-hidden">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                onChange={handleUpload}
                accept="image/*"
              />
              <i className={`fas ${analyzing ? 'fa-spinner animate-spin' : 'fa-video'} text-4xl mb-4 text-gray-600 group-hover:text-red-500`}></i>
              <p className="text-[10px] font-black uppercase text-gray-400">
                {analyzing ? 'Analyzing Mechanics...' : 'Upload Form Frame'}
              </p>
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-red-900/30 bg-red-600/5">
            <h3 className="text-xs font-black uppercase text-red-500 mb-4 tracking-widest">Specialist Context</h3>
            <p className="text-xs text-gray-400 leading-relaxed italic">
              "Optimal joint stacking and force distribution are non-negotiable. One degree of lumbar flexion can escalate systemic inflammation and truncate your peaking phase."
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 glass rounded-[2.5rem] border border-gray-800 overflow-hidden flex flex-col min-h-[600px]">
          {result ? (
            <div className="flex-1 p-10 space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-center border-b border-gray-800 pb-6">
                <h4 className="font-black italic uppercase text-2xl tracking-tighter">Diagnostic Report</h4>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-500 uppercase">Kinetic Efficiency</p>
                  <p className="text-3xl font-black text-red-600">{result.biomechanicalScore}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase text-gray-500">Deviations Identified</h5>
                  <ul className="space-y-3">
                    {result.deviations.map((dev, i) => (
                      <li key={i} className="flex gap-3 text-xs font-bold text-gray-300">
                        <span className="text-red-600"><i className="fas fa-circle-exclamation"></i></span>
                        {dev}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase text-gray-500">Specialist Corrections</h5>
                  <ul className="space-y-3">
                    {result.corrections.map((cor, i) => (
                      <li key={i} className="flex gap-3 text-xs font-bold text-green-500">
                        <span className="text-green-500"><i className="fas fa-circle-check"></i></span>
                        {cor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border flex items-center gap-6 ${
                result.injuryRisk === 'HIGH' ? 'bg-red-600/10 border-red-600/30 text-red-500' :
                result.injuryRisk === 'MODERATE' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' :
                'bg-green-600/10 border-green-600/30 text-green-500'
              }`}>
                <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
                  <i className="fas fa-biohazard text-xl"></i>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60">Injury Risk Assessment</p>
                  <p className="text-xl font-black uppercase italic tracking-tighter">{result.injuryRisk} RISK DEVIATION</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
              <i className="fas fa-dna text-8xl mb-6"></i>
              <h3 className="text-2xl font-black italic uppercase tracking-widest">Awaiting Biomechanical Uplink</h3>
              <p className="max-w-md text-sm font-bold uppercase mt-2 leading-relaxed">
                Upload a snapshot of your movement pattern to trigger a high-precision structural audit.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KineticFormAudit;
