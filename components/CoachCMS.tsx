
import React, { useState } from 'react';
import { LandingPageContent } from '../types';

interface CoachCMSProps {
  content: LandingPageContent;
  onUpdate: (newContent: LandingPageContent) => void;
}

const CoachCMS: React.FC<CoachCMSProps> = ({ content, onUpdate }) => {
  const [localContent, setLocalContent] = useState<LandingPageContent>(content);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate(localContent);
      setIsSaving(false);
      alert("Website content successfully updated. Protocols synced.");
    }, 1000);
  };

  const updateMethodology = (index: number, field: string, value: string) => {
    const newMeth = [...localContent.methodology];
    newMeth[index] = { ...newMeth[index], [field]: value };
    setLocalContent({ ...localContent, methodology: newMeth });
  };

  const updateTestimonial = (index: number, field: string, value: string) => {
    const newTest = [...localContent.testimonials];
    newTest[index] = { ...newTest[index], [field]: value };
    setLocalContent({ ...localContent, testimonials: newTest });
  };

  const inputStyles = "w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-xs font-bold outline-none focus:border-red-600 transition-all text-gray-200";
  const labelStyles = "text-[10px] font-black uppercase text-gray-500 mb-2 block tracking-widest";

  return (
    <div className="p-8 space-y-12 animate-in fade-in duration-700 max-w-6xl mx-auto pb-32">
      <div className="flex justify-between items-end border-b border-gray-800 pb-8">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">Web Integrity Editor</h2>
          <p className="text-red-500 text-xs font-bold uppercase tracking-widest mt-1">COACH AUTHORIZATION REQUIRED</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-2xl shadow-red-600/30 flex items-center gap-3"
        >
          {isSaving ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-save"></i>}
          Push Content Update
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Hero Section Editing */}
        <section className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-lg font-black italic uppercase mb-8 border-b border-gray-800 pb-4">Hero Parameters</h3>
            <div className="space-y-6">
              <div>
                <label className={labelStyles}>Headline</label>
                <textarea 
                  value={localContent.heroTitle} 
                  onChange={e => setLocalContent({...localContent, heroTitle: e.target.value})}
                  className={`${inputStyles} h-24`}
                />
              </div>
              <div>
                <label className={labelStyles}>Subtitle Narrative</label>
                <textarea 
                  value={localContent.heroSubtitle} 
                  onChange={e => setLocalContent({...localContent, heroSubtitle: e.target.value})}
                  className={`${inputStyles} h-24`}
                />
              </div>
              <div>
                <label className={labelStyles}>Hero Background URL</label>
                <input 
                  value={localContent.heroImage} 
                  onChange={e => setLocalContent({...localContent, heroImage: e.target.value})}
                  className={inputStyles}
                />
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-lg font-black italic uppercase mb-8 border-b border-gray-800 pb-4">Transformation Evidence</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelStyles}>Before Image URL</label>
                <input 
                  value={localContent.beforeImage} 
                  onChange={e => setLocalContent({...localContent, beforeImage: e.target.value})}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>After Image URL</label>
                <input 
                  value={localContent.afterImage} 
                  onChange={e => setLocalContent({...localContent, afterImage: e.target.value})}
                  className={inputStyles}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Methodology & Testimonials */}
        <section className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-lg font-black italic uppercase mb-8 border-b border-gray-800 pb-4">Methodology Pillars</h3>
            <div className="space-y-8">
              {localContent.methodology.map((m, i) => (
                <div key={i} className="p-4 bg-gray-950 rounded-2xl border border-gray-800">
                  <div className="flex gap-4 mb-4">
                     <div className="flex-1">
                        <label className={labelStyles}>Step {i+1} Title</label>
                        <input value={m.title} onChange={e => updateMethodology(i, 'title', e.target.value)} className={inputStyles} />
                     </div>
                     <div className="w-20">
                        <label className={labelStyles}>Icon</label>
                        <input value={m.icon} onChange={e => updateMethodology(i, 'icon', e.target.value)} className={inputStyles} />
                     </div>
                  </div>
                  <label className={labelStyles}>Description</label>
                  <textarea value={m.text} onChange={e => updateMethodology(i, 'text', e.target.value)} className={`${inputStyles} h-20`} />
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-lg font-black italic uppercase mb-8 border-b border-gray-800 pb-4">Client Testimonials</h3>
            <div className="space-y-8">
              {localContent.testimonials.map((t, i) => (
                <div key={i} className="p-4 bg-gray-950 rounded-2xl border border-gray-800">
                  <div className="flex gap-4 mb-4">
                     <div className="flex-1">
                        <label className={labelStyles}>Name</label>
                        <input value={t.name} onChange={e => updateTestimonial(i, 'name', e.target.value)} className={inputStyles} />
                     </div>
                     <div className="flex-1">
                        <label className={labelStyles}>Role</label>
                        <input value={t.role} onChange={e => updateTestimonial(i, 'role', e.target.value)} className={inputStyles} />
                     </div>
                  </div>
                  <label className={labelStyles}>Feedback Text</label>
                  <textarea value={t.text} onChange={e => updateTestimonial(i, 'text', e.target.value)} className={`${inputStyles} h-20`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CoachCMS;
