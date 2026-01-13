import React, { useState, useRef, useEffect } from 'react';
import { analyzeProductLabel } from '../geminiService';
import { ExperienceTier } from '../types';

const ProductScanner: React.FC<{ tier: ExperienceTier }> = ({ tier }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    // We set the state first so the video element enters the DOM
    setIsCameraActive(true);
  };

  useEffect(() => {
    let active = true;

    async function initCamera() {
      if (isCameraActive && videoRef.current && !streamRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: { ideal: 'environment' } } 
          });
          if (active && videoRef.current) {
            streamRef.current = stream;
            videoRef.current.srcObject = stream;
          } else {
            stream.getTracks().forEach(t => t.stop());
          }
        } catch (err) {
          console.error("Camera access denied:", err);
          alert("Could not access camera. Please check permissions or use file upload.");
          setIsCameraActive(false);
        }
      }
    }

    initCamera();

    return () => {
      active = false;
    };
  }, [isCameraActive]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64String = canvas.toDataURL('image/jpeg');
      processImage(base64String, 'image/jpeg');
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      processImage(reader.result as string, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64: string, mimeType: string) => {
    setAnalyzing(true);
    try {
      const data = await analyzeProductLabel(base64, tier, mimeType);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing product. Ensure the image is clear.");
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="text-center md:text-left flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Fuel Auditor</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Barcode & Nutrition Label Intelligence</p>
        </div>
        {!isCameraActive && (
          <button 
            onClick={startCamera}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/20 text-red-500 rounded-lg text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
          >
            <i className="fas fa-video"></i> Live Lens
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2.5rem] border border-gray-800 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden group min-h-[400px]">
          {isCameraActive ? (
            <div className="absolute inset-0 flex flex-col bg-black">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="flex-1 object-cover"
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-red-600/50 rounded-3xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-600 rounded-tl-xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-600 rounded-tr-xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-600 rounded-bl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-600 rounded-br-xl"></div>
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-600/30 animate-pulse"></div>
                </div>
              </div>
              <div className="p-6 bg-black/80 flex gap-4 justify-center">
                <button 
                  onClick={stopCamera}
                  className="px-6 py-3 glass border border-gray-800 rounded-xl text-[10px] font-black uppercase text-gray-400"
                >
                  Cancel
                </button>
                <button 
                  onClick={capturePhoto}
                  className="px-8 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase shadow-xl shadow-red-600/20"
                >
                  Analyze Frame
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-32 h-32 rounded-full border-4 border-dashed border-red-600/30 flex items-center justify-center group relative cursor-pointer group-hover:border-red-600 transition-all bg-gray-950/50 shadow-inner">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileUpload} accept="image/*" disabled={analyzing} />
                {analyzing ? (
                  <i className="fas fa-spinner animate-spin text-4xl text-red-600"></i>
                ) : (
                  <i className="fas fa-barcode text-5xl text-gray-700 group-hover:text-red-500 group-hover:scale-110 transition-transform"></i>
                )}
              </div>
              <div className="space-y-4">
                <h3 className="font-black uppercase italic text-xl tracking-tighter">Audit Product</h3>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] leading-relaxed">
                  Upload label photo or <br /> Use camera for instant audit
                </p>
                <button 
                  onClick={startCamera}
                  className="w-full mt-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-[10px] font-black uppercase text-gray-400 hover:text-white hover:border-red-600 transition-all flex items-center justify-center gap-3"
                >
                  <i className="fas fa-camera"></i> Open Camera
                </button>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {result ? (
          <div className="glass rounded-[2.5rem] border border-gray-800 overflow-hidden flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 bg-gradient-to-br from-gray-900 to-black border-b border-gray-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase text-red-500 tracking-widest mb-1 block">Ripped City Rating</span>
                <h4 className="font-black italic uppercase text-2xl text-white">{result.productName || 'Analyzed Product'}</h4>
              </div>
              <div className="w-20 h-20 rounded-2xl bg-red-600 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                <span className="text-4xl font-black text-white">{result.rating}</span>
                <span className="text-[8px] font-black text-red-100 uppercase">/ 10</span>
              </div>
            </div>
            
            <div className="p-8 space-y-8 flex-1 overflow-y-auto">
              <div className="p-6 bg-red-600/5 border-l-4 border-l-red-600 border border-red-900/20 rounded-xl">
                <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <i className="fas fa-gavel"></i> The Verdict
                </h4>
                <p className="text-sm font-bold text-gray-100 leading-relaxed italic">"{result.verdict}"</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase text-green-500 tracking-widest flex items-center gap-2">
                    <i className="fas fa-circle-check"></i> Pros
                  </h5>
                  <ul className="space-y-2">
                    {result.pros?.map((p: string, i: number) => (
                      <li key={i} className="text-xs text-gray-400 font-bold">• {p}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black uppercase text-red-500 tracking-widest flex items-center gap-2">
                    <i className="fas fa-circle-exclamation"></i> Cons
                  </h5>
                  <ul className="space-y-2">
                    {result.cons?.map((c: string, i: number) => (
                      <li key={i} className="text-xs text-gray-400 font-bold">• {c}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-5 bg-gray-950 rounded-2xl border border-gray-800 group hover:border-blue-600/50 transition-all">
                <p className="text-[9px] font-black text-blue-500 uppercase mb-2 tracking-widest">Specialist Advice</p>
                <p className="text-xs text-gray-300 italic leading-relaxed font-bold">"{result.expertAdvice}"</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center opacity-20 h-full">
            <i className="fas fa-magnifying-glass-plus text-7xl mb-6"></i>
            <h3 className="text-xl font-black italic uppercase tracking-widest">Awaiting Visual Link</h3>
            <p className="max-w-xs text-[10px] font-black uppercase mt-4 leading-relaxed tracking-widest">Identify label metadata to trigger <br /> biological audit protocol</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductScanner;
