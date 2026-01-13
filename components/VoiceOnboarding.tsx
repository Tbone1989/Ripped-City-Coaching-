
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../geminiService';

interface VoiceOnboardingProps {
  onDataCaptured: (data: any) => void;
  onClose: () => void;
}

const VoiceOnboarding: React.FC<VoiceOnboardingProps> = ({ onDataCaptured, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState("Establishing secure voice uplink...");
  const [transcript, setTranscript] = useState("");
  
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Utility functions for audio encoding/decoding as per standard Live API implementation
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const startInterview = async () => {
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
            setIsActive(true);
            setStatus("Induction Protocol Active. Speak naturally.");
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(s => s.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.outputTranscription) {
              setTranscript(prev => prev + msg.serverContent.outputTranscription.text);
            }
            // Logic to handle audio playback would go here for a full conversation
          },
          onclose: () => setIsActive(false),
          onerror: (e) => console.error(e)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `${SYSTEM_INSTRUCTION} You are conducting an intake interview for Ripped City. Ask for their name, goal, and any injuries. When they finish, summarize the data.`
        }
      });
    } catch (err) {
      console.error(err);
      setStatus("Uplink Failed. Check hardware.");
    }
  };

  useEffect(() => {
    startInterview();
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-black/95 z-[70] flex flex-col items-center justify-center p-8 text-center space-y-12">
      <div className="relative">
        <div className={`w-32 h-32 rounded-full border-4 border-red-600/20 flex items-center justify-center transition-all duration-700 ${isActive ? 'scale-110 shadow-[0_0_50px_rgba(220,38,38,0.4)]' : ''}`}>
          <i className="fas fa-microphone text-4xl text-red-600 animate-pulse"></i>
        </div>
        {isActive && [...Array(3)].map((_, i) => (
          <div key={i} className="absolute inset-0 rounded-full border border-red-600 animate-ping" style={{ animationDelay: `${i * 0.5}s`, opacity: 0.2 }}></div>
        ))}
      </div>

      <div className="space-y-4 max-w-md">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Neural Induction</h2>
        <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">{status}</p>
        <p className="text-gray-400 text-xs italic leading-relaxed">"Zephyr is listening. Tell us who you are and what you intend to become."</p>
      </div>

      <div className="w-full max-w-lg glass p-6 rounded-2xl border border-gray-800 h-32 overflow-y-auto text-left">
        <p className="text-[10px] font-mono text-gray-500 uppercase mb-2">Real-time Transcript:</p>
        <p className="text-xs text-gray-300 font-medium italic">{transcript || "Waiting for audio signal..."}</p>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={onClose}
          className="px-8 py-3 glass border border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all"
        >
          Cancel Induction
        </button>
        <button 
          onClick={() => onDataCaptured({ fullName: "Voice Induction Subject", goal: transcript })}
          className="px-8 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20"
        >
          Finalize Sync
        </button>
      </div>
    </div>
  );
};

export default VoiceOnboarding;
