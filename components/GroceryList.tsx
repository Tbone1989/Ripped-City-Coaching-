
import React, { useState } from 'react';

const GroceryList: React.FC = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Chicken Breast", amount: "2kg", cat: "Protein", checked: false },
    { id: 2, name: "Grass-Fed Ground Beef", amount: "1kg", cat: "Protein", checked: false },
    { id: 3, name: "Jasmine Rice", amount: "1 bag", cat: "Carbs", checked: true },
    { id: 4, name: "Cream of Rice", amount: "2 boxes", cat: "Carbs", checked: false },
    { id: 5, name: "Blueberries (Frozen)", amount: "3 bags", cat: "Produce", checked: false },
    { id: 6, name: "Spinach", amount: "2 bags", cat: "Produce", checked: false },
    { id: 7, name: "Pink Himalayan Salt", amount: "1 shaker", cat: "Pantry", checked: true },
    { id: 8, name: "Whey Isolate", amount: "1 tub", cat: "Supplements", checked: false },
  ]);

  const toggleItem = (id: number) => {
    setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  const categories = Array.from(new Set(items.map(i => i.cat)));

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Supply Logistics</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Generated from Nutritional Protocol</p>
        </div>
        <button className="px-6 py-3 border border-gray-800 rounded-xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">
          <i className="fas fa-share-nodes mr-2"></i> Share List
        </button>
      </div>

      <div className="glass rounded-[2.5rem] border border-gray-800 p-8 space-y-8">
        {categories.map(cat => (
          <div key={cat}>
            <h3 className="text-xs font-black uppercase text-red-500 tracking-widest mb-4 border-b border-gray-800 pb-2">{cat}</h3>
            <div className="space-y-3">
              {items.filter(i => i.cat === cat).map(item => (
                <div 
                  key={item.id} 
                  onClick={() => toggleItem(item.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                    item.checked ? 'bg-green-600/5 border-green-600/20 opacity-50' : 'bg-gray-950 border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    item.checked ? 'bg-green-600 border-green-600' : 'border-gray-700'
                  }`}>
                    {item.checked && <i className="fas fa-check text-[10px] text-white"></i>}
                  </div>
                  <div className="flex-1 flex justify-between">
                    <span className={`text-sm font-bold uppercase ${item.checked ? 'line-through text-gray-500' : 'text-gray-200'}`}>{item.name}</span>
                    <span className="text-xs font-mono text-gray-500">{item.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroceryList;
