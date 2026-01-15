
import React, { useState, useRef, useEffect } from 'react';
import { analyzeMealPhoto } from '../geminiService';
import { MealScanResult } from '../types';

const MealScanner: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MealScanResult | null>(null);
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
          alert("Could not access camera. Try using the upload option.");
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
      setImagePreview(reader.result as string);
      processImage(reader.result as string, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (base64: string, mimeType: string) => {
    setAnalyzing(true);
    try {
      const data = await analyzeMealPhoto(base64, 'Elite Conditioning', 'PRO', mimeType);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Neural audit failed. Ensure specimen image is clear.");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setResult(null);
    setImagePreview(null);
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700 max-w-6xl mx-auto pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">Metabolic Auditor</h2>
          <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">Direct Specimen Imaging Link</p>
        </div>
        {(result || imagePreview) && !analyzing && (
           <button 
            onClick={resetScanner}
            className="px-6 py-3 bg-red-600/10 border border-red-600/30 rounded-xl text-[10px] font-black uppercase text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-xl"
           >
             New Specimen
           </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Col: The Image */}
        <div className="glass p-4 md:p-6 rounded-[2.5rem] border border-gray-800 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px]">
          {isCameraActive ? (
            <div className="absolute inset-0 flex flex-col bg-black">
              <video ref={videoRef} autoPlay playsInline className="flex-1 object-cover" />
              <div className="p-6 bg-black/80 flex gap-4 justify-center">
                <button onClick={stopCamera} className="px-6 py-4 glass border border-gray-800 rounded-xl text-[10px] font-black uppercase text-gray-400">Cancel</button>
                <button onClick={capturePhoto} className="px-10 py-4 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase shadow-2xl shadow-red-600/30">Capture</button>
              </div>
            </div>
          ) : imagePreview ? (
            <div className="w-full h-full relative group animate-in zoom-in-95">
              <img src={imagePreview} alt="Captured Meal" className="w-full h-[400px] object-cover rounded-2xl transition-all duration-700" />
              <div className="absolute inset-0 border-4 border-red-600/20 rounded-2xl pointer-events-none"></div>
              {analyzing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                  <div className="w-full h-1 bg-red-600 animate-[scan_1.5s_ease-in-out_infinite] absolute top-0 left-0 right-0 opacity-50 shadow-[0_0_15px_#dc2626]"></div>
                  <i className="fas fa-microscope animate-spin text-5xl text-red-600"></i>
                  <p className="text-[12px] font-black text-white uppercase tracking-[0.3em]">Decoding Macros...</p>
                </div>
              )}
              {!analyzing && (
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-red-600/30 text-[10px] font-black text-red-500 uppercase tracking-widest">
                  Specimen Locked
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
                <h3 className="font-black uppercase italic text-2xl tracking-tighter text-white">Initialize Visual Audit</h3>
                <p className="text-[11px] text-gray-500 uppercase font-black tracking-widest leading-relaxed max-w-[260px] mx-auto">
                  Use your phone camera to capture <br /> meal details for biological breakdown
                </p>
                <div className="flex flex-col gap-3 w-full max-w-[280px] mx-auto mt-6">
                   <button onClick={startCamera} className="w-full py-5 bg-red-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-600/20">
                     <i className="fas fa-camera"></i> Live Lens capture
                   </button>
                   <div className="relative">
                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} accept="image/*" />
                     <button className="w-full py-5 bg-gray-900 border border-gray-800 rounded-2xl text-[12px] font-black uppercase text-gray-400 hover:text-white transition-all">
                       Photo Library
                     </button>
                   </div>
                </div>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Right Col: Results */}
        <div className="space-y-6">
          {result ? (
            <div className="glass rounded-[2.5rem] border border-gray-800 overflow-hidden flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-8 bg-gradient-to-br from-gray-900 to-black border-b border-gray-800 flex justify-between items-center">
                <div>
                  <h4 className="font-black italic uppercase text-red-500 text-sm tracking-widest">Synthesis Complete</h4>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Audit ID: RM-{Math.floor(Math.random()*9000+1000)}</p>
                </div>
                <div className="px-6 py-3 bg-gray-950 rounded-xl border border-gray-800 text-center">
                  <p className="text-3xl font-black italic text-white leading-none">{result.adherenceScore}%</p>
                  <p className="text-[9px] font-black text-gray-600 uppercase mt-1 tracking-tighter">INTEGRITY</p>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { l: 'PRO', v: result.estimatedMacros.protein + 'g', c: 'text-red-500' },
                    { l: 'CHO', v: result.estimatedMacros.carbs + 'g', c: 'text-blue-500' },
                    { l: 'FAT', v: result.estimatedMacros.fats + 'g', c: 'text-white' },
                    { l: 'KCAL', v: result.estimatedMacros.calories, c: 'text-yellow-500' }
                  ].map(m => (
                    <div key={m.l} className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-center">
                      <p className="text-[10px] text-gray-600 font-black uppercase mb-1">{m.l}</p>
                      <p className={`text-sm font-black ${m.c}`}>{m.v}</p>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-red-600/5 border-l-4 border-l-red-600 border border-red-900/20 rounded-xl">
                  <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-3">Architect Feedback</h4>
                  <p className="text-sm font-bold text-gray-300 leading-relaxed italic">"{result.specialistFeedback}"</p>
                </div>

                {result.smartSwap && (
                  <div className="p-6 bg-blue-600/5 border-l-4 border-l-blue-600 border border-blue-900/20 rounded-xl">
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">Molecular Upgrade</h4>
                    <p className="text-sm font-bold text-gray-300 leading-relaxed italic">"{result.smartSwap}"</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-4">
                   {result.ingredientsDetected.map((ing, i) => (
                     <span key={i} className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                       {ing}
                     </span>
                   ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center glass rounded-[2.5rem] border border-gray-800 border-dashed opacity-30">
              <i className="fas fa-dna text-7xl mb-6 text-gray-700"></i>
              <h3 className="text-2xl font-black italic uppercase tracking-widest text-white">Awaiting Intake</h3>
              <p className="max-w-xs text-[11px] font-bold uppercase mt-4 leading-relaxed tracking-[0.2em] text-gray-500">
                Provide visual specimen data <br /> to initiate neural metabolic audit
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

export default MealScanner;
