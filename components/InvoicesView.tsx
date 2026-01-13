
import React, { useState } from 'react';
import { Invoice } from '../types';

const InvoicesView: React.FC = () => {
  const [invoices] = useState<Invoice[]>([
    { id: 'INV-001', amount: 250, status: 'PAID', date: '2023-10-01', description: 'Monthly Elite Protocol', paymentMethod: 'VISA •••• 4242' },
    { id: 'INV-002', amount: 250, status: 'PAID', date: '2023-11-01', description: 'Monthly Elite Protocol', paymentMethod: 'VISA •••• 4242' },
    { id: 'INV-003', amount: 250, status: 'PENDING', date: '2023-12-01', description: 'Monthly Elite Protocol' },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("Encryption secure. Payment synthesized via Ripped City Financial Relay.");
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Financial Ledger</h2>
          <p className="text-gray-400 text-sm mt-1 uppercase font-bold tracking-widest">Resource Allocation & Subscription Integrity</p>
        </div>
        <div className="p-6 glass rounded-2xl border border-gray-800 flex items-center gap-8 shadow-2xl">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Current Balance</p>
            <p className="text-3xl font-black text-red-600 italic tracking-tighter">$250.00</p>
          </div>
          <button 
            onClick={handlePay}
            disabled={isProcessing}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all flex items-center gap-3 shadow-xl shadow-red-600/30"
          >
            {isProcessing ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-shield-halved"></i>}
            Execute Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead className="bg-gray-900/50 border-b border-gray-800">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest">Allocation ID</th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-center">Amount</th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-500 tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {invoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-900/30 transition-colors group">
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-mono text-[10px] text-red-500 uppercase tracking-tighter mb-1">{inv.id}</span>
                        <span className="text-xs font-bold text-gray-300 uppercase">{inv.description}</span>
                        <span className="text-[9px] text-gray-600 font-bold uppercase mt-1">{inv.date} {inv.paymentMethod && `• ${inv.paymentMethod}`}</span>
                      </div>
                    </td>
                    <td className="p-6 text-sm font-black text-center text-white">${inv.amount.toFixed(2)}</td>
                    <td className="p-6 text-right">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${
                        inv.status === 'PAID' ? 'bg-green-600/10 border-green-600/30 text-green-500' : 
                        inv.status === 'PENDING' ? 'bg-yellow-600/10 border-yellow-600/30 text-yellow-500' : 
                        'bg-red-600/10 border-red-600/30 text-red-600'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-gray-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 filter blur-3xl group-hover:bg-red-600/20 transition-all"></div>
            <h3 className="text-xs font-black uppercase text-gray-500 mb-6 tracking-widest">Tactical Wallet</h3>
            <div className="space-y-4">
              <div className="p-4 bg-black/40 rounded-2xl border border-gray-800 flex items-center justify-between group-hover:border-red-900/50 transition-all">
                <div className="flex items-center gap-3">
                  <i className="fab fa-cc-visa text-xl text-blue-400"></i>
                  <span className="text-[10px] font-black text-gray-400">•••• 4242</span>
                </div>
                <span className="text-[8px] font-black text-gray-600 uppercase">Primary</span>
              </div>
              <div className="p-4 bg-black/40 rounded-2xl border border-gray-800 flex items-center justify-between border-dashed opacity-50 hover:opacity-100 transition-all cursor-pointer">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Add New Relay</span>
                <i className="fas fa-plus text-[10px] text-gray-600"></i>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-blue-600/20 bg-blue-600/5">
            <h3 className="text-xs font-black uppercase text-blue-500 mb-4 tracking-widest">Subscription Tier</h3>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-black italic uppercase text-white">Elite Protocol</span>
              <span className="px-2 py-1 bg-blue-600/20 text-blue-500 rounded text-[8px] font-black uppercase">Active</span>
            </div>
            <ul className="space-y-3 mb-8">
              {['24/7 Remote Connect', 'Weekly Bloodwork Audit', 'Biomechanical Form Check'].map(f => (
                <li key={f} className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase">
                  <i className="fas fa-check text-blue-500"></i> {f}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-gray-500 pt-6 border-t border-blue-900/20">
               <span>Auto-Renew</span>
               <div className="w-10 h-5 bg-blue-600 rounded-full flex items-center justify-end px-1 cursor-pointer">
                 <div className="w-3 h-3 bg-white rounded-full"></div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesView;
