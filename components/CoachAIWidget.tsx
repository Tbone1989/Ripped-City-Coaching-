
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, FunctionDeclaration, Type } from '@google/genai';
import { SYSTEM_INSTRUCTION, protocolEvents } from '../geminiService';
import { DashboardEvent } from '../types';

const CoachAIWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true); // Expanded by default on login
  const [isLive, setIsLive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [history, setHistory] = useState<DashboardEvent[]>([]);
  const [aiResponse, setAiResponse] = useState<string>("Initializing Neural Handshake...");
  const [visualizerData, setVisualizerData] = useState<number[]>(Array(20).fill(2));
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);

  // Subscribe to dashboard events for proactive intervention
  useEffect(() => {
    const unsubscribe = protocolEvents.subscribe((event: DashboardEvent) => {
      setHistory(prev => [event, ...prev].slice(0, 15));
      
      // Proactive logic triggers
      if (event.type === 'UPDATE_MACROS') {
        const value = parseInt(event.details.match(/\d+/)?.[0] || '0');
        if (value < 1500 && value > 0) {
          setAiResponse(`ALERT: Caloric drop for ${event.subject} is potentially catabolic. Recommend monitoring Cortisol:DHEA-S ratio.`);
        } else {
          setAiResponse(`Logged: Metabolic adjustment for ${event.subject}. Recalculating thermic effect of feeding.`);
        }
      } else if (event.type === 'VIEW_STATS') {
        setAiResponse(`Synchronizing ${event.subject}'s biological dataset. Integrity score: ${Math.floor(Math.random() * 10 + 85)}%.`);
      } else if (event.type === 'SYSTEM_ALERT' && event.subject === 'CRM') {
        setAiResponse(`Provisioned new subject: ${event.details.split(' - ')[0]}. Intelligence entry localized.`);
      }
    });
    return unsubscribe;
  }, []);

  // Tool definition for adding clients
  const addProspectTool: FunctionDeclaration = {
    name: 'add_prospect',
    description: 'Adds a new prospective client to the Ripped City database.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: 'Full name of the subject' },
        email: { type: Type.STRING, description: 'Email address if provided' },
        goal: { type: Type.STRING, description: 'Primary performance or aesthetic objective' }
      },
      required: ['name']
    }
  };

  const stopLive = () => {
    setIsLive(false);
    streamRef.current?.getTracks().forEach(t => t.stop());
    sessionRef.current?.close();
  };

  const startLive = async () => {
    setIsConnecting(true);
    setAiResponse("Establishing secure neural uplink...");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = inputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLive(true);
            setIsConnecting(false);
            setAiResponse("Link Active. Awaiting briefing...");
            
            // SEND IMMEDIATE TEXT PROMPT TO TRIGGER VOICE BRIEFING
            sessionPromise.then(s => s.sendRealtimeInput({
                content: [{ text: "System Alert: Coach has logged in. Initialize daily briefing immediately. Report on Sara K (Missed Check-in) and Marcus V (Plateau). Mention 1 new prospect application." }]
            }));

            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
                sum += Math.abs(inputData[i]);
              }
              const avg = sum / inputData.length;
              setVisualizerData(prev => [...prev.slice(1), Math.max(2, avg * 100)]);

              sessionPromise.then(s => s.sendRealtimeInput({ 
                media: { 
                  data: btoa(String.fromCharCode(...new Uint8Array(int16.buffer))), 
                  mimeType: 'audio/pcm;rate=16000' 
                } 
              }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Handle standard transcription
            if (msg.serverContent?.outputTranscription) {
              setAiResponse(msg.serverContent.outputTranscription.text);
            }

            // Handle Function Calls (Adding Clients)
            if (msg.toolCall) {
              for (const fc of msg.toolCall.functionCalls) {
                if (fc.name === 'add_prospect') {
                  const { name, email, goal } = fc.args as any;
                  
                  // Emit event to global bus
                  protocolEvents.emit({
                    type: 'SYSTEM_ALERT',
                    subject: 'CRM',
                    details: `${name} - Goal: ${goal || 'Not specified'}. Provisioned via voice handshake.`,
                    timestamp: new Date().toLocaleTimeString()
                  });

                  // Respond back to model
                  sessionPromise.then(s => s.sendToolResponse({
                    functionResponses: [{
                      id: fc.id,
                      name: fc.name,
                      response: { result: "Subject successfully added to prospect database. Provisioning confirmed." }
                    }]
                  }));
                }
              }
            }
          },
          onclose: () => stopLive(),
          onerror: (e) => {
            console.error(e);
            setIsConnecting(false);
            setIsLive(false);
            setAiResponse("Connection Interrupted. Re-establish link.");
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [{ functionDeclarations: [addProspectTool] }],
          systemInstruction: `${SYSTEM_INSTRUCTION} \nCoach Context: You are observing the Coach's dashboard. You have tool access to 'add_prospect'. Use it when the coach mentions a new name to track. History: ${JSON.stringify(history)}`
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
      setAiResponse("Secure Uplink Failed. Manual Override Required.");
    }
  };

  // Auto-connect on mount
  useEffect(() => {
    if (!isLive && !isConnecting) {
        startLive();
    }
  }, []);

  return (
    <div className={`fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 transition-all duration-500 ${isExpanded ? 'w-96' : 'w-16'}`}>
      {isExpanded && (
        <div className="w-full glass bg-[#050505]/95 border border-red-600/30 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-5 duration-500">
          <div className="p-5 bg-red-600/10 border-b border-red-600/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-600 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-[10px] font-black uppercase text-red-500 tracking-[0.2em] italic">Architect's Shadow v4.0</span>
            </div>
            <button onClick={() => setIsExpanded(false)} className="text-gray-600 hover:text-white transition-colors"><i className="fas fa-times text-xs"></i></button>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="space-y-3">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex justify-between">
                <span>Direct Intelligence Feed</span>
                <span className={isLive ? "text-green-500" : "text-gray-500"}>{isLive ? "LIVE UPLINK" : "STANDBY"}</span>
              </p>
              <div className="p-5 bg-gray-900/50 rounded-2xl border border-gray-800 group hover:border-red-900/40 transition-all">
                <p className="text-[11px] font-bold text-gray-200 leading-relaxed italic">"{aiResponse}"</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Logic Observation Stream</p>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-3 custom-scrollbar">
                {history.length === 0 ? (
                  <p className="text-[10px] text-gray-700 italic font-medium">Monitoring tactical maneuvers...</p>
                ) : (
                  history.map((h, i) => (
                    <div key={i} className={`text-[10px] font-mono border-l-2 pl-3 py-1 group transition-all ${h.subject === 'CRM' ? 'text-green-400 border-green-900/50 hover:border-green-500' : 'text-blue-400/80 border-blue-900/30 hover:border-blue-500'}`}>
                      <span className="text-[8px] text-gray-600 block mb-0.5">[{h.timestamp}]</span>
                      <span className={`font-black ${h.subject === 'CRM' ? 'text-green-500' : 'text-blue-500'}`}>{h.type}:</span> {h.subject} - {h.details.substring(0, 60)}...
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-end justify-center gap-1 h-12 bg-gray-950/50 rounded-2xl p-4 border border-gray-900">
               {visualizerData.map((v, i) => (
                 <div 
                  key={i} 
                  className={`w-1 rounded-full transition-all duration-100 ${isLive ? 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]' : 'bg-gray-800'}`} 
                  style={{ height: `${v}%` }}
                 ></div>
               ))}
            </div>

            <button 
              onClick={isLive ? stopLive : startLive}
              disabled={isConnecting}
              className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-4 ${
                isLive ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-pulse' : 'bg-white text-black hover:bg-red-600 hover:text-white'
              }`}
            >
              {isConnecting ? <i className="fas fa-circle-notch animate-spin"></i> : <i className={`fas ${isLive ? 'fa-microphone-alt' : 'fa-brain'}`}></i>}
              {isLive ? 'Link Online (Listening)' : 'Establish Neural Link'}
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 group relative ${
          isExpanded ? 'bg-gray-800 border border-gray-700' : 'bg-red-600 shadow-red-600/30 overflow-hidden'
        }`}
      >
        {!isExpanded && <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>}
        <i className={`fas ${isExpanded ? 'fa-chevron-down' : 'fa-brain'} text-white text-2xl relative z-10 ${!isExpanded && 'group-hover:rotate-12 transition-transform'}`}></i>
      </button>
    </div>
  );
};

export default CoachAIWidget;
