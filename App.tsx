
import React, { useState, useEffect } from 'react';
import { UserRole, Notification, ExperienceTier, LandingPageContent } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IntegrityAuditor from './components/AIAuditor';
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
import MealScanner from './components/MealScanner';
import ClientRoster from './components/ClientRoster';
import PerformanceAdvice from './components/PerformanceAdvice';
import ProductScanner from './components/ProductScanner';
import CoachCMS from './components/CoachCMS';
import CoachPaymentTerminal from './components/CoachPaymentTerminal';
import WorkoutInterface from './components/WorkoutInterface';
import GroceryList from './components/GroceryList';
import CoachAIWidget from './components/CoachAIWidget';
import HabitEvolution from './components/HabitEvolution';
import PrecisionGenerator from './components/PrecisionGenerator';
import HealthSuite from './components/HealthSuite';
// Added missing import for ProspectCRM
import ProspectCRM from './components/ProspectCRM';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.PROSPECT);
  const [tier, setTier] = useState<ExperienceTier>('BEGINNER'); 
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);

  const [landingContent, setLandingContent] = useState<LandingPageContent>({
    heroTitle: "FORGE YOUR\nLEGACY",
    heroSubtitle: "Elite performance coaching built for competitive athletes. Proven methodologies. Guaranteed evolution.",
    heroImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070",
    beforeImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070",
    afterImage: "https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=2070",
    methodology: [
      { step: '1', title: 'ANALYZE', text: 'Deep dive intake Assessment: bloodwork, lifestyle, and metabolic baseline assessment.', icon: 'fa-clipboard-list' },
      { step: '2', title: 'BLUEPRINT', text: 'Custom roadmap: Precision nutrition, periodized training, and supplement protocols.', icon: 'fa-hourglass-half' },
      { step: '3', title: 'EVOLVE', text: 'Execute and adjust: Bi-weekly data-driven audits ensure constant progression.', icon: 'fa-trophy' }
    ],
    testimonials: [
      { name: "John D.", role: "Elite Athlete", text: "Working with the Master Architect changed my perspective on hypertrophy. Precision is the difference.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
      { name: "Sarah K.", role: "Pro Wellness", text: "The biological sync modules ensured I hit the stage at my dryest while retaining strength.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
      { name: "Mike R.", role: "Classic Physique", text: "Ripped City isn't a program; it's a high-fidelity biological framework.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike" }
    ]
  });

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
    setIsSidebarOpen(window.innerWidth > 1024);
    addNotification(
      "Link Established", 
      `Welcome back, ${selectedRole === UserRole.COACH ? 'Coach' : 'Athlete'}. Protocols active.`, 
      "SUCCESS"
    );
  };

  const appState = {
    clients: 12,
    missedCheckins: 2,
    bloodworkPending: 4,
    systemMemory: '512MB',
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
      return <LandingPage onJoin={() => setIsOnboarding(true)} onLogin={handleLogin} content={landingContent} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard role={role} onNavigate={setActiveTab} />;
      case 'workout':
        return <WorkoutInterface />;
      case 'grocery':
        return <GroceryList />;
      case 'schedule':
        return <ScheduleView onReminderAction={(msg) => addNotification("Task Complete", msg, "SUCCESS")} />;
      case 'photos':
        return <ProgressPhotos />;
      case 'scanner':
        return <MealScanner />;
      case 'fuel-audit':
        return <ProductScanner tier={tier} />;
      case 'voice':
        return <RemoteConsultation />;
      
      // Specialist & Evolution Modules
      case 'timeline':
        return <HabitEvolution />;
      case 'strategy':
        return <PerformanceAdvice />;
      case 'generator':
        return <PrecisionGenerator />;
      case 'health':
        return <HealthSuite />;
      case 'female-suite':
        return <HormonalSync />;

      // Coach Specific Routes
      case 'roster':
        return <ClientRoster />;
      case 'units':
        return <UnitCommand />;
      case 'crm':
        return <ProspectCRM />;
      case 'cms':
        return <CoachCMS content={landingContent} onUpdate={setLandingContent} />;
      case 'intelligence':
        return <BusinessIntel />;
      case 'terminal':
        return <CoachPaymentTerminal />;
      case 'auditor':
        return <IntegrityAuditor appState={appState} />;

      default:
        return <Dashboard role={role} onNavigate={setActiveTab} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-inter">
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
          <header className="h-16 glass border-b border-gray-800 flex items-center justify-between px-4 md:px-6 z-10 shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <i className="fas fa-bars"></i>
              </button>
              <h1 className="text-base md:text-xl font-black italic tracking-tighter uppercase whitespace-nowrap">
                RIPPED CITY <span className="text-red-600">v3.27</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative">
                <button 
                  onClick={() => setShowNotificationCenter(!showNotificationCenter)}
                  className={`p-2 transition-colors relative ${unreadCount > 0 ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
                >
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-600 text-[8px] font-black flex items-center justify-center rounded-full text-white border-2 border-gray-950">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotificationCenter && (
                  <div className="fixed md:absolute right-4 top-16 md:mt-4 w-[calc(100vw-32px)] md:w-80 glass border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
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

              <div 
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-red-600 cursor-pointer hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setRole(UserRole.PROSPECT);
                  setIsOnboarding(false);
                }}
              >
                <i className="fas fa-right-from-bracket text-sm"></i>
              </div>
            </div>
          </header>
        )}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
        {activeToast && (
          <NotificationToast 
            notification={activeToast} 
            onClose={() => setActiveToast(null)} 
          />
        )}

        {role === UserRole.COACH && <CoachAIWidget />}
      </main>
    </div>
  );
};

export default App;
