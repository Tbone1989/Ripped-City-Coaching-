import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { LandingPageContent } from '../types';
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '../services/authService';

interface LandingPageProps {
  onJoin: () => void;
  onLogin: (user: User) => void;
  content: LandingPageContent;
}

const LandingPage: React.FC<LandingPageProps> = ({ onJoin, onLogin, content }) => {
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [showSecretField, setShowSecretField] = useState(false);
  const [secretKey, setSecretKey] = useState('');

  const handlePortalAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !password) return;

    setIsLoggingIn(true);
    setError('');
    
    try {
      // Check if user is trying to sign up as coach with secret key
      const ARCHITECT_PASSKEY = "rc-alpha-99";
      const isCoachSignup = secretKey.toLowerCase() === ARCHITECT_PASSKEY;
      
      if (isSignUp) {
        // Sign up new user
        const user = await signUpWithEmail(loginEmail, password, isCoachSignup ? 'coach' : 'client');
        onLogin(user);
      } else {
        // Sign in existing user
        const user = await signInWithEmail(loginEmail, password);
        onLogin(user);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    setError('');
    
    try {
      const user = await signInWithGoogle();
      onLogin(user);
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const [clickCount, setClickCount] = useState(0);
  const handleSecretTrigger = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    // Secretly click the copyright 5 times to reveal the Coach key field
    if (newCount === 5) {
      setShowSecretField(true);
      document.getElementById('login')?.scrollIntoView({ behavior: 'smooth' });
      setClickCount(0);
    }
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
          
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.9] tracking-tighter mb-8 whitespace-pre-line">
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
            THE RIPPED CITY <span className="text-red-600">PROTOCOL</span>
          </h2>
          <p className="text-gray-500 text-sm mb-16 uppercase tracking-widest font-bold">
            Precision-Driven Evolution in Three Phases
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {content.methodology.map((step, idx) => (
              <div key={idx} className="glass border border-gray-800 rounded-2xl p-8 hover:border-red-900/50 transition-all group">
                <div className="w-16 h-16 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center mx-auto mb-6 text-3xl text-red-600 font-black italic group-hover:scale-110 transition-transform">
                  {step.step}
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4 text-red-500">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section className="py-32 px-6 bg-[#030712]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-4">
            REAL <span className="text-red-600">TRANSFORMATIONS</span>
          </h2>
          <p className="text-gray-500 text-sm mb-16 uppercase tracking-widest font-bold text-center">
            Data-Driven Results
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative group overflow-hidden rounded-2xl">
              <img 
                src={content.beforeImage}
                alt="Before"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <span className="text-2xl font-black italic uppercase text-red-500">BEFORE</span>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl">
              <img 
                src={content.afterImage}
                alt="After"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                <span className="text-2xl font-black italic uppercase text-red-500">AFTER</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-[#030712]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-4">
            ATHLETE <span className="text-red-600">TESTIMONIALS</span>
          </h2>
          <p className="text-gray-500 text-sm mb-16 uppercase tracking-widest font-bold text-center">
            What Champions Say
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {content.testimonials.map((testimonial, idx) => (
              <div key={idx} className="glass border border-gray-800 rounded-2xl p-8 hover:border-red-900/50 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full border-2 border-red-600"
                  />
                  <div>
                    <h4 className="font-black italic uppercase text-sm">{testimonial.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section id="login" className="py-32 px-6 bg-[#030712] border-t border-gray-900">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-4">
            {isSignUp ? 'CREATE' : 'ACCESS'} <span className="text-red-600">PORTAL</span>
          </h2>
          <p className="text-gray-500 text-sm mb-12 uppercase tracking-widest font-bold text-center">
            {isSignUp ? 'Join The Elite' : 'Secure Member Login'}
          </p>
          
          <form onSubmit={handlePortalAccess} className="space-y-6">
            <div className="glass border border-gray-800 rounded-2xl p-8 space-y-6">
              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoggingIn}
                className="w-full py-4 bg-white hover:bg-gray-100 disabled:bg-gray-800 text-gray-900 font-bold rounded-xl transition-all flex items-center justify-center gap-3"
              >
                <i className="fab fa-google text-red-600"></i>
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#111827] px-4 text-gray-500 font-black">Or</span>
                </div>
              </div>

              {/* Email/Password Fields */}
              {error && (
                <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-xl text-red-500 text-sm text-center font-bold">
                  {error}
                </div>
              )}

              {showSecretField && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-red-500 ml-4">Coach Access Key</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#111827] border border-red-900 p-4 rounded-xl outline-none focus:border-red-600 transition-all font-bold text-gray-200"
                    placeholder="Enter master key..."
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                  />
                  <p className="text-[9px] text-gray-600 ml-4 mt-1">* Enter rc-alpha-99 to sign up as coach</p>
                </div>
              )}

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
                  isSignUp ? "Create Account" : "Access Portal"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="w-full text-sm text-gray-500 hover:text-red-500 transition-colors font-bold"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
              
              {showSecretField && (
                <button 
                  type="button"
                  onClick={() => setShowSecretField(false)}
                  className="w-full text-[10px] font-black text-gray-600 uppercase hover:text-gray-400 transition-colors"
                >
                  Return to Standard Login
                </button>
              )}
              
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
        <p 
          className="text-[10px] font-bold text-gray-600 uppercase tracking-widest cursor-default select-none"
          onClick={handleSecretTrigger}
        >
          © 2026 Ripped City Inc. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
