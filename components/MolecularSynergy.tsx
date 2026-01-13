
import React, { useState } from 'react';
import { analyzeMolecularSynergy } from '../geminiService';
import { MolecularSynergyReport } from '../types';

const MolecularSynergy: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stack, setStack] = useState('Protocol: Testosterone Cypionate 100mg/week, St. John\'s Wort, Grapefruit Juice, Multi-Vitamin (High Zinc)');
  const [report, setReport] = useState<MolecularSynergyReport | null>(null);

  const handleAudit = async () => {
    setLoading(true);
    try {
      const data = await analyzeMolecularSynergy(stack);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case 'SEVERE': return 'text-red-600 bg-red-600/10 border-red-600/30';
      case 'MODERATE': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-blue-500 bg-blue-600/10 border-blue-600/30';
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Molecular Synergy Hub</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Cross-Platform Interaction Audit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-xs font-black uppercase text-gray-500 mb-6 tracking-widest">Protocol Matrix</h3>
            <textarea 
              value={stack}
              onChange={e => setStack(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-5 text-xs font-bold outline-none focus:border-red-600 h-64 transition-all text-gray-200"
              placeholder="Input drugs, herbs, vitamins, minerals, and specific food protocols..."
            ></textarea>
            <button 
              onClick={handleAudit}
              disabled={loading}
              className="w-full mt-6 py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-xl shadow-red-600/20"
            >
              {loading ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-flask"></i>}
              Analyze Interaction Dynamics
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 glass rounded-[2.5rem] border border-gray-800 overflow-hidden flex flex-col min-h-[600px]">
          {report ? (
            <div className="flex-1 p-10 space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-center border-b border-gray-800 pb-6">
                <h4 className="font-black italic uppercase text-2xl tracking-tighter text-blue-500">Hazard Report</h4>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-500 uppercase">Synergy Integrity</p>
                  <p className="text-3xl font-black text-white">{report.synergyScore}%</p>
                </div>
              </div>

              <div className="space-y-6">
                <h5 className="text-[10px] font-black uppercase text-red-500 tracking-widest">Systemic Hazards Detected</h5>
                <div className="grid grid-cols-1 gap-4">
                  {report.interactions.map((int, i) => (
                    <div key={i} className={`p-4 rounded-xl border flex flex-col gap-2 ${getSeverityColor(int.severity)}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest">{int.type}</span>
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded border border-current">{int.severity}</span>
                      </div>
                      <p className="text-xs font-bold leading-relaxed">{int.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Optimization Protocols</h5>
                  <ul className="space-y-3">
                    {report.optimizationTips.map((tip, i) => (
                      <li key={i} className="flex gap-3 text-xs font-bold text-gray-300">
                        <span className="text-blue-500"><i className="fas fa-lightbulb"></i></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                   <h5 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Half-Life Management</h5>
                   <div className="flex flex-wrap gap-2">
                     {report.halfLifeAlerts.map((alert, i) => (
                       <span key={i} className="px-3 py-1 bg-gray-900 border border-gray-800 rounded text-[9px] font-black text-gray-400 uppercase">{alert}</span>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
              <i className="fas fa-microscope text-8xl mb-6"></i>
              <h3 className="text-2xl font-black italic uppercase tracking-widest">Awaiting Bio-Molecular Input</h3>
              <p className="max-w-md text-sm font-bold uppercase mt-2 leading-relaxed">
                Map your pharmacology, supplementation, and dietary habits to identify receptor competition and metabolic hazards.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MolecularSynergy;
