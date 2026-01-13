
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { SYSTEM_INSTRUCTION } from '../geminiService';

// Audio Utility Functions
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const RemoteConsultation: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);

  const stopSession = () => {
    setIsActive(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    activeSourcesRef.current.forEach(source => source.stop());
    activeSourcesRef.current.clear();
    setTranscript(prev => [...prev, "System: Session terminated."]);
  };

  const startSession = async () => {
    setIsConnecting(true);
    setTranscript(prev => [...prev, "System: Establishing secure remote channel..."]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            setTranscript(prev => [...prev, "Specialist: Link active. Proceed with your protocol update."]);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const ctx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              
              activeSourcesRef.current.add(source);
              source.onended = () => activeSourcesRef.current.delete(source);
            }

            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setTranscript(prev => {
                const last = prev[prev.length - 1];
                if (last?.startsWith('Specialist:')) {
                  return [...prev.slice(0, -1), last + text];
                }
                return [...prev, `Specialist: ${text}`];
              });
            }
            
            if (message.serverContent?.interrupted) {
              activeSourcesRef.current.forEach(s => s.stop());
              activeSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => stopSession(),
          onerror: (e) => {
            console.error("Link Error:", e);
            setTranscript(prev => [...prev, "Error: Remote channel corrupted."]);
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } // Use a more clinical/human sounding voice
          },
          systemInstruction: SYSTEM_INSTRUCTION,
          outputAudioTranscription: {}
        }
      });
      
      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
      setTranscript(prev => [...prev, "System: Access denied. Remote link failed."]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col space-y-6">
      <div className="text-center pt-8">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Direct Specialist Hub</h2>
        <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Real-time Remote Consult</p>
      </div>

      <div className="flex-1 glass rounded-2xl border border-gray-800 overflow-hidden flex flex-col p-6 relative">
        <div className="flex-1 overflow-y-auto space-y-4 font-mono text-xs">
          {transcript.map((line, i) => (
            <div key={i} className={`p-3 rounded border ${line.startsWith('Specialist') ? 'bg-blue-600/5 border-blue-600/20 text-blue-400' : 'bg-gray-900 border-gray-800 text-gray-400'}`}>
              <span className="font-black mr-2 uppercase tracking-widest">{line.split(':')[0]}:</span>
              {line.split(':').slice(1).join(':')}
            </div>
          ))}
          {isConnecting && <div className="text-blue-500 animate-pulse text-[10px] font-black uppercase">Establishing Link...</div>}
        </div>

        <div className="h-16 flex items-center justify-center gap-1 mt-6 border-t border-gray-800 pt-6">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1 rounded-full bg-blue-600 transition-all duration-300 ${isActive ? 'animate-pulse' : 'h-1 opacity-20'}`}
              style={{ 
                height: isActive ? `${Math.sin(Date.now() / 200 + i) * 30 + 50}%` : '4px',
                animationDelay: `${i * 0.05}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pb-8">
        <button 
          onClick={isActive ? stopSession : startSession}
          disabled={isConnecting}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center transition-all relative
            ${isActive ? 'bg-red-600 shadow-2xl shadow-red-600/50 scale-110' : 'bg-gray-800 hover:bg-gray-700 hover:scale-105'}
            ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isActive && <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-20"></div>}
          <i className={`fas ${isConnecting ? 'fa-circle-notch animate-spin' : (isActive ? 'fa-stop' : 'fa-microphone')} text-2xl text-white`}></i>
        </button>
      </div>
    </div>
  );
};

export default RemoteConsultation;
