
import React, { useState } from 'react';
import { generateCircadianProtocol } from '../geminiService';

const CircadianOptimization: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [sleepData, setSleepData] = useState({
    totalSleep: '7.5h',
    remSleep: '1.2h',
    deepSleep: '1.8h',
    hrv: '65ms',
    restingHr: '52bpm'
  });
  const [protocol, setProtocol] = useState<any>(null);

  const handleAudit = async () => {
    setLoading(true);
    try {
      const data = await generateCircadianProtocol(sleepData);
      setProtocol(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Circadian Optimization</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">CNS Recovery Audit & Metabolic Readiness</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-xs font-black uppercase text-gray-500 mb-6 tracking-widest">Bio-Data Input (24h)</h3>
            <div className="space-y-4">
              {Object.keys(sleepData).map(key => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-600 ml-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <input 
                    type="text"
                    value={(sleepData as any)[key]}
                    onChange={e => setSleepData({...sleepData, [key]: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-xs font-bold outline-none focus:border-red-600 transition-all text-gray-200"
                  />
                </div>
              ))}
            </div>
            <button 
              onClick={handleAudit}
              disabled={loading}
              className="w-full mt-6 py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-xl shadow-red-600/20"
            >
              {loading ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-moon"></i>}
              Sync Recovery Protocol
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 glass rounded-[2.5rem] border border-gray-800 overflow-hidden flex flex-col">
          {protocol ? (
            <div className="flex-1 p-10 space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-center border-b border-gray-800 pb-6">
                <h4 className="font-black italic uppercase text-2xl tracking-tighter text-red-500">Readiness Report</h4>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-500 uppercase">CNS Status</p>
                  <p className="text-3xl font-black text-white italic">{protocol.cnsStatus}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-red-600/5 border border-red-900/30 rounded-2xl">
                  <h5 className="text-[10px] font-black uppercase text-red-500 mb-4 tracking-widest">Tactical Training Adjustments</h5>
                  <p className="text-xs text-gray-300 leading-relaxed font-bold italic">"{protocol.trainingAdjustments}"</p>
                </div>
                <div className="p-6 bg-blue-600/5 border border-blue-900/30 rounded-2xl">
                  <h5 className="text-[10px] font-black uppercase text-blue-500 mb-4 tracking-widest">Metabolic Nutrition Tweaks</h5>
                  <p className="text-xs text-gray-300 leading-relaxed font-bold italic">"{protocol.nutritionTweaks}"</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-end">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase text-gray-500">Readiness Index</p>
                    <p className="text-5xl font-black text-white">{protocol.readinessScore}%</p>
                  </div>
                  <div className="w-1/2 h-2 bg-gray-900 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600" style={{ width: `${protocol.readinessScore}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
              <i className="fas fa-bed text-8xl mb-6"></i>
              <h3 className="text-2xl font-black italic uppercase tracking-widest">Awaiting Circadian Feed</h3>
              <p className="max-w-md text-sm font-bold uppercase mt-2 leading-relaxed">
                Sync your nightly biometric trends to receive 24-hour tactical protocol adjustments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CircadianOptimization;
