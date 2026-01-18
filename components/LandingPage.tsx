import React, { useState } from 'react';
import { UserRole } from '../types';
import { loginWithSecretKey, loginClient } from '../authService';

interface LandingPageProps {
  onJoin: () => void;
  onLogin: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onJoin, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  
  // Hidden coach login state
  const [showCoachLogin, setShowCoachLogin] = useState(false);
  const [coachSecret, setCoachSecret] = useState('');
  const [copyrightClicks, setCopyrightClicks] = useState(0);

  // Handle copyright click for hidden coach login
  const handleCopyrightClick = () => {
    const newCount = copyrightClicks + 1;
    setCopyrightClicks(newCount);
    
    if (newCount >= 5) {
      setShowCoachLogin(true);
      setCopyrightClicks(0);
    }
    
    // Reset counter after 3 seconds
    setTimeout(() => setCopyrightClicks(0), 3000);
  };

  // Coach login with secret key
  const handleCoachLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');
    
    try {
      await loginWithSecretKey(coachSecret);
      onLogin(UserRole.COACH);
    } catch (err: any) {
      setError(err.message || 'Invalid secret key');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Client login with email/password
  const handlePortalAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError('Please enter email and password');
      return;
    }

    setIsLoggingIn(true);
    setError('');
    
    try {
      const { role } = await loginClient(loginEmail, loginPassword);
      onLogin(role);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
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

      {/* Hidden Coach Login Modal */}
      {showCoachLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="glass rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => {
                setShowCoachLogin(false);
                setCoachSecret('');
                setError('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/20 mb-4">
                <i className="fas fa-shield-halved text-red-600 text-2xl"></i>
              </div>
              <h2 className="text-2xl font-black italic uppercase">Coach Access</h2>
              <p className="text-sm text-gray-400 mt-2">Enter secret key</p>
            </div>

            <form onSubmit={handleCoachLogin} className="space-y-4">
              <input
                type="password"
                value={coachSecret}
                onChange={(e) => setCoachSecret(e.target.value)}
                placeholder="Secret Key"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-red-600 text-white"
                autoFocus
              />
              
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-widest rounded-lg transition-all disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <>
                    <i className="fas fa-circle-notch animate-spin mr-2"></i>
                    Authorizing...
                  </>
                ) : (
                  "Access Dashboard"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-800 bg-gray-900/50 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <i className="fas fa-dna"></i> METHODOLOGY
            </div>
            <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter mb-6">
              HOW IT <span className="text-red-600">WORKS</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A systematic approach to elite performance. Every protocol is data-driven, every decision is strategic.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "fa-clipboard-check",
                title: "Assessment",
                desc: "Comprehensive analysis of your current state, goals, and biological markers."
              },
              {
                icon: "fa-chart-line",
                title: "Protocol Design",
                desc: "Custom training, nutrition, and recovery protocols tailored to your physiology."
              },
              {
                icon: "fa-trophy",
                title: "Execution & Evolution",
                desc: "Continuous monitoring, adjustment, and optimization until goals are achieved."
              }
            ].map((step, i) => (
              <div key={i} className="glass rounded-2xl p-8 text-center hover:border-red-900/50 transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/20 mb-6">
                  <i className={`fas ${step.icon} text-red-600 text-2xl`}></i>
                </div>
                <h3 className="text-xl font-black italic uppercase mb-4">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-[#030712]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-800 bg-gray-900/50 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <i className="fas fa-star"></i> TESTIMONIALS
            </div>
            <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter mb-6">
              PROVEN <span className="text-red-600">RESULTS</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="glass rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-black italic">{t.name}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Access */}
      <section className="py-32 px-6 bg-[#030712]">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-800 bg-gray-900/50 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6">
              <i className="fas fa-lock"></i> CLIENT PORTAL
            </div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">
              EXISTING <span className="text-red-600">CLIENTS</span>
            </h2>
            <p className="text-gray-400 text-sm">
              Access your dashboard, track progress, and communicate with your coach.
            </p>
          </div>

          <form onSubmit={handlePortalAccess} className="glass rounded-2xl p-8">
            <div className="space-y-4">
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-red-600 text-white"
              />
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-red-600 text-white"
              />
              
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase italic tracking-widest rounded-lg transition-all disabled:opacity-50"
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
        <p 
          onClick={handleCopyrightClick}
          className="text-[10px] font-bold text-gray-600 uppercase tracking-widest cursor-pointer hover:text-gray-500 transition-colors"
        >
          © 2026 Ripped City Inc. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
