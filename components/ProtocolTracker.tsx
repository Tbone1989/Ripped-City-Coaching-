
import React, { useState } from 'react';
import { ProtocolItem } from '../types';

const ProtocolTracker: React.FC = () => {
  const [items, setItems] = useState<ProtocolItem[]>([
    { id: '1', name: 'Magnesium Glycinate', dosage: '400mg', time: '08:00', type: 'SUPPLEMENT', completed: true },
    { id: '2', name: 'Testosterone CYP', dosage: '50mg', time: '09:00', type: 'INJECTION', completed: false },
    { id: '3', name: 'Omega-3 (High EPA)', dosage: '3000mg', time: '12:00', type: 'SUPPLEMENT', completed: false },
    { id: '4', name: 'BPC-157', dosage: '250mcg', time: '20:00', type: 'INJECTION', completed: false },
  ]);

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  return (
    <div className="glass p-6 rounded-[2rem] border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest">Daily Protocol Stack</h3>
        <span className="text-[10px] font-black text-red-500 bg-red-600/10 px-2 py-0.5 rounded">
          {items.filter(i => i.completed).length}/{items.length} COMPLETED
        </span>
      </div>
      
      <div className="space-y-3">
        {items.map(item => (
          <div 
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${
              item.completed ? 'bg-green-600/5 border-green-600/20 opacity-60' : 'bg-gray-950 border-gray-800 hover:border-red-600/50'
            }`}
          >
            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              item.completed ? 'bg-green-600 border-green-600' : 'border-gray-700 group-hover:border-red-600'
            }`}>
              {item.completed && <i className="fas fa-check text-[10px] text-white"></i>}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-gray-100 uppercase">{item.name}</p>
                <span className="text-[8px] font-black text-gray-600 tracking-tighter">{item.time}</span>
              </div>
              <p className="text-[10px] text-gray-500 font-bold mt-0.5">{item.dosage} • {item.type}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-3 border border-dashed border-gray-800 rounded-xl text-[10px] font-black uppercase text-gray-600 hover:text-white hover:border-gray-600 transition-all">
        Edit Protocol
      </button>
    </div>
  );
};

export default ProtocolTracker;
