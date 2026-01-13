
import React, { useState } from 'react';
import { HabitTask, ExperienceTier } from '../types';

const HabitEvolution: React.FC = () => {
  const [tier, setTier] = useState<ExperienceTier>('BEGINNER');
  const [tasks, setTasks] = useState<HabitTask[]>([
    { id: '1', title: 'Hydration Foundation', description: 'Drink 3L of water today.', points: 10, completed: true, tier: 'BEGINNER' },
    { id: '2', title: 'Tactical Swap', description: 'Replace one fast food item with a home-cooked protein source.', points: 25, completed: false, tier: 'BEGINNER' },
    { id: '3', title: 'Movement Initiation', description: 'Complete a 15-minute walk after your largest meal.', points: 15, completed: false, tier: 'BEGINNER' },
    { id: '4', title: 'Circadian Anchor', description: 'No screens 30 minutes before sleep.', points: 10, completed: false, tier: 'BEGINNER' },
  ]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const totalPoints = tasks.reduce((acc, t) => t.completed ? acc + t.points : acc, 0);
  const nextLevelThreshold = 200;
  const progressPercent = (totalPoints / nextLevelThreshold) * 100;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Evolution Timeline</h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Gradual Mastery: Beginner to Expert Hub</p>
      </div>

      {/* Progress Bar */}
      <div className="glass p-8 rounded-[2.5rem] border border-gray-800 space-y-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <span className="text-[10px] font-black uppercase text-red-500 tracking-[0.2em] block mb-1">Current Tier</span>
            <h3 className="text-2xl font-black italic uppercase text-white">{tier}</h3>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-white">{totalPoints}</span>
            <span className="text-[10px] font-black text-gray-600 uppercase ml-2">/ {nextLevelThreshold} PTS</span>
          </div>
        </div>
        <div className="h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-800 p-1">
          <div className="h-full bg-red-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(220,38,38,0.5)]" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <p className="text-[10px] text-gray-500 font-bold uppercase text-center tracking-widest italic">
          Earn {nextLevelThreshold - totalPoints} more points to unlock "INTERMEDIATE" protocol modules.
        </p>
      </div>

      {/* Habit List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tasks.map((task) => (
          <div 
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`glass p-6 rounded-[2rem] border transition-all cursor-pointer group flex flex-col justify-between ${
              task.completed ? 'bg-green-600/5 border-green-600/30' : 'border-gray-800 hover:border-red-600/40'
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  task.completed ? 'bg-green-600 border-green-600' : 'bg-gray-900 border-gray-800 group-hover:border-red-600/50'
                }`}>
                  <i className={`fas ${task.completed ? 'fa-check text-white' : 'fa-bolt text-gray-600'}`}></i>
                </div>
                <span className="text-[10px] font-black text-gray-600 uppercase">+{task.points} PTS</span>
              </div>
              <h4 className={`font-black uppercase text-sm mb-2 ${task.completed ? 'text-green-500 line-through' : 'text-white'}`}>{task.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-bold italic">{task.description}</p>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <span className="text-[8px] font-black uppercase text-gray-600 tracking-widest">{task.tier} HABIT</span>
              {task.completed && <span className="text-[8px] font-black uppercase text-green-500 tracking-widest italic">SYNCED</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 glass rounded-[2.5rem] border border-blue-900/20 bg-blue-600/5 text-center">
        <h4 className="text-[10px] font-black uppercase text-blue-500 mb-2 tracking-widest">Why Habits First?</h4>
        <p className="text-xs text-gray-400 italic leading-relaxed max-w-2xl mx-auto font-bold">
          "Elite performance isn't about one hard workout; it's about the compound effect of small, superior choices. Mastering these foundations unlocks the biological capacity for high-intensity protocols."
        </p>
      </div>
    </div>
  );
};

export default HabitEvolution;
