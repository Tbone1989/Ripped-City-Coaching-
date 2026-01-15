
import React, { useState, useEffect, useRef } from 'react';
import { Exercise, SetRecord } from '../types';

const WorkoutInterface: React.FC = () => {
  const [protocol, setProtocol] = useState<Exercise[]>([
    { 
      id: 'ex1', 
      name: 'Pendulum Squat', 
      notes: 'Focus on 4-sec eccentric. Maintain tension.',
      sets: [
        { weight: '180', reps: '12', completed: false, rpe: 0 },
        { weight: '180', reps: '12', completed: false, rpe: 0 },
        { weight: '200', reps: '10', completed: false, rpe: 0 },
      ]
    },
    { 
      id: 'ex2', 
      name: 'Seated Leg Curls', 
      notes: 'Deep stretch at top. hard contraction.',
      sets: [
        { weight: '120', reps: '15', completed: false, rpe: 0 },
        { weight: '120', reps: '15', completed: false, rpe: 0 },
      ]
    }
  ]);

  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  const sessionIntervalRef = useRef<number | null>(null);
  const restIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (workoutStarted && !workoutComplete) {
      sessionIntervalRef.current = window.setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
    }
    return () => { if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current); };
  }, [workoutStarted, workoutComplete]);

  useEffect(() => {
    if (isResting && restTimer > 0) {
      restIntervalRef.current = window.setInterval(() => {
        setRestTimer(prev => prev - 1);
      }, 1000);
    } else {
      if (restTimer === 0) setIsResting(false);
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    }
    return () => { if (restIntervalRef.current) clearInterval(restIntervalRef.current); };
  }, [isResting, restTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateSet = (exIdx: number, setIdx: number, field: keyof SetRecord, value: any) => {
    const newProtocol = [...protocol];
    (newProtocol[exIdx].sets[setIdx] as any)[field] = value;
    setProtocol(newProtocol);

    if (field === 'completed' && value === true) {
      setRestTimer(90); // Default 90s rest
      setIsResting(true);
    }
  };

  const activeEx = protocol[activeExerciseIdx];

  if (!workoutStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-8 animate-in fade-in zoom-in-95">
        <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center shadow-2xl shadow-red-600/40">
          <i className="fas fa-play text-white text-3xl ml-1"></i>
        </div>
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Daily Kinetic Protocol</h2>
          <p className="text-gray-500 text-xs font-black uppercase tracking-widest mt-2">Target: Posterior Chain • 12,400 lbs Projected</p>
        </div>
        <button 
          onClick={() => setWorkoutStarted(true)}
          className="w-full max-w-xs py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-xl"
        >
          Initialize Session
        </button>
      </div>
    );
  }

  if (workoutComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-8">
        <div className="w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center text-green-500 text-4xl">
          <i className="fas fa-check"></i>
        </div>
        <h2 className="text-4xl font-black italic uppercase text-white">Evolution Logged</h2>
        <div className="glass p-8 rounded-3xl border border-gray-800 w-full max-w-sm space-y-4">
          <div className="flex justify-between">
            <span className="text-xs text-gray-500 uppercase font-black">Volume</span>
            <span className="text-sm font-bold">11,850 LBS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-500 uppercase font-black">Time</span>
            <span className="text-sm font-bold">{formatTime(sessionTimer)}</span>
          </div>
          <div className="pt-4 border-t border-gray-800">
            <p className="text-[10px] text-red-500 font-black uppercase mb-1">Architect Verdict</p>
            <p className="text-2xl font-black italic">SUPERIOR</p>
          </div>
        </div>
        <button onClick={() => window.location.reload()} className="w-full max-w-sm py-4 bg-gray-900 rounded-xl font-black uppercase text-xs">Return to HUD</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#030712] relative overflow-hidden">
      {/* Rest Timer Overlay */}
      {isResting && (
        <div className="absolute inset-0 z-50 glass bg-black/90 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-4">Metabolic Recovery Window</p>
          <p className="text-9xl font-black italic tabular-nums text-white">{restTimer}</p>
          <div className="flex gap-4 mt-12">
            <button onClick={() => setRestTimer(prev => prev + 30)} className="px-6 py-3 border border-gray-800 rounded-xl text-xs font-black uppercase">+30s</button>
            <button onClick={() => setIsResting(false)} className="px-8 py-4 bg-red-600 text-white rounded-xl text-xs font-black uppercase shadow-xl">Skip Rest</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 bg-gray-950 border-b border-gray-800 flex justify-between items-center shrink-0">
        <div>
          <h3 className="text-sm font-black uppercase text-white tracking-widest">Active Execution</h3>
          <p className="text-[9px] font-bold text-gray-500 uppercase">{formatTime(sessionTimer)} Elapsed</p>
        </div>
        <div className="flex gap-1 h-2 w-32 items-end">
           {protocol.map((_, i) => (
             <div key={i} className={`flex-1 rounded-full ${i <= activeExerciseIdx ? 'bg-red-600 shadow-[0_0_10px_#dc2626]' : 'bg-gray-800'}`}></div>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 pb-40">
        <div>
          <h2 className="text-3xl md:text-5xl font-black italic uppercase text-white tracking-tighter leading-none">{activeEx.name}</h2>
          <div className="mt-4 p-4 bg-gray-900 border-l-2 border-l-red-600 rounded-r-xl">
            <p className="text-xs text-gray-400 italic font-bold leading-relaxed">"{activeEx.notes}"</p>
          </div>
        </div>

        <div className="space-y-4">
          {activeEx.sets.map((set, i) => (
            <div 
              key={i} 
              className={`p-6 rounded-[2rem] border transition-all ${set.completed ? 'bg-green-600/10 border-green-600/30' : 'bg-gray-900/40 border-gray-800'}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <span className={`text-2xl font-black italic ${set.completed ? 'text-green-500' : 'text-gray-700'}`}>0{i+1}</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Target LBS</p>
                      <input 
                        type="number" 
                        value={set.weight} 
                        onChange={(e) => updateSet(activeExerciseIdx, i, 'weight', e.target.value)}
                        className="w-20 bg-black border border-gray-800 rounded-lg p-2 text-sm font-black text-white outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-500 uppercase mb-1">Reps</p>
                      <input 
                        type="number" 
                        value={set.reps} 
                        onChange={(e) => updateSet(activeExerciseIdx, i, 'reps', e.target.value)}
                        className="w-20 bg-black border border-gray-800 rounded-lg p-2 text-sm font-black text-white outline-none focus:border-red-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="text-center">
                     <p className="text-[8px] font-black text-gray-600 uppercase mb-1">RPE</p>
                     <select 
                      value={set.rpe}
                      onChange={(e) => updateSet(activeExerciseIdx, i, 'rpe', parseInt(e.target.value))}
                      className="bg-gray-800 border-none text-[10px] font-black rounded px-2"
                     >
                       {[0, 6, 7, 8, 9, 10].map(v => <option key={v} value={v}>{v || '-'}</option>)}
                     </select>
                   </div>
                   <button 
                    onClick={() => updateSet(activeExerciseIdx, i, 'completed', !set.completed)}
                    className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                      set.completed ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/20' : 'border-gray-800 text-transparent hover:border-red-600'
                    }`}
                   >
                     <i className="fas fa-check"></i>
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          {activeExerciseIdx > 0 && (
            <button onClick={() => setActiveExerciseIdx(prev => prev - 1)} className="flex-1 py-5 border border-gray-800 rounded-2xl font-black uppercase text-xs text-gray-500">Previous</button>
          )}
          {activeExerciseIdx < protocol.length - 1 ? (
            <button onClick={() => setActiveExerciseIdx(prev => prev + 1)} className="flex-1 py-5 bg-gray-900 border border-gray-800 rounded-2xl font-black uppercase text-xs text-white">Next Exercise</button>
          ) : (
            <button onClick={() => setWorkoutComplete(true)} className="flex-1 py-5 bg-white text-black rounded-2xl font-black uppercase text-xs shadow-2xl">Finish Session</button>
          )}
        </div>
      </div>

      {/* Persistence Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-gray-800 flex justify-between items-center z-40 md:left-20">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500">
             <i className="fas fa-chart-line"></i>
           </div>
           <div>
             <p className="text-[10px] font-black text-white uppercase">Live Progression</p>
             <p className="text-[8px] text-gray-500 font-bold uppercase">Subject: Baseline Optimized</p>
           </div>
         </div>
         <button className="text-[10px] font-black uppercase text-gray-600 hover:text-white">View Full Roadmap</button>
      </div>
    </div>
  );
};

export default WorkoutInterface;
