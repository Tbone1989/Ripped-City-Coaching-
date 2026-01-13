
import React, { useState } from 'react';
import { ProgressPhoto } from '../types';
import { analyzePhysiquePhoto } from '../geminiService';

const ProgressPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([
    { 
      id: '1', 
      url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=2070', 
      date: '2023-11-15', 
      phase: 'Late Prep',
      systemAnalysis: 'Vascularity in peripheral limbs is peaking. Subcutaneous water levels in the lower lumbar region are minimal. Muscle density in deltoid-tricep tie-ins shows optimal separation.'
    },
    { 
      id: '2', 
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070', 
      date: '2023-10-15', 
      phase: 'Mid Prep' 
    }
  ]);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      try {
        const analysis = await analyzePhysiquePhoto(base64String, 'Current Phase');
        const newPhoto: ProgressPhoto = {
          id: Date.now().toString(),
          url: reader.result as string,
          date: new Date().toISOString().split('T')[0],
          phase: 'Current Phase',
          systemAnalysis: analysis
        };
        setPhotos([newPhoto, ...photos]);
      } catch (err) {
        console.error(err);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Evolution Log</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Visual Tracking & Structural Integrity Scan</p>
        </div>
        <div className="relative">
          <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer" 
            onChange={handleUpload}
            accept="image/*"
            disabled={analyzing}
          />
          <button className={`px-8 py-4 bg-red-600 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all flex items-center gap-3 shadow-xl shadow-red-600/20 ${analyzing ? 'opacity-50' : 'hover:bg-red-700'}`}>
            {analyzing ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-camera"></i>}
            Log Progress Update
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {photos.map(photo => (
          <div key={photo.id} className="glass rounded-[2.5rem] border border-gray-800 overflow-hidden flex flex-col md:flex-row h-full">
            <div className="md:w-1/2 aspect-[3/4] overflow-hidden">
              <img src={photo.url} alt="Progress" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="md:w-1/2 p-8 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">{photo.phase}</p>
                  <h3 className="text-xl font-black text-white">{photo.date}</h3>
                </div>
                <button className="text-gray-600 hover:text-red-500 transition-colors"><i className="fas fa-ellipsis-v"></i></button>
              </div>

              <div className="flex-1 space-y-4">
                <div className="p-4 bg-gray-900/50 rounded-2xl border border-gray-800">
                  <p className="text-[9px] font-black uppercase text-gray-500 mb-2">Structural Specialist Analysis</p>
                  <p className="text-xs text-gray-300 leading-relaxed italic">
                    {photo.systemAnalysis || "Scan pending... Log detailed image for structural breakdown."}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between items-center">
                <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-[8px] font-black text-gray-500 uppercase">Analysis Verified</span>
                </div>
                <button className="text-[10px] font-black uppercase text-gray-400 hover:text-white transition-colors">Compare View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressPhotos;
