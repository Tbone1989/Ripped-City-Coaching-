import React, { useState, useRef, useEffect } from 'react';
import { analyzeMealPhoto } from '../geminiService';
import { MealScanResult } from '../types';

const MealScanner: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MealScanResult | null>(null);
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

  const startCamera = () => {
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
          alert("Could not access camera. Please check permissions.");
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
      // Assume BEGINNER tier for this view as default for general support
      const data = await analyzeMealPhoto(base64, 'Healthier Foundations', 'BEGINNER', mimeType);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing meal. Try a clearer photo.");
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Metabolic Auditor</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Real-time Nutritional Integrity Scan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2.5rem] border border-gray-800 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden min-h-[400px]">
          {isCameraActive ? (
            <div className="absolute inset-0 flex flex-col bg-black">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="flex-1 object-cover"
              />
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
                  Capture Meal
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-red-600/30 flex items-center justify-center group relative cursor-pointer hover:border-red-600 transition-all">
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileUpload} accept="image/*" disabled={analyzing} />
                <i className={`fas ${analyzing ? 'fa-spinner animate-spin' : 'fa-camera'} text-3xl text-gray-600 group-hover:text-red-500`}></i>
              </div>
              <div className="space-y-4">
                <h3 className="font-black uppercase italic text-lg tracking-tighter">Capture Frame</h3>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Snap a photo or upload meal <br /> for supportive review</p>
                <button 
                  onClick={startCamera}
                  className="w-full py-4 bg-gray-950 border border-gray-800 rounded-2xl text-[10px] font-black uppercase text-gray-400 hover:text-white transition-all flex items-center justify-center gap-3"
                >
                  <i className="fas fa-video"></i> Use Live Camera
                </button>
              </div>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {result ? (
          <div className="glass rounded-[2.5rem] border border-gray-800 overflow-hidden flex flex-col animate-in slide-in-from-right duration-500">
            <div className="p-8 bg-red-600/5 border-b border-gray-800">
              <div className="flex justify-between items-center">
                <h4 className="font-black italic uppercase text-red-500">Scan Summary</h4>
                <div className="px-3 py-1 bg-gray-950 rounded text-xl font-black">{result.adherenceScore}% <span className="text-[10px] text-gray-500">SCORE</span></div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-[8px] font-black text-gray-500 uppercase">Protein</p>
                  <p className="font-black text-white">{result.estimatedMacros.protein}g</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] font-black text-gray-500 uppercase">Carbs</p>
                  <p className="font-black text-white">{result.estimatedMacros.carbs}g</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] font-black text-gray-500 uppercase">Fats</p>
                  <p className="font-black text-white">{result.estimatedMacros.fats}g</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] font-black text-gray-500 uppercase">Energy</p>
                  <p className="font-black text-red-500">{result.estimatedMacros.calories}</p>
                </div>
              </div>

              {result.smartSwap && (
                <div className="p-6 bg-blue-600/10 border-l-4 border-l-blue-500 border border-blue-900/20 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <i className="fas fa-arrows-rotate text-3xl"></i>
                  </div>
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <i className="fas fa-lightbulb"></i> The Level-Up Swap
                  </h4>
                  <p className="text-sm font-bold text-gray-100 leading-relaxed italic">
                    "{result.smartSwap}"
                  </p>
                </div>
              )}

              <div className="p-4 bg-gray-950 rounded-xl border border-gray-800">
                <p className="text-[9px] font-black text-red-500 uppercase mb-2">Specialist Guide</p>
                <p className="text-xs text-gray-300 italic leading-relaxed">"{result.specialistFeedback}"</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-12 text-center opacity-20 h-full">
            <div className="space-y-4">
              <i className="fas fa-utensils text-6xl"></i>
              <p className="text-xs font-black uppercase tracking-widest leading-loose">Waiting for visual <br /> data stream...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealScanner;
