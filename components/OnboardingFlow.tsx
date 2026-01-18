
import React, { useState } from 'react';
import VoiceOnboarding from './VoiceOnboarding';
import { BiologicalSex } from '../types';
import { signupClient } from '../authService';

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
    setStep(2); 
  };

  const handleNext = async () => {
    if (step === 5) {
      setIsProcessing(true);
      try {
        // Create Firebase account with email and password
        const password = Math.random().toString(36).slice(-12) + 'Aa1!'; // Generate secure password
        await signupClient(formData.email, password, formData.fullName, formData);
        
        setTimeout(() => {
          setStep(6);
          setIsProcessing(false);
        }, 2000);
      } catch (error: any) {
        console.error('Signup error:', error);
        alert('Error creating account: ' + error.message);
        setIsProcessing(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(Math.max(1, step - 1));
  };

  const inputStyles = "w-full bg-[#111827] border border-gray-800 p-4 rounded-xl outline-none focus:border-red-600 transition-all font-bold text-gray-200 placeholder:text-gray-600";
  const labelStyles = "text-[10px] font-black uppercase text-gray-400 ml-1 mb-1 block tracking-wider";

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {showVoiceInduction && (
        <VoiceOnboarding onDataCaptured={handleVoiceData} onClose={() => setShowVoiceInduction(false)} />
      )}
      
      <div className="w-full max-w-xl z-10">
        {step < 6 && (
          <div className="relative glass bg-[#0a0f1c] rounded-[2rem] border border-gray-800 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="h-1.5 w-full bg-gray-900 flex">
              {[1, 2, 3, 4, 5].map(s => (
                <div key={s} className={`flex-1 h-full transition-all duration-700 ${step >= s ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'bg-transparent'}`}></div>
              ))}
            </div>

            <div className="p-10 flex flex-col min-h-[500px]">
              <button onClick={onCancel} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>

              <div className="mb-10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-red-500 tracking-widest block mb-1">Step {step} of 5</span>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                      {step === 1 && "THE BASICS"}
                      {step === 2 && "BIOLOGICAL METRICS"}
                      {step === 3 && "PERFORMANCE HISTORY"}
                      {step === 4 && "PROTOCOL AUDIT"}
                      {step === 5 && "SAFETY & CONFIRMATION"}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                {step === 1 && (
                  <div className="space-y-5">
                    <div>
                      <label className={labelStyles}>Full Name</label>
                      <input className={inputStyles} placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                    </div>
                    <div>
                      <label className={labelStyles}>Biological Sex</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.values(BiologicalSex).map(sex => (
                          <button
                            key={sex}
                            onClick={() => setFormData({...formData, biologicalSex: sex})}
                            className={`py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${
                              formData.biologicalSex === sex ? 'bg-red-600 border-red-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-500'
                            }`}
                          >
                            {sex}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <div>
                      <label className={labelStyles}>Known Food Allergens (CRITICAL)</label>
                      <input 
                        className="w-full bg-red-600/5 border border-red-900/40 p-4 rounded-xl text-red-400 font-bold outline-none focus:border-red-600" 
                        placeholder="e.g. Shellfish, Peanuts, Gluten" 
                        value={formData.allergens} 
                        onChange={e => setFormData({...formData, allergens: e.target.value})} 
                      />
                      <p className="text-[9px] text-red-900 font-black uppercase mt-1 italic">* REQUIRED FOR SAFETY-GATED PROTOCOL GENERATION</p>
                    </div>
                    <div>
                      <label className={labelStyles}>Current Supplements & Medications</label>
                      <textarea className={`${inputStyles} h-32 resize-none`} placeholder="List everything for interaction audit." value={formData.supplements} onChange={e => setFormData({...formData, supplements: e.target.value})} />
                    </div>
                  </div>
                )}
                {/* ... existing steps ... */}
              </div>

              <div className="mt-10 flex gap-4 pt-10 border-t border-gray-900">
                {step > 1 && (
                  <button onClick={handleBack} className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all">Back</button>
                )}
                <button onClick={handleNext} className={`flex-[2] py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all flex items-center justify-center gap-2`}>
                  {isProcessing ? <i className="fas fa-spinner animate-spin"></i> : (step === 5 ? "Submit Application" : "Continue")}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="glass bg-[#0a0f1c] rounded-[3rem] p-16 border border-gray-800 text-center space-y-10">
            <div className="w-24 h-24 bg-green-600/10 rounded-full flex items-center justify-center text-green-500 text-5xl mx-auto border border-green-600/20">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white">Application Received</h2>
            <button onClick={onComplete} className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-[0.2em] text-xl rounded-2xl shadow-2xl shadow-red-600/30">Enter Command Center</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
