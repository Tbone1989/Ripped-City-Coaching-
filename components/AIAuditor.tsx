
import React, { useState, useEffect } from 'react';
import { runSystemAudit } from '../geminiService';
import { Anomaly } from '../types';

const IntegrityAuditor: React.FC<{ appState: any }> = ({ appState }) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const triggerAudit = async () => {
    setIsAuditing(true);
    setAnomalies([]);
    addLog("Initializing Ripped City Integrity Scan v3.27 Core...");
    addLog("Scanning clinical datasets for fatigue cascades...");
    addLog("Verifying integrity of athlete biomarker profiles...");
    addLog("Analyzing technical state and protocol deviations...");
    
    try {
      const results = await runSystemAudit(appState);
      setAnomalies(results);
      addLog(`Audit complete. Found ${results.length} integrity deviations.`);
    } catch (err) {
      addLog("ERROR: Connection to analysis server timed out.");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black italic uppercase">System Auditor</h2>
          <p className="text-blue-500 text-xs font-bold tracking-widest uppercase mt-1 flex items-center gap-2">
            <i className="fas fa-shield-halved"></i> Biological Governance Active
          </p>
        </div>
        <button 
          onClick={triggerAudit}
          disabled={isAuditing}
          className={`
            px-6 py-3 rounded-lg font-black uppercase tracking-tighter transition-all flex items-center gap-2
            ${isAuditing ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'}
          `}
        >
          {isAuditing ? <i className="fas fa-circle-notch animate-spin"></i> : <i className="fas fa-bolt"></i>}
          Run Deep Audit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {anomalies.length > 0 ? (
            anomalies.map((anomaly) => (
              <div key={anomaly.id} className="glass p-5 rounded-xl border-l-4 border-l-red-600 border border-gray-800 animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                      anomaly.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-yellow-500 text-black'
                    }`}>
                      {anomaly.severity}
                    </span>
                    <span className="text-gray-500 text-[10px] font-bold uppercase">{anomaly.type} Deviation</span>
                  </div>
                  <span className="text-gray-600 text-[10px]">{anomaly.timestamp}</span>
                </div>
                <p className="font-bold text-gray-100 mb-4">{anomaly.description}</p>
                <div className="flex gap-2">
                  {anomaly.fixAvailable && (
                    <button className="text-[10px] font-black uppercase px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors">
                      Execute System Patch
                    </button>
                  )}
                  <button className="text-[10px] font-black uppercase px-3 py-1.5 glass border border-gray-800 rounded text-gray-400 hover:text-white transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="glass h-64 rounded-xl border border-gray-800 flex flex-col items-center justify-center text-gray-600 space-y-4">
              <i className="fas fa-shield-check text-4xl opacity-20"></i>
              <p className="text-sm font-bold uppercase tracking-widest">No Active Deviations Detected</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-xl border border-gray-800">
            <h3 className="text-xs font-black uppercase italic tracking-widest text-gray-500 mb-4">Diagnostic Log</h3>
            <div className="bg-black/40 rounded p-4 font-mono text-[10px] text-blue-400 h-64 overflow-y-auto space-y-1">
              {log.map((entry, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                  {entry}
                </div>
              ))}
              {isAuditing && <div className="animate-pulse">_</div>}
            </div>
          </div>

          <div className="glass p-6 rounded-xl border border-blue-600/20 bg-blue-600/5">
            <h3 className="text-xs font-black uppercase italic tracking-widest text-blue-500 mb-2">Integrity Health</h3>
            <div className="flex items-end gap-2 h-12">
              {[80, 85, 90, 88, 92, 95, 94].map((v, i) => (
                <div key={i} className="flex-1 bg-blue-600/30 border-t border-blue-500 rounded-t" style={{ height: `${v}%` }}></div>
              ))}
            </div>
            <p className="text-[10px] text-blue-400 font-bold mt-3">SYSTEM INTEGRITY: 94.2%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrityAuditor;
