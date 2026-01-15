
import React, { useState, useRef, useEffect } from 'react';
import { analyzeProductLabel } from '../geminiService';
import { ExperienceTier } from '../types';

const ProductScanner: React.FC<{ tier: ExperienceTier }> = ({ tier }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
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

  const startCamera = () => {
    setIsCameraActive(true);
    setResult(null);
    setImagePreview(null);
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
          alert("Could not access camera. Try the upload option.");
          setIsCameraActive(false);
        }
      }
    }
    initCamera();
    return () => { active = false; };
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
      setImagePreview(base64String);
      processImage(base64String, 'image/jpeg');
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      processImage(base64, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64: string, mimeType: string) => {
    setAnalyzing(true);
    try {
      // Cleaning the base64 string before sending
      const data = await analyzeProductLabel(base64, tier, mimeType);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Fuel Audit failed. Ensure label is well-lit and legible.");
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setImagePreview(null);
    setIsCameraActive(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">Fuel Auditor</h2>
          <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">Supplement & Nutrition Label Integrity Scan</p>
        </div>
        {(result || imagePreview) && !analyzing && (
           <button 
            onClick={reset}
            className="px-6 py-3 bg-red-600/10 border border-red-600/30 rounded-xl text-[10px] font-black uppercase text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-xl"
           >
             New Audit
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Specimen View */}
        <div className="glass p-4 md:p-6 rounded-[2.5rem] border border-gray-800 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px]">
          {isCameraActive ? (
            <div className="absolute inset-0 flex flex-col bg-black">
              <video ref={videoRef} autoPlay playsInline className="flex-1 object-cover" />
              {/* Overlay targeting frame */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-64 h-80 border-2 border-dashed border-red-600/50 rounded-2xl"></div>
              </div>
              <div className="p-6 bg-black/80 flex gap-4 justify-center z-10">
                <button onClick={stopCamera} className="px-6 py-4 glass border border-gray-800 rounded-xl text-[10px] font-black uppercase text-gray-400">Cancel</button>
                <button onClick={capturePhoto} className="px-10 py-4 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase shadow-2xl shadow-red-600/30">Scan Label</button>
              </div>
            </div>
          ) : imagePreview ? (
            <div className="w-full h-full relative group animate-in zoom-in-95">
              <img src={imagePreview} alt="Product Specimen" className="w-full h-[500px] object-cover rounded-2xl transition-all duration-700" />
              <div className="absolute inset-0 border-4 border-red-600/20 rounded-2xl pointer-events-none"></div>
              
              {analyzing && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center space-y-6">
                  <div className="w-full h-1 bg-red-600 animate-[scan_2s_ease-in-out_infinite] absolute top-0 left-0 right-0 shadow-[0_0_20px_#dc2626]"></div>
                  <i className="fas fa-barcode animate-pulse text-6xl text-red-600"></i>
                  <p className="text-[12px] font-black text-white uppercase tracking-[0.4em]">Auditing Compound Integrity...</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="w-32 h-32 rounded-full border-4 border-dashed border-red-600/30 flex items-center justify-center group relative cursor-pointer hover:border-red-600 transition-all bg-gray-950/30">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileUpload} accept="image/*" capture="environment" />
                <i className="fas fa-camera text-4xl text-gray-700 group-hover:text-red-500"></i>
              </div>
              <div className="space-y-4 mt-8">
                <h3 className="font-black uppercase italic text-2xl tracking-tighter text-white">Initialize Fuel Scan</h3>
                <p className="text-[11px] text-gray-500 uppercase font-black tracking-widest leading-relaxed max-w-[260px] mx-auto">
                  Audit supplement labels for amino spiking, <br /> proprietary blends, and low-quality fillers.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-[280px] mx-auto mt-8">
                   <button onClick={startCamera} className="w-full py-5 bg-red-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-600/20">
                     <i className="fas fa-camera"></i> Live Label Capture
                   </button>
                   <div className="relative">
                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} accept="image/*" />
                     <button className="w-full py-5 bg-gray-900 border border-gray-800 rounded-2xl text-[12px] font-black uppercase text-gray-400 hover:text-white transition-all">
                       Choose Photo
                     </button>
                   </div>
                </div>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Audit Results */}
        <div className="space-y-6">
          {result ? (
            <div className="glass rounded-[2.5rem] border border-gray-800 overflow-hidden flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-8 bg-gradient-to-br from-gray-900 to-black border-b border-gray-800 flex justify-between items-center">
                <div>
                  <h4 className="font-black italic uppercase text-red-500 text-sm tracking-widest">{result.productName}</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Audit Protocol: RC-F-882</p>
                </div>
                <div className="px-6 py-3 bg-gray-950 rounded-xl border border-gray-800 text-center">
                  <p className={`text-3xl font-black italic leading-none ${result.rating > 7 ? 'text-green-500' : result.rating > 4 ? 'text-yellow-500' : 'text-red-500'}`}>{result.rating}/10</p>
                  <p className="text-[9px] font-black text-gray-600 uppercase mt-1 tracking-tighter">INTEGRITY</p>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="p-6 bg-gray-950 border-l-4 border-l-red-600 border border-gray-800 rounded-r-xl">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3">Architect Verdict</p>
                  <p className="text-sm font-bold text-gray-200 leading-relaxed italic">"{result.verdict}"</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Technical Pros</h5>
                     <div className="space-y-2">
                       {result.pros.map((p: string, i: number) => (
                         <div key={i} className="flex gap-2 text-xs font-bold text-green-500">
                           <i className="fas fa-check-circle mt-1"></i>
                           <span>{p}</span>
                         </div>
                       ))}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Biological Hazards</h5>
                     <div className="space-y-2">
                       {result.cons.map((c: string, i: number) => (
                         <div key={i} className="flex gap-2 text-xs font-bold text-red-500">
                           <i className="fas fa-triangle-exclamation mt-1"></i>
                           <span>{c}</span>
                         </div>
                       ))}
                     </div>
                  </div>
                </div>

                <div className="p-6 bg-blue-600/5 border border-blue-900/20 rounded-2xl">
                   <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">Specialist Recommendation</h5>
                   <p className="text-xs text-gray-300 font-bold leading-relaxed italic">"{result.expertAdvice}"</p>
                </div>
                
                {result.allergenWarning && (
                  <div className="p-4 bg-red-600/20 border-2 border-red-600 rounded-xl flex items-center gap-4">
                    <i className="fas fa-skull-crossbones text-2xl text-red-500"></i>
                    <div>
                      <p className="text-[10px] font-black text-red-500 uppercase">CRITICAL ALLERGEN ALERT</p>
                      <p className="text-xs font-black text-white">{result.allergenWarning}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center glass rounded-[2.5rem] border border-gray-800 border-dashed opacity-30">
              <i className="fas fa-microchip text-7xl mb-6 text-gray-700"></i>
              <h3 className="text-2xl font-black italic uppercase tracking-widest text-white">Standby for Analysis</h3>
              <p className="max-w-xs text-[11px] font-bold uppercase mt-4 leading-relaxed tracking-[0.2em] text-gray-500">
                Submit pharmacological or nutritional <br /> label to initiate audit
              </p>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
};

export default ProductScanner;
