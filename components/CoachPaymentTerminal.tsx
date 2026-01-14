
import React, { useState } from 'react';

const CoachPaymentTerminal: React.FC = () => {
  const [amount, setAmount] = useState('250');
  const [selectedAthlete, setSelectedAthlete] = useState('Marcus V.');
  const [description, setDescription] = useState('Elite Protocol Cycle - 30 Days');
  const [generating, setGenerating] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);

  const handleGenerateInvoice = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setLinkGenerated(true);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Payment Terminal</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Issue Biological Resource Allocations</p>
        </div>
        <div className="hidden md:block glass px-6 py-3 rounded-xl border border-gray-800">
           <p className="text-[10px] font-black text-gray-500 uppercase">Unpaid Receivables</p>
           <p className="text-xl font-black text-red-500">$1,450.00</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-gray-800 space-y-6">
          <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
            <i className="fas fa-plus-circle"></i> Create New Allocation
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-600 ml-1">Target Athlete</label>
              <select 
                value={selectedAthlete}
                onChange={e => setSelectedAthlete(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-xs font-bold outline-none focus:border-red-600 transition-all text-gray-200"
              >
                <option>Marcus V.</option>
                <option>Sara K.</option>
                <option>Jake R.</option>
                <option>Elena D.</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-600 ml-1">Allocation Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-500">$</span>
                <input 
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 pl-8 text-xs font-bold outline-none focus:border-red-600 transition-all text-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-gray-600 ml-1">Protocol Description</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-xs font-bold outline-none focus:border-red-600 h-24 transition-all text-gray-200 resize-none"
              />
            </div>
          </div>

          <button 
            onClick={handleGenerateInvoice}
            disabled={generating}
            className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-red-600/30 flex items-center justify-center gap-3"
          >
            {generating ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-file-invoice-dollar"></i>}
            Generate Payment Link
          </button>
        </div>

        <div className="space-y-6">
          {linkGenerated ? (
            <div className="glass p-8 rounded-[2.5rem] border border-blue-600/30 bg-blue-600/5 animate-in zoom-in-95 duration-500 text-center space-y-6">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto shadow-2xl shadow-blue-600/40">
                <i className="fas fa-qrcode"></i>
              </div>
              <div>
                <h4 className="text-xl font-black italic uppercase text-white tracking-tighter">Encryption Finalized</h4>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Ready for Subject Distribution</p>
              </div>
              <div className="p-4 bg-gray-950 border border-gray-800 rounded-xl break-all font-mono text-[10px] text-gray-400">
                https://pay.rippedcity.com/v3/auth_{Math.random().toString(36).substring(7)}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-white text-black font-black uppercase text-[10px] rounded-xl">Copy Link</button>
                <button className="flex-1 py-3 glass border border-gray-800 text-white font-black uppercase text-[10px] rounded-xl">Send SMS</button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] glass rounded-[2.5rem] border border-gray-800 border-dashed flex flex-col items-center justify-center p-12 text-center opacity-30">
              <i className="fas fa-wallet text-6xl mb-4"></i>
              <p className="text-xs font-black uppercase tracking-widest leading-loose">Awaiting invoice parameters <br /> to generate secure checkout.</p>
            </div>
          )}

          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
             <h3 className="text-xs font-black uppercase text-gray-500 mb-6 tracking-widest">Recent Activity</h3>
             <div className="space-y-4">
                {[
                  { user: 'Marcus V.', date: 'Today', status: 'UNPAID', amt: '$250' },
                  { user: 'Elena D.', date: 'Yesterday', status: 'PAID', amt: '$500' }
                ].map((act, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                    <div>
                      <p className="text-[10px] font-black text-gray-200">{act.user}</p>
                      <p className="text-[8px] text-gray-600 font-bold uppercase">{act.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-white">{act.amt}</p>
                      <span className={`text-[8px] font-black uppercase ${act.status === 'PAID' ? 'text-green-500' : 'text-red-500'}`}>{act.status}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachPaymentTerminal;
