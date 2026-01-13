
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LandingPageProps {
  onJoin: () => void;
  onLogin: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onJoin, onLogin }) => {
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
      if (loginEmail.toLowerCase() === 'coach@rippedcity.com') {
        onLogin(UserRole.COACH);
      } else {
        onLogin(UserRole.CLIENT);
      }
      setIsLoggingIn(false);
    }, 1500);
  };

  const testimonials = [
    {
      name: "John D.",
      role: "Client",
      text: "Working with Tyrone completely changed my perspective on fitness. The custom plans were a game-changer, and the personal support was incredible. I lost 40 pounds and feel amazing!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
    },
    {
      name: "Sarah K.",
      role: "Client",
      text: "I've tried so many programs, but this is the first one that stuck. The combination of data-driven plans and genuine encouragement made all the difference. I'm stronger than I've ever been.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
      name: "Mike R.",
      role: "Client",
      text: "As someone with a busy schedule, the efficiency of this program was key. The workouts were tough but effective, and the meal plans were easy to follow. Highly recommend!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
    }
  ];

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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-[#030712]"></div>
        
        <div className="z-10 max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-900/30 bg-red-950/20 text-red-500 text-[10px] font-black uppercase tracking-widest mb-10">
            <i className="fas fa-fire-flame-curved animate-pulse"></i> V3.27 ELITE CORE ACTIVE
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black italic uppercase leading-[0.9] tracking-tighter mb-8">
            FORGE YOUR <br />
            <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.3)]">LEGACY</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            Elite performance coaching built for competitive athletes. Proven methodologies. Guaranteed evolution.
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
          <p className="text-gray-500 mb-20 max-w-2xl mx-auto">
            We don't do cookie-cutter plans. Our process is designed to adapt to your unique biology and lifestyle.
          </p>

          <div className="space-y-16">
            {[
              { step: '1', title: 'ANALYZE', text: 'We start with a deep dive. Intake forms, bloodwork analysis, and lifestyle assessment to understand your starting point and metabolic health.', icon: 'fa-clipboard-list' },
              { step: '2', title: 'BLUEPRINT', text: 'You get a custom roadmap. Precision meal plans, progressive training blocks, and supplement protocols tailored to your specific biology.', icon: 'fa-hourglass-half' },
              { step: '3', title: 'EVOLVE', text: 'We execute and adjust. Bi-weekly check-ins, data-driven adjustments, and constant communication ensure you never plateau.', icon: 'fa-trophy' }
            ].map((m, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-6 animate-in fade-in duration-700">
                <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center text-2xl ${idx === 1 ? 'border-red-600 text-red-600' : 'border-gray-700 text-gray-400'}`}>
                  <i className={`fas ${m.icon}`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-black italic uppercase mb-2">{m.step}. {m.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List Section */}
      <section className="py-32 px-6 border-t border-gray-900 bg-gray-950/20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-none tracking-tighter">
                ELITE COACHING. <br />
                NO COMPROMISES.
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Most apps give you a PDF and wish you luck. Ripped City is a comprehensive ecosystem designed for one thing: <span className="text-white font-bold">Results.</span>
              </p>
              
              <ul className="space-y-6">
                {[
                  { title: 'Precision Nutrition', text: 'Macros calculated to the gram. Meal plans that fit your schedule, not generic templates.', icon: 'fa-utensils', color: 'text-red-500' },
                  { title: 'Bloodwork Analysis', text: 'We look under the hood. Optimize hormones, digestion, and longevity markers.', icon: 'fa-vial', color: 'text-blue-500' },
                  { title: 'Periodized Training', text: 'Phased training blocks (Hypertrophy, Strength, Peaking) to ensure continuous progression.', icon: 'fa-dumbbell', color: 'text-red-500' },
                  { title: '24/7 Access', text: 'Direct line to your coach. Questions answered, form checks reviewed, adjustments made.', icon: 'fa-comments', color: 'text-red-400' }
                ].map((f, i) => (
                  <li key={i} className="flex gap-4 group">
                    <div className={`mt-1 shrink-0 ${f.color}`}><i className={`fas ${f.icon}`}></i></div>
                    <div>
                      <h4 className="font-black italic uppercase text-sm">{f.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{f.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-800 group">
              <img 
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069" 
                alt="Gym" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto glass rounded-[2.5rem] p-12 md:p-16 border border-gray-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[100px]"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="bg-red-600 text-[10px] font-black uppercase px-3 py-1 rounded">Not ready to commit yet?</span>
              <h2 className="text-3xl font-black italic uppercase leading-none tracking-tighter">
                Get "The Gut Health <br /> Blueprint" Free
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Discover the 5 secrets to fixing your digestion, reducing bloat, and absorbing more nutrients from your food.
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-500 ml-4">Enter your email address</label>
                <input 
                  type="email"
                  placeholder="name@email.com"
                  className="w-full bg-white text-black p-5 rounded-xl font-bold outline-none focus:ring-4 focus:ring-red-600/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-widest rounded-xl transition-all">
                Send My Free Blueprint
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Story Section */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
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
            <p>
              My promise to you is simple: if you bring the determination, I will provide the roadmap.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 h-64 md:h-96">
            <div className="relative rounded-2xl overflow-hidden border border-gray-800">
              <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070" className="w-full h-full object-cover grayscale" alt="Before" />
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-[10px] font-black uppercase">Before</div>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
              <img src="https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=2070" className="w-full h-full object-cover" alt="After" />
              <div className="absolute bottom-4 left-4 bg-red-600 px-3 py-1 rounded text-[10px] font-black uppercase">After</div>
            </div>
          </div>
        </div>
      </section>

      {/* Elite Transformations (Testimonials) */}
      <section className="py-32 px-6 bg-gray-950/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-center mb-16">ELITE TRANSFORMATIONS</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="glass p-8 rounded-2xl border border-gray-800 space-y-6 flex flex-col">
                <div className="flex items-center gap-4">
                  <img src={t.avatar} className="w-12 h-12 rounded-full border border-gray-700 bg-gray-900" alt={t.name} />
                  <div>
                    <h4 className="font-black text-sm">{t.name}</h4>
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
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    <i className="fas fa-eye"></i>
                  </button>
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
              <p className="text-[10px] text-center text-gray-600 uppercase font-black tracking-widest mt-4">
                Enter 'coach@rippedcity.com' for Coach privileges
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
