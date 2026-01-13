
import React, { useState } from 'react';
import { Appointment } from '../types';
import { optimizeStrategicSchedule } from '../geminiService';

interface ScheduleViewProps {
  onReminderAction?: (msg: string) => void;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ onReminderAction }) => {
  const [loading, setLoading] = useState(false);
  const [optimization, setOptimization] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', title: 'Bloodwork Strategy Call', time: 'Tomorrow, 10:00 AM', type: 'STRATEGY', status: 'SCHEDULED' },
    { id: '2', title: 'Pose Refinement Session', time: 'Friday, 3:30 PM', type: 'CONSULTATION', status: 'SYNCED' },
  ]);

  const [reminders, setReminders] = useState([
    { text: "Dose 400mg Magnesium Citrate tonight", done: false },
    { text: "Submit fasted morning weight check-in", done: false },
    { text: "Bloodwork panel due in 4 days", done: false }
  ]);

  const handleSync = (platform: string) => {
    alert(`Establishing secure handshake with ${platform} Cloud Services...`);
    setAppointments(appointments.map(a => ({ ...a, status: 'SYNCED' })));
  };

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const data = await optimizeStrategicSchedule(appointments, { hrv: '65ms', sleep: '7.2h' });
      setOptimization(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleReminder = (index: number) => {
    const newReminders = [...reminders];
    newReminders[index].done = !newReminders[index].done;
    setReminders(newReminders);
    if (newReminders[index].done && onReminderAction) {
      onReminderAction(`Completed: ${newReminders[index].text}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Strategic Schedule</h2>
          <p className="text-gray-400 text-sm mt-1 uppercase font-bold tracking-widest">Temporal Allocation & Bio-Handshake</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => handleSync('Google')}
            className="px-4 py-2 glass border border-gray-800 rounded-lg text-[10px] font-black uppercase text-gray-400 hover:text-white flex items-center gap-2"
          >
            <i className="fab fa-google"></i> Google Sync
          </button>
          <button 
            onClick={() => handleSync('Outlook')}
            className="px-4 py-2 glass border border-gray-800 rounded-lg text-[10px] font-black uppercase text-gray-400 hover:text-white flex items-center gap-2"
          >
            <i className="fab fa-microsoft"></i> Outlook Sync
          </button>
          <button 
            onClick={handleOptimize}
            disabled={loading}
            className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-xl shadow-red-600/20 flex items-center gap-3"
          >
            {loading ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-brain"></i>}
            Neural Optimization
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {optimization && (
            <div className="glass p-8 rounded-[2.5rem] border border-blue-600/30 bg-blue-600/5 animate-in slide-in-from-top-4 duration-500">
               <h3 className="text-xs font-black uppercase text-blue-500 mb-6 tracking-widest flex items-center gap-2">
                 <i className="fas fa-sparkles"></i> Specialist Peak Slots
               </h3>
               <div className="grid md:grid-cols-3 gap-4">
                 {optimization.suggestedWindows.map((slot: any, i: number) => (
                   <div key={i} className="bg-black/40 p-4 rounded-xl border border-blue-900/20 hover:border-blue-500 transition-all cursor-pointer group">
                      <p className="text-blue-400 font-black text-xs uppercase">{slot.timeSlot}</p>
                      <p className="text-[9px] text-gray-500 mt-2 leading-relaxed italic">"{slot.reasoning}"</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-[8px] font-black uppercase text-gray-600">Readiness: {slot.readinessScore}%</span>
                        <i className="fas fa-plus text-[8px] text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black italic uppercase text-gray-100">Temporal Matrix</h3>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl glass border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-all"><i className="fas fa-chevron-left"></i></button>
                <button className="w-10 h-10 rounded-xl glass border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-all"><i className="fas fa-chevron-right"></i></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {['M','T','W','T','F','S','S'].map(d => (
                <div key={d} className="text-center text-[10px] font-black text-gray-600 uppercase mb-4 tracking-widest">{d}</div>
              ))}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const hasEvent = [4, 12, 18, 24].includes(day);
                return (
                  <div key={i} className={`
                    aspect-square rounded-2xl border transition-all flex flex-col items-center justify-center relative group cursor-pointer
                    ${day === 14 ? 'border-red-600 bg-red-600/5' : 'border-gray-900 hover:border-gray-700 bg-gray-950/20'}
                  `}>
                    <span className={`text-sm font-bold ${day === 14 ? 'text-red-500' : 'text-gray-500'}`}>{day}</span>
                    {hasEvent && <div className="absolute bottom-3 w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_#2563eb]"></div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-xs font-black uppercase text-gray-500 mb-6 tracking-widest">Tactical Engagements</h3>
            <div className="space-y-4">
              {appointments.map(app => (
                <div key={app.id} className="p-5 bg-gray-900/50 rounded-2xl border border-gray-800 group hover:border-red-600/30 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${app.status === 'SYNCED' ? 'bg-green-600/10 text-green-500 border border-green-600/20' : 'bg-blue-600/10 text-blue-500 border border-blue-600/20'}`}>
                      {app.status}
                    </span>
                    <i className="fas fa-calendar-check text-gray-700"></i>
                  </div>
                  <h4 className="font-black italic uppercase tracking-wider text-sm">{app.title}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{app.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border-l-4 border-l-yellow-600 border border-gray-800">
            <h3 className="text-xs font-black uppercase text-yellow-500 mb-6 flex items-center gap-2">
              <i className="fas fa-bell"></i> Critical Protocol Cues
            </h3>
            <div className="space-y-4">
              {reminders.map((rem, i) => (
                <div key={i} className="flex gap-4 group items-start">
                  <button 
                    onClick={() => toggleReminder(i)}
                    className={`mt-1 w-5 h-5 rounded-lg border border-gray-800 flex items-center justify-center transition-all ${rem.done ? 'bg-green-600 border-green-600' : 'group-hover:border-yellow-600'}`}
                  >
                    <i className={`fas fa-check text-[10px] ${rem.done ? 'text-white' : 'text-transparent'}`}></i>
                  </button>
                  <p className={`text-xs font-bold uppercase leading-relaxed transition-all ${rem.done ? 'text-gray-700 line-through' : 'text-gray-400 group-hover:text-gray-100'}`}>
                    {rem.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;
