
import React, { useState } from 'react';
import { UserRole, LandingPageContent } from '../types';

interface LandingPageProps {
  onJoin: () => void;
  onLogin: (role: UserRole) => void;
  content: LandingPageContent;
}

const LandingPage: React.FC<LandingPageProps> = ({ onJoin, onLogin, content }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');

  const handlePortalAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;

    setIsLoggingIn(true);
    
    // Simulate authentication delay
    setTimeout(() => {
      // COACH ACCESS GATED BY SPECIFIC EMAIL
      if (loginEmail.toLowerCase() === 'coach@rippedcity.com') {
        onLogin(UserRole.COACH);
      } else {
        onLogin(UserRole.CLIENT);
      }
      setIsLoggingIn(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-red-600">
      {/* Navbar Brand */}
      <div className="absolute top-8 left-8 z-50">
        <h1 className="text-2xl font-black italic tracking-tighter flex items-center gap-1">
          RIPPED<span className="text-red-600">CITY</span>
        </h1>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 transition-all duration-1000"
          style={{ backgroundImage: `url('${content.heroImage}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-[#030712]"></div>
        
        <div className="z-10 max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-900/30 bg-red-950/20 text-red-500 text-[10px] font-black uppercase tracking-widest mb-10">
            <i className="fas fa-fire-flame-curved animate-pulse"></i> V3.27 ELITE CORE ACTIVE
          </div>
          
          <h1 className="text-7xl md:text-8xl font-black italic uppercase leading-[0.9] tracking-tighter mb-8 whitespace-pre-line">
            {content.heroTitle}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            {content.heroSubtitle}
          </p>
          
          <div className="flex flex-col gap-4 items-center">
            <button 
              onClick={onJoin}
              className="w-full max-w-sm py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-widest text-lg rounded-xl shadow-[0_10px_40px_rgba(220,38,38,0.4)] transition-all hover:scale-[1.02] active:scale-95"
            >
              Start Your Transformation
            </button>
            <button 
              onClick={() => document.getElementById('methodology')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full max-w-sm py-5 glass border border-gray-800 text-white font-black uppercase italic tracking-widest text-lg rounded-xl hover:bg-gray-800/50 transition-all"
            >
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-32 px-6 bg-[#030712]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
            THE RIPPED CITY <span className="text-red-600">METHODOLOGY</span>
          </h2>
          <p className="text-gray-500 mb-20 max-w-2xl mx-auto uppercase font-bold tracking-widest text-[10px]">
            Engineered Evolution for Superior Biology
          </p>

          <div className="grid md:grid-cols-3 gap-12">
            {content.methodology.map((m, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-6 animate-in fade-in duration-700">
                <div className={`w-20 h-20 rounded-3xl border-2 flex items-center justify-center text-2xl rotate-3 ${idx === 1 ? 'border-red-600 text-red-600 bg-red-600/5' : 'border-gray-700 text-gray-400'}`}>
                  <i className={`fas ${m.icon}`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-black italic uppercase mb-2">{m.step}. {m.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personal Story Section */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto space-y-10 text-center md:text-left">
          <h2 className="text-5xl font-black italic uppercase leading-none tracking-tighter text-red-500">
            From Rock Bottom <br /> to Ripped City
          </h2>
          <div className="space-y-6 text-gray-400 leading-relaxed font-medium">
            <p>
              When you look at me today—owner of Ripped City Inc, aspiring professional bodybuilder—you might assume I've always been fit.
            </p>
            <p>
              My journey began at 338 pounds. I was exhausted, emotionally drained, and medically at risk. Over the next year, I lost 97 pounds and gained mental clarity and purpose.
            </p>
            <p className="text-white italic font-bold text-lg">
              "It's better to suffer in the gym than to suffer in the hospital."
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 h-64 md:h-[500px]">
            <div className="relative rounded-2xl overflow-hidden border border-gray-800">
              <img src={content.beforeImage} className="w-full h-full object-cover grayscale" alt="Before" />
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-[10px] font-black uppercase">Subject 01: Baseline</div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
              <img src={content.afterImage} className="w-full h-full object-cover" alt="After" />
              <div className="absolute bottom-4 left-4 bg-red-600 px-3 py-1 rounded text-[10px] font-black uppercase">Subject 01: Current</div>
            </div>
          </div>
        </div>
      </section>

      {/* Elite Transformations (Testimonials) */}
      <section className="py-32 px-6 bg-gray-950/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-center mb-16">ELITE TESTIMONIALS</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {content.testimonials.map((t, i) => (
              <div key={i} className="glass p-8 rounded-2xl border border-gray-800 space-y-6 flex flex-col hover:border-red-600/30 transition-all group">
                <div className="flex items-center gap-4">
                  <img src={t.avatar} className="w-12 h-12 rounded-full border border-gray-700 bg-gray-900 grayscale group-hover:grayscale-0 transition-all" alt={t.name} />
                  <div>
                    <h4 className="font-black text-sm uppercase">{t.name}</h4>
                    <p className="text-[10px] font-black uppercase text-red-500">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm italic leading-relaxed">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Portal Section */}
      <section className="py-32 px-6 relative overflow-hidden" id="login">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[80%] bg-gradient-to-t from-red-600/10 to-transparent blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-md mx-auto relative z-10">
          <form 
            onSubmit={handlePortalAccess}
            className="glass bg-gray-900/40 p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl"
          >
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-10">CLIENT LOGIN</h2>
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-500 ml-4">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full bg-[#111827] border border-gray-800 p-4 rounded-xl outline-none focus:border-red-600 transition-all font-bold text-gray-200"
                  placeholder="name@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-500 ml-4">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    required
                    className="w-full bg-[#111827] border border-gray-800 p-4 rounded-xl outline-none focus:border-red-600 transition-all font-bold text-gray-200 pr-12"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-5 bg-red-600 hover:bg-red-700 disabled:bg-gray-800 text-white font-black uppercase italic tracking-widest text-lg rounded-xl transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-3"
              >
                {isLoggingIn ? (
                  <>
                    <i className="fas fa-circle-notch animate-spin"></i>
                    Authorizing...
                  </>
                ) : (
                  "Access Portal"
                )}
              </button>
              <p className="text-[9px] text-center text-gray-600 uppercase font-black tracking-widest mt-6 italic">
                * END-TO-END BIOLOGICAL ENCRYPTION ACTIVE
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-gray-900 bg-[#030712] text-center space-y-8">
        <h1 className="text-4xl font-black italic tracking-tighter">
          RIPPED<span className="text-red-600">CITY</span>
        </h1>
        <div className="flex justify-center gap-8 text-2xl text-gray-500">
          <a href="#" className="hover:text-red-600 transition-colors"><i className="fab fa-tiktok"></i></a>
          <a href="#" className="hover:text-red-600 transition-colors"><i className="fab fa-instagram"></i></a>
        </div>
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
          © 2026 Ripped City Inc. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
