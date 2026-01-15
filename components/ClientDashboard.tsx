
import React from 'react';

interface ClientDashboardProps {
  onNavigate: (tab: string) => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ onNavigate }) => {
  const todayWorkout = {
    name: "Pull: Hypertrophy Focus",
    duration: "65 min",
    exercises: 6,
    status: "PENDING"
  };

  const meals = [
    { time: "08:00", name: "Meal 1", info: "Oats, Whey Iso, Berries", cals: 450, done: true },
    { time: "12:00", name: "Meal 2", info: "Chicken Breast, Rice, Oil", cals: 600, done: false },
    { time: "16:00", name: "Pre-Workout", info: "Cream of Rice, Whey, Salt", cals: 350, done: false },
    { time: "20:00", name: "Post-Workout", info: "Steak, Potato, Greens", cals: 700, done: false },
  ];

  const supplements = [
    { name: "Omega-3", dosage: "2g", time: "Morning", taken: true },
    { name: "Vitamin D3", dosage: "5000iu", time: "Morning", taken: true },
    { name: "Creatine", dosage: "5g", time: "Post-Workout", taken: false },
    { name: "Magnesium", dosage: "400mg", time: "Bedtime", taken: false },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Daily Protocol</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Focus: Execution & Consistency</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-red-600 italic">2,100</p>
          <p className="text-[10px] font-black text-gray-500 uppercase">Kcal Target</p>
        </div>
      </div>

      {/* Primary Action: Workout */}
      <div 
        onClick={() => onNavigate('workout')}
        className="glass p-8 rounded-[2rem] border border-gray-800 hover:border-red-600 transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-red-600/10 to-transparent"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">Today's Session</p>
            </div>
            <h3 className="text-3xl font-black italic uppercase text-white mb-2">{todayWorkout.name}</h3>
            <div className="flex gap-4 text-xs font-bold text-gray-400 uppercase">
              <span><i className="fas fa-clock mr-1"></i> {todayWorkout.duration}</span>
              <span><i className="fas fa-dumbbell mr-1"></i> {todayWorkout.exercises} Exercises</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white text-2xl shadow-xl shadow-red-600/30 group-hover:scale-110 transition-transform">
            <i className="fas fa-play"></i>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nutrition Stack */}
        <div className="glass p-6 rounded-[2rem] border border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest"><i className="fas fa-utensils mr-2"></i> Fueling</h3>
            <button onClick={() => onNavigate('grocery')} className="text-[10px] font-black uppercase text-red-500 hover:text-white transition-colors">View Grocery List</button>
          </div>
          <div className="space-y-3">
            {meals.map((meal, i) => (
              <div key={i} className={`p-4 rounded-xl border flex justify-between items-center ${meal.done ? 'bg-green-600/5 border-green-600/20 opacity-50' : 'bg-gray-950 border-gray-800'}`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-red-500 uppercase">{meal.time}</span>
                    <span className="text-xs font-black uppercase text-white">{meal.name}</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">{meal.info}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-gray-300">{meal.cals}</p>
                  <p className="text-[8px] font-black text-gray-600 uppercase">KCAL</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supplement Stack */}
        <div className="glass p-6 rounded-[2rem] border border-gray-800">
          <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest mb-6"><i className="fas fa-capsules mr-2"></i> Chemistry</h3>
          <div className="space-y-3">
            {supplements.map((supp, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-950 rounded-xl border border-gray-800">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${supp.taken ? 'bg-green-600 border-green-600 text-white' : 'border-gray-700 text-gray-600'}`}>
                  {supp.taken && <i className="fas fa-check text-xs"></i>}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black uppercase text-white">{supp.name}</p>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">{supp.dosage} • {supp.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
