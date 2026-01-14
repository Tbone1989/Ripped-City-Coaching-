
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
      alert("Landing page settings synchronized. Public site updated.");
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
    <div className="p-4 md:p-8 space-y-12 animate-in fade-in duration-700 max-w-6xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-800 pb-8 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">Landing Page Master Settings</h2>
          <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">DIRECT CONTENT MANAGEMENT SYSTEM</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-2xl shadow-red-600/30 flex items-center justify-center gap-3"
        >
          {isSaving ? <i className="fas fa-spinner animate-spin"></i> : <i className="fas fa-save"></i>}
          Push Changes to Live Site
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Hero Section Editing */}
        <section className="space-y-8">
          <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-lg font-black italic uppercase mb-8 border-b border-gray-800 pb-4 flex items-center gap-2">
              <i className="fas fa-image text-red-500"></i> Hero Section
            </h3>
            <div className="space-y-6">
              <div>
                <label className={labelStyles}>Main Headline</label>
                <textarea 
                  value={localContent.heroTitle} 
                  onChange={e => setLocalContent({...localContent, heroTitle: e.target.value})}
                  className={`${inputStyles} h-24`}
                />
              </div>
              <div>
                <label className={labelStyles}>Narrative Subtitle</label>
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

          <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-lg font-black italic uppercase mb-8 border-b border-gray-800 pb-4 flex items-center gap-2">
              <i className="fas fa-retweet text-red-500"></i> Transformation Proof
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-lg font-black italic uppercase mb-8 border-b border-gray-800 pb-4 flex items-center gap-2">
              <i className="fas fa-list-check text-red-500"></i> Methodology Pillars
            </h3>
            <div className="space-y-8">
              {localContent.methodology.map((m, i) => (
                <div key={i} className="p-4 bg-gray-950 rounded-2xl border border-gray-800">
                  <div className="flex gap-4 mb-4">
                     <div className="flex-1">
                        <label className={labelStyles}>Step {i+1} Title</label>
                        <input value={m.title} onChange={e => updateMethodology(i, 'title', e.target.value)} className={inputStyles} />
                     </div>
                     <div className="w-24">
                        <label className={labelStyles}>FA Icon</label>
                        <input value={m.icon} onChange={e => updateMethodology(i, 'icon', e.target.value)} className={inputStyles} />
                     </div>
                  </div>
                  <label className={labelStyles}>Pillar Description</label>
                  <textarea value={m.text} onChange={e => updateMethodology(i, 'text', e.target.value)} className={`${inputStyles} h-20 resize-none`} />
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6 md:p-8 rounded-[2.5rem] border border-gray-800">
            <h3 className="text-lg font-black italic uppercase mb-8 border-b border-gray-800 pb-4 flex items-center gap-2">
              <i className="fas fa-quote-left text-red-500"></i> Social Proof
            </h3>
            <div className="space-y-8">
              {localContent.testimonials.map((t, i) => (
                <div key={i} className="p-4 bg-gray-950 rounded-2xl border border-gray-800">
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                     <div className="flex-1">
                        <label className={labelStyles}>Subject Name</label>
                        <input value={t.name} onChange={e => updateTestimonial(i, 'name', e.target.value)} className={inputStyles} />
                     </div>
                     <div className="flex-1">
                        <label className={labelStyles}>Athlete Role</label>
                        <input value={t.role} onChange={e => updateTestimonial(i, 'role', e.target.value)} className={inputStyles} />
                     </div>
                  </div>
                  <label className={labelStyles}>Testimonial Body</label>
                  <textarea value={t.text} onChange={e => updateTestimonial(i, 'text', e.target.value)} className={`${inputStyles} h-20 resize-none`} />
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
