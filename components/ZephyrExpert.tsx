
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getExpertConsultation } from '../geminiService';

const ProtocolExpert: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: "Secure link established. I am reviewing your biological and pharmacological data now. How shall we optimize your strategy today?", 
      timestamp: new Date().toLocaleTimeString() 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await getExpertConsultation(input, messages);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] glass rounded-[2rem] border border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-800 bg-red-600/5 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
            <i className="fas fa-user-doctor text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Elite Consultation Hub</h2>
            <p className="text-[10px] font-black uppercase text-red-500 tracking-widest animate-pulse">DIRECT EXPERT CHANNEL: SECURED</p>
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          {['Pharmacology', 'Endocrinology', 'Sports Medicine', 'Strategic Growth'].map(tag => (
            <span key={tag} className="text-[9px] font-black uppercase px-2 py-1 bg-gray-900 border border-gray-800 rounded text-gray-500">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.05),transparent)]">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
            <div className={`max-w-[80%] p-5 rounded-2xl border ${
              m.role === 'user' 
                ? 'bg-red-600 border-red-500 text-white shadow-xl shadow-red-600/10' 
                : 'glass border-gray-800 text-gray-300'
            }`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">
                  {m.role === 'user' ? 'Athlete Subject' : 'Senior Specialist'}
                </span>
                <span className="text-[8px] opacity-40 font-mono">{m.timestamp}</span>
              </div>
              <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-pulse">
            <div className="glass border-gray-800 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce delay-150"></div>
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-2">Reviewing Clinical Data...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-800 bg-black/20 shrink-0">
        <div className="flex gap-4 relative">
          <input 
            type="text"
            className="flex-1 bg-gray-950 border border-gray-800 p-5 pr-16 rounded-2xl outline-none focus:border-red-600 transition-all font-bold text-gray-200 placeholder:text-gray-600 shadow-inner"
            placeholder="Query pharmacology, stacking, rehab protocols or business scaling..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-red-600 hover:bg-red-700 rounded-xl text-white transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
          >
            <i className={`fas ${loading ? 'fa-spinner animate-spin' : 'fa-paper-plane'}`}></i>
          </button>
        </div>
        <p className="text-[9px] text-center text-gray-600 uppercase font-black tracking-widest mt-4">
          Direct Specialist Connection: End-to-End Encrypted. Protocol Data Hub v3.27.
        </p>
      </div>
    </div>
  );
};

export default ProtocolExpert;
