
import React, { useState } from 'react';
import VoiceOnboarding from './VoiceOnboarding';
import { BiologicalSex } from '../types';

interface OnboardingFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVoiceInduction, setShowVoiceInduction] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    instagram: '',
    age: '',
    biologicalSex: BiologicalSex.MALE,
    bloodType: 'Unknown',
    weight: '',
    height: '',
    experience: 'Beginner (0-1 Years)',
    goal: '',
    struggle: '',
    supplements: '',
    pharmacology: '',
    healthConditions: '',
    injuries: '',
    allergens: '',
    commitment: 10
  });

  const handleVoiceData = (voiceData: any) => {
    setFormData(prev => ({ ...prev, ...voiceData }));
    setShowVoiceInduction(false);
    // Move to step 2 after voice input
    setStep(2); 
  };

  const handleNext = () => {
    if (step === 5) {
      setIsProcessing(true);
      setTimeout(() => {
        setStep(6);
        setIsProcessing(false);
      }, 3500);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(Math.max(1, step - 1));
  };

  const inputStyles = "w-full bg-[#111827] border border-gray-800 p-4 rounded-xl outline-none focus:border-red-600 transition-all font-bold text-gray-200 placeholder:text-gray-600 text-sm";
  const labelStyles = "text-[10px] font-black uppercase text-gray-400 ml-1 mb-2 block tracking-wider";

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4 relative overflow-hidden font-inter">
      {showVoiceInduction && (
        <VoiceOnboarding onDataCaptured={handleVoiceData} onClose={() => setShowVoiceInduction(false)} />
      )}
      
      <div className="w-full max-w-2xl z-10">
        {step < 6 && (
          <div className="relative glass bg-[#0a0f1c] rounded-[2rem] border border-gray-800 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-gray-900 flex">
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s} className={`flex-1 h-full transition-all duration-700 ${step >= s ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-transparent'}`}></div>
              ))}
            </div>

            <div className="p-8 md:p-12 flex flex-col min-h-[600px]">
              <button onClick={onCancel} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>

              <div className="mb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-red-500 tracking-widest block mb-1">Step {step} of 5</span>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                      {step === 1 && "IDENTITY & CONTACT"}
                      {step === 2 && "BIOMETRIC MATRIX"}
                      {step === 3 && "PERFORMANCE HISTORY"}
                      {step === 4 && "CLINICAL AUDIT"}
                      {step === 5 && "SAFETY & CONFIRMATION"}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                {/* STEP 1: BASICS */}
                {step === 1 && (
                  <div className="space-y-5 animate-in slide-in-from-right duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyles}>Full Name</label>
                            <input className={inputStyles} placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelStyles}>Instagram Handle</label>
                            <input className={inputStyles} placeholder="@username" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelStyles}>Email Address</label>
                            <input className={inputStyles} type="email" placeholder="name@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelStyles}>Phone Number</label>
                            <input className={inputStyles} type="tel" placeholder="(555) 000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                    </div>
                    <button 
                      onClick={() => setShowVoiceInduction(true)}
                      className="w-full py-4 mt-2 border border-dashed border-red-600/30 rounded-xl text-red-500 text-[10px] font-black uppercase hover:bg-red-600/5 transition-all flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-microphone"></i> Use Voice Auto-Fill
                    </button>
                  </div>
                )}

                {/* STEP 2: BIOMETRICS */}
                {step === 2 && (
                  <div className="space-y-6 animate-in slide-in-from-right duration-300">
                    <div>
                        <label className={labelStyles}>Biological Sex</label>
                        <div className="grid grid-cols-2 gap-3">
                        {Object.values(BiologicalSex).map(sex => (
                            <button
                            key={sex}
                            onClick={() => setFormData({...formData, biologicalSex: sex})}
                            className={`py-4 rounded-xl border text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${
                                formData.biologicalSex === sex ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20' : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'
                            }`}
                            >
                            <i className={`fas ${sex === BiologicalSex.MALE ? 'fa-mars' : sex === BiologicalSex.FEMALE ? 'fa-venus' : 'fa-genderless'}`}></i>
                            {sex}
                            </button>
                        ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className={labelStyles}>Age</label>
                            <input className={inputStyles} type="number" placeholder="25" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelStyles}>Height (cm)</label>
                            <input className={inputStyles} type="number" placeholder="180" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelStyles}>Weight (kg)</label>
                            <input className={inputStyles} type="number" placeholder="85" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className={labelStyles}>Blood Type (Optional)</label>
                        <select 
                            className={inputStyles}
                            value={formData.bloodType} 
                            onChange={e => setFormData({...formData, bloodType: e.target.value})}
                        >
                            <option>Unknown</option>
                            <option>A+</option>
                            <option>A-</option>
                            <option>B+</option>
                            <option>B-</option>
                            <option>AB+</option>
                            <option>AB-</option>
                            <option>O+</option>
                            <option>O-</option>
                        </select>
                    </div>
                  </div>
                )}

                {/* STEP 3: PERFORMANCE */}
                {step === 3 && (
                    <div className="space-y-5 animate-in slide-in-from-right duration-300">
                        <div>
                            <label className={labelStyles}>Experience Level</label>
                            <select 
                                className={inputStyles}
                                value={formData.experience} 
                                onChange={e => setFormData({...formData, experience: e.target.value})}
                            >
                                <option>Beginner (0-1 Years)</option>
                                <option>Intermediate (1-3 Years)</option>
                                <option>Advanced (3-5 Years)</option>
                                <option>Elite (5+ Years)</option>
                                <option>Pro (Competitor)</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelStyles}>Primary Objective</label>
                            <input className={inputStyles} placeholder="e.g. Stage-Ready Lean, Strength Peak..." value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} />
                        </div>
                        <div>
                            <label className={labelStyles}>Current Friction Point</label>
                            <textarea className={`${inputStyles} h-24 resize-none`} placeholder="What is currently stopping your progress? (e.g. Diet adherence, Injury, Fatigue)" value={formData.struggle} onChange={e => setFormData({...formData, struggle: e.target.value})} />
                        </div>
                        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                            <label className={labelStyles}>Commitment Level ({formData.commitment}/10)</label>
                            <input 
                                type="range" 
                                min="1" 
                                max="10" 
                                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600 mt-2"
                                value={formData.commitment} 
                                onChange={e => setFormData({...formData, commitment: parseInt(e.target.value)})} 
                            />
                            <div className="flex justify-between text-[8px] font-black uppercase text-gray-500 mt-2 tracking-widest">
                                <span>Casual</span>
                                <span>Unstoppable</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: PROTOCOL AUDIT */}
                {step === 4 && (
                  <div className="space-y-5 animate-in slide-in-from-right duration-300">
                    <div>
                      <label className={labelStyles}>Known Food Allergens (CRITICAL)</label>
                      <input 
                        className="w-full bg-red-600/5 border border-red-900/40 p-4 rounded-xl text-red-400 text-sm font-bold outline-none focus:border-red-600 placeholder:text-red-900/50" 
                        placeholder="e.g. Shellfish, Peanuts, Gluten" 
                        value={formData.allergens} 
                        onChange={e => setFormData({...formData, allergens: e.target.value})} 
                      />
                      <p className="text-[8px] text-red-500 font-black uppercase mt-1.5 flex items-center gap-1">
                        <i className="fas fa-triangle-exclamation"></i> REQUIRED FOR SAFETY-GATED PROTOCOL GENERATION
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                           <label className={labelStyles}>Current Stack / Meds</label>
                           <textarea className={`${inputStyles} h-32 resize-none`} placeholder="Supplements, medications, PEDs..." value={formData.supplements} onChange={e => setFormData({...formData, supplements: e.target.value})} />
                        </div>
                        <div>
                           <label className={labelStyles}>Injury History</label>
                           <textarea className={`${inputStyles} h-32 resize-none`} placeholder="Current or past injuries affecting movement..." value={formData.injuries} onChange={e => setFormData({...formData, injuries: e.target.value})} />
                        </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: CONFIRMATION */}
                {step === 5 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <div className="p-6 bg-red-600/5 border border-red-900/30 rounded-2xl">
                            <h3 className="text-sm font-black uppercase text-white mb-4">Master Architect Review</h3>
                            <div className="space-y-3 text-xs text-gray-400">
                                <p><span className="text-red-500 font-black uppercase mr-2">Subject:</span> {formData.fullName}</p>
                                <p><span className="text-red-500 font-black uppercase mr-2">Objective:</span> {formData.goal}</p>
                                <p><span className="text-red-500 font-black uppercase mr-2">Biological Status:</span> {formData.age}y / {formData.biologicalSex} / {formData.weight}kg</p>
                                <p><span className="text-red-500 font-black uppercase mr-2">Critical Alerts:</span> {formData.allergens || "None Detected"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-gray-900 rounded-xl border border-gray-800">
                             <input type="checkbox" className="mt-1 accent-red-600 w-4 h-4" />
                             <p className="text-[10px] text-gray-500 leading-relaxed">
                                I confirm that I am medically cleared for high-intensity physical activity and understand that Ripped City is a performance optimization tool, not a medical provider.
                             </p>
                        </div>
                    </div>
                )}
              </div>

              <div className="mt-10 flex gap-4 pt-8 border-t border-gray-800/50">
                {step > 1 && (
                  <button onClick={handleBack} className="flex-1 py-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 font-black uppercase tracking-widest text-xs rounded-xl transition-all">Back</button>
                )}
                <button 
                    onClick={handleNext} 
                    className={`flex-[2] py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20`}
                >
                  {isProcessing ? <i className="fas fa-spinner animate-spin"></i> : (step === 5 ? "Initialize Protocol" : "Continue")}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="glass bg-[#0a0f1c] rounded-[3rem] p-16 border border-gray-800 text-center space-y-10 animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-green-600/10 rounded-full flex items-center justify-center text-green-500 text-5xl mx-auto border border-green-600/20 shadow-[0_0_40px_rgba(22,163,74,0.2)]">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-white">Application Received</h2>
                <p className="text-gray-500 uppercase font-black tracking-widest text-xs">Your biological blueprint is being generated.</p>
            </div>
            <button onClick={onComplete} className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-[0.2em] text-lg rounded-2xl shadow-2xl shadow-red-600/30 transition-all hover:scale-[1.02]">Enter Command Center</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
