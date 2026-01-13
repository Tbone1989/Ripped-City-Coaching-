
import React, { useState } from 'react';
import { analyzeMarketIntel } from '../geminiService';
import { MarketInsight } from '../types';

const BusinessIntel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [marketIntel, setMarketIntel] = useState<MarketInsight | null>(null);

  const bizStats = [
    { label: 'MRR Velocity', value: '$18,400', sub: '+12.5% Month-over-Month', color: 'text-white' },
    { label: 'Retention Rate', value: '96.2%', sub: 'Target: 95%', color: 'text-green-500' },
    { label: 'LTV Average', value: '$3,200', sub: 'Elite Client Focus', color: 'text-blue-500' },
    { label: 'Lead Flow', value: '42', sub: 'Last 30 Days', color: 'text-gray-400' },
  ];

  const handleRunMarketingAudit = async () => {
    setLoading(true);
    try {
      const data = await analyzeMarketIntel({ currentStats: bizStats, niche: 'Elite Bodybuilding Coaching' });
      setMarketIntel(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Business Command HUD</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Ripped City Inc. Fiscal & Growth Intelligence</p>
        </div>
        <button 
          onClick={handleRunMarketingAudit}
          disabled={loading}
          className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all flex items-center gap-3 shadow-xl shadow-red-600/20"
        >
          {loading ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-bullhorn"></i>}
          Analyze Marketing Integrity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bizStats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-gray-800 group hover:border-red-600/50 transition-all">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-[9px] font-bold text-gray-500 uppercase mt-2 italic">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass rounded-[2.5rem] p-8 border border-gray-800">
            <h3 className="text-xs font-black uppercase text-gray-500 mb-8 tracking-widest">Revenue Momentum</h3>
            <div className="h-64 flex items-end gap-2">
              {[30, 45, 40, 60, 55, 75, 70, 85, 95, 88, 100, 110].map((v, i) => (
                <div key={i} className="flex-1 group relative">
                  <div className="w-full bg-red-600/10 group-hover:bg-red-600 transition-all rounded-t-sm" style={{ height: `${v}%` }}></div>
                </div>
              ))}
            </div>
          </div>

          {marketIntel && (
            <div className="glass p-8 rounded-[2.5rem] border border-blue-600/20 bg-blue-600/5 animate-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-xs font-black uppercase text-blue-500 mb-6 tracking-widest">Marketing Strategy Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-500">Competitor Positioning</p>
                    <p className="text-xs text-gray-300 leading-relaxed italic mt-1">"{marketIntel.competitorAnalysis}"</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-500">Pricing Optimization</p>
                    <p className="text-xs font-bold text-white mt-1">{marketIntel.pricingStrategy}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-500">Suggested Elite Package</p>
                    <p className="text-xs font-bold text-blue-400 mt-1">{marketIntel.suggestedPackage}</p>
                  </div>
                  <div className="p-4 bg-black/40 rounded-xl border border-gray-800">
                    <p className="text-[10px] font-black uppercase text-red-500">Sales Script Hook</p>
                    <p className="text-xs font-medium text-gray-300 mt-2">"{marketIntel.salesScriptHook}"</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-red-900/30 bg-red-600/5">
            <h3 className="text-xs font-black uppercase text-red-500 mb-6 tracking-widest">Zephyr Business Audit</h3>
            <div className="space-y-4 text-xs">
               <div className="p-4 bg-black/40 border border-gray-800 rounded-xl">
                 <p className="text-[9px] font-black uppercase text-gray-500 mb-1">Ad Integrity</p>
                 <p className="text-gray-300">ROAS is stabilizing at 4.2x. Scale budget by 15% in prep-niche markets.</p>
               </div>
               <div className="p-4 bg-black/40 border border-gray-800 rounded-xl">
                 <p className="text-[9px] font-black uppercase text-gray-500 mb-1">Retention Alert</p>
                 <p className="text-gray-300">3 athletes in Unit Gamma nearing contract end. Auto-triggering renewal incentives.</p>
               </div>
            </div>
          </div>
          
          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-xs font-black uppercase text-gray-500 mb-6 tracking-widest">Strategic Broadcaster</h3>
            <textarea 
              className="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-[10px] font-bold outline-none focus:border-red-600 h-24 transition-all text-gray-300"
              placeholder="Draft announcement for new premium coaching tier..."
            ></textarea>
            <button className="w-full mt-4 py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-gray-200 transition-all shadow-lg">
              Launch Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessIntel;
