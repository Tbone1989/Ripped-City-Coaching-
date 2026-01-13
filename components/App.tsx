
import React, { useState, useEffect, useRef } from 'react';
import { UserRole, Notification, ExperienceTier } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IntegrityAuditor from './components/AIAuditor';
import PrecisionGenerator from './components/PrecisionGenerator';
import HealthSuite from './components/HealthSuite';
import RemoteConsultation from './components/VoiceAssistant';
import LandingPage from './components/LandingPage';
import InvoicesView from './components/InvoicesView';
import ScheduleView from './components/ScheduleView';
import NotificationToast from './components/NotificationToast';
import OnboardingFlow from './components/OnboardingFlow';
import UnitCommand from './components/UnitCommand';
import BusinessIntel from './components/BusinessIntel';
import HormonalSync from './components/HormonalSync';
import ProtocolExpert from './components/ZephyrExpert';
import ProgressPhotos from './components/ProgressPhotos';
import KineticFormAudit from './components/KineticFormAudit';
import MolecularSynergy from './components/MolecularSynergy';
import CircadianOptimization from './components/CircadianOptimization';
import ProspectCRM from './components/ProspectCRM';
import SocialMarketing from './components/SocialMarketing';
import MealScanner from './components/MealScanner';
import ClientRoster from './components/ClientRoster';
import PerformanceAdvice from './components/PerformanceAdvice';
import HabitEvolution from './components/HabitEvolution';
import ProductScanner from './components/ProductScanner';
import DiningGuide from './components/DiningGuide';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.PROSPECT);
  const [tier, setTier] = useState<ExperienceTier>('BEGINNER'); 
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);

  const addNotification = (title: string, message: string, type: any) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);
  };

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setIsOnboarding(false);
    setActiveTab('dashboard');
    addNotification(
      "Link Established", 
      `Welcome back, ${selectedRole === UserRole.COACH ? 'Coach' : 'Athlete'}. Protocols active.`, 
      "SUCCESS"
    );
  };

  useEffect(() => {
    if (role === UserRole.PROSPECT) {
      setActiveTab('landing');
      return;
    }
  }, [role]);

  const appState = {
    clients: 12,
    missedCheckins: 2,
    bloodworkPending: 4,
    systemMemory: '256MB',
    lastSync: new Date().toISOString()
  };

  const renderContent = () => {
    if (role === UserRole.PROSPECT) {
      if (isOnboarding) {
        return (
          <OnboardingFlow 
            onComplete={() => {
              setIsOnboarding(false);
              setRole(UserRole.CLIENT);
              addNotification("Onboarding Complete", "Welcome to Ripped City. Your blueprint is ready.", "SUCCESS");
            }} 
            onCancel={() => setIsOnboarding(false)}
          />
        );
      }
      return <LandingPage onJoin={() => setIsOnboarding(true)} onLogin={handleLogin} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard role={role} />;
      case 'roster':
        return <ClientRoster />;
      case 'timeline':
        return <HabitEvolution />;
      case 'strategy':
        return <PerformanceAdvice />;
      case 'units':
        return <UnitCommand />;
      case 'crm':
        return <ProspectCRM />;
      case 'marketing':
        return <SocialMarketing />;
      case 'scanner':
        return <MealScanner />;
      case 'fuel-audit':
        return <ProductScanner tier={tier} />;
      case 'dining':
        return <DiningGuide tier={tier} />;
      case 'intelligence':
        return <BusinessIntel />;
      case 'female-suite':
        return <HormonalSync />;
      case 'expert':
        return <ProtocolExpert />;
      case 'photos':
        return <ProgressPhotos />;
      case 'form-audit':
        return <KineticFormAudit />;
      case 'molecular':
        return <MolecularSynergy />;
      case 'circadian':
        return <CircadianOptimization />;
      case 'auditor':
        return <IntegrityAuditor appState={appState} />;
      case 'generator':
        return <PrecisionGenerator />;
      case 'health':
        return <HealthSuite />;
      case 'voice':
        return <RemoteConsultation />;
      case 'billing':
        return <InvoicesView />;
      case 'schedule':
        return <ScheduleView onReminderAction={(msg) => addNotification("Task Complete", msg, "SUCCESS")} />;
      default:
        return <Dashboard role={role} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      {role !== UserRole.PROSPECT && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          role={role} 
          setRole={setRole}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          tier={tier}
        />
      )}

      <main className="flex-1 flex flex-col overflow-hidden relative border-l border-gray-900">
        {role !== UserRole.PROSPECT && (
          <header className="h-16 glass border-b border-gray-800 flex items-center justify-between px-6 z-10">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                <i className="fas fa-bars"></i>
              </button>
              <h1 className="text-xl font-black italic tracking-tighter uppercase">
                RIPPED CITY <span className="text-red-600">v3.27</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {role === UserRole.CLIENT && (
                 <div className="hidden md:flex flex-col items-end mr-4">
                    <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest">Athlete Level</span>
                    <select 
                      value={tier} 
                      onChange={(e) => setTier(e.target.value as ExperienceTier)}
                      className="bg-transparent text-[10px] font-black text-red-500 uppercase border-none focus:ring-0 cursor-pointer"
                    >
                      <option value="BEGINNER">BEGINNER</option>
                      <option value="INTERMEDIATE">INTERMEDIATE</option>
                      <option value="ADVANCED">ADVANCED</option>
                      <option value="ELITE">ELITE</option>
                      <option value="PRO">PRO</option>
                    </select>
                 </div>
              )}
              
              <div className="relative">
                <button 
                  onClick={() => setShowNotificationCenter(!showNotificationCenter)}
                  className={`p-2 transition-colors relative ${unreadCount > 0 ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                >
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-[8px] font-black flex items-center justify-center rounded-full text-white border-2 border-gray-950">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotificationCenter && (
                  <div className="absolute right-0 mt-4 w-80 glass border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-widest italic">Notifications</span>
                      <button 
                        onClick={() => {
                          setNotifications(notifications.map(n => ({...n, read: true})));
                          setShowNotificationCenter(false);
                        }}
                        className="text-[10px] text-gray-500 hover:text-red-500 font-bold uppercase"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-800">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-600 italic text-xs uppercase tracking-widest">No New Alerts</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className={`p-4 hover:bg-gray-900/50 transition-colors ${n.read ? 'opacity-50' : 'bg-red-600/5 border-l-2 border-l-red-600'}`}>
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-black uppercase text-red-500 tracking-tighter">{n.title}</span>
                              <span className="text-[8px] text-gray-600">{n.timestamp}</span>
                            </div>
                            <p className="text-xs text-gray-300 leading-tight">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Live: Elite Core</span>
              </div>
              <div 
                className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-red-600 cursor-pointer"
                onClick={() => {
                  setRole(UserRole.PROSPECT);
                  setIsOnboarding(false);
                }}
              >
                <i className="fas fa-right-from-bracket"></i>
              </div>
            </div>
          </header>
        )}
        <div className="flex-1 overflow-y-auto p-0 md:p-0">
          {renderContent()}
        </div>
        {activeToast && (
          <NotificationToast 
            notification={activeToast} 
            onClose={() => setActiveToast(null)} 
          />
        )}
        {role !== UserRole.PROSPECT && (
          <div className="fixed bottom-6 right-6 z-50">
            <button 
              onClick={() => setActiveTab('voice')}
              className="w-14 h-14 bg-red-600 rounded-full shadow-lg shadow-red-600/20 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group"
            >
              <i className="fas fa-microphone text-white text-xl group-hover:animate-bounce"></i>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
