import React, { useState } from 'react';
import { analyzeBloodwork } from '../geminiService';
import { BloodMarker } from '../types';

const HealthSuite: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<{ markers: BloodMarker[], summary: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const data = await analyzeBloodwork(base64String, file.type || 'image/png');
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: OCR & Upload */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6 rounded-xl border border-gray-800">
            <h3 className="font-black italic uppercase tracking-wider mb-4 flex items-center gap-2">
              <i className="fas fa-vial text-red-600"></i> Biomarker Extraction
            </h3>
            <p className="text-xs text-gray-500 mb-6">Upload clinical laboratory reports (PDF/JPG) for AI processing and performance mapping.</p>
            
            <div className="relative h-48 border-2 border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center group hover:border-red-600/50 transition-colors bg-gray-900/50">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileUpload}
                accept="image/*"
              />
              <i className={`fas ${analyzing ? 'fa-spinner animate-spin' : 'fa-cloud-arrow-up'} text-3xl mb-4 text-gray-600 group-hover:text-red-500`}></i>
              <p className="text-[10px] font-black uppercase text-gray-400">
                {analyzing ? 'Processing Matrix...' : 'Drop Report Here'}
              </p>
            </div>
          </div>

          <div className="glass p-6 rounded-xl border border-blue-600/20 bg-blue-600/5">
            <h3 className="font-black italic uppercase tracking-wider mb-4 flex items-center gap-2 text-blue-500">
              <i className="fas fa-calendar-check"></i> Donation Schedule
            </h3>
            <div className="flex justify-between items-center p-3 bg-gray-950 rounded border border-gray-800">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black">Last Whole Blood</p>
                <p className="font-bold">42 Days Ago</p>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-blue-600 flex items-center justify-center text-[10px] font-black">
                82%
              </div>
            </div>
            <p className="text-[10px] text-blue-400 font-bold mt-4 uppercase">Recommended next visit: 14 Days</p>
          </div>
        </div>

        {/* Right Panel: Analysis Display */}
        <div className="lg:col-span-2 glass rounded-xl border border-gray-800 overflow-hidden min-h-[600px] flex flex-col">
          {results ? (
            <div className="flex-1 flex flex-col animate-in fade-in duration-500">
              <div className="p-6 border-b border-gray-800 bg-gray-900/30">
                <h4 className="font-black italic uppercase tracking-widest text-lg">Biochemical Status Report</h4>
                <div className="mt-4 p-4 glass rounded-lg border-l-4 border-blue-500">
                  <p className="text-xs font-bold leading-relaxed text-gray-300">{results.summary}</p>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.markers.map((marker, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-900 rounded border border-gray-800">
                      <div>
                        <p className="text-[10px] font-black uppercase text-gray-500">{marker.name}</p>
                        <p className="font-bold text-lg">{marker.value} <span className="text-[10px] font-normal text-gray-500">{marker.unit}</span></p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                          marker.status === 'OPTIMAL' ? 'bg-green-600/10 text-green-500' :
                          marker.status === 'NORMAL' ? 'bg-blue-600/10 text-blue-500' :
                          'bg-red-600/10 text-red-500'
                        }`}>
                          {marker.status}
                        </span>
                        <p className="text-[8px] text-gray-600 font-bold mt-1">REF: {marker.range}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
              <i className="fas fa-microscope text-7xl mb-6"></i>
              <h3 className="text-xl font-black italic uppercase tracking-widest">Awaiting Diagnostic Data</h3>
              <p className="max-w-md text-sm font-bold uppercase mt-2">Upload your latest bloodwork to unlock AI optimization insights and hazard detection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthSuite;