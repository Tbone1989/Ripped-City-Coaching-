
import React from 'react';
import { UserRole, ExperienceTier } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  tier?: ExperienceTier;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  roles: UserRole[];
  minTier: ExperienceTier;
  category: 'CORE' | 'MANAGEMENT' | 'DIAGNOSTICS' | 'SYSTEM';
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role, setRole, isOpen, setIsOpen, tier = 'BEGINNER' }) => {
  const menuItems: MenuItem[] = [
    // CORE
    { id: 'dashboard', label: 'Command Center', icon: 'fa-table-columns', roles: [UserRole.COACH, UserRole.CLIENT], minTier: 'BEGINNER', category: 'CORE' },
    { id: 'workout', label: 'Protocol Execution', icon: 'fa-dumbbell', roles: [UserRole.COACH, UserRole.CLIENT], minTier: 'BEGINNER', category: 'CORE' },
    { id: 'roadmap', label: 'Evolution Roadmap', icon: 'fa-timeline', roles: [UserRole.CLIENT, UserRole.COACH], minTier: 'BEGINNER', category: 'CORE' },
    { id: 'strategy', label: 'Advice Hub', icon: 'fa-chess-knight', roles: [UserRole.COACH, UserRole.CLIENT], minTier: 'BEGINNER', category: 'CORE' },

    // MANAGEMENT (COACH ONLY)
    { id: 'roster', label: 'Tactical Roster', icon: 'fa-id-card-clip', roles: [UserRole.COACH], minTier: 'BEGINNER', category: 'MANAGEMENT' },
    { id: 'units', label: 'Tactical Units', icon: 'fa-users-rays', roles: [UserRole.COACH], minTier: 'BEGINNER', category: 'MANAGEMENT' },
    { id: 'crm', label: 'Prospect Hub', icon: 'fa-user-plus', roles: [UserRole.COACH], minTier: 'BEGINNER', category: 'MANAGEMENT' },
    { id: 'intelligence', label: 'Business Intel', icon: 'fa-chart-pie', roles: [UserRole.COACH], minTier: 'BEGINNER', category: 'MANAGEMENT' },
    { id: 'terminal', label: 'Payment Terminal', icon: 'fa-wallet', roles: [UserRole.COACH], minTier: 'BEGINNER', category: 'MANAGEMENT' },

    // DIAGNOSTICS & TOOLS
    { id: 'scanner', label: 'Meal Auditor', icon: 'fa-bowl-food', roles: [UserRole.CLIENT, UserRole.COACH], minTier: 'BEGINNER', category: 'DIAGNOSTICS' },
    { id: 'library', label: 'Clinical Archive', icon: 'fa-book-medical', roles: [UserRole.CLIENT, UserRole.COACH], minTier: 'BEGINNER', category: 'DIAGNOSTICS' },
    { id: 'body-scan', label: 'Composition Hub', icon: 'fa-weight-scale', roles: [UserRole.CLIENT, UserRole.COACH], minTier: 'INTERMEDIATE', category: 'DIAGNOSTICS' },
    { id: 'fuel-audit', label: 'Fuel Auditor', icon: 'fa-barcode', roles: [UserRole.CLIENT, UserRole.COACH], minTier: 'BEGINNER', category: 'DIAGNOSTICS' },
    { id: 'form-audit', label: 'Kinetic Audit', icon: 'fa-video', roles: [UserRole.CLIENT, UserRole.COACH], minTier: 'INTERMEDIATE', category: 'DIAGNOSTICS' },
    { id: 'molecular', label: 'Molecular Hub', icon: 'fa-flask-vial', roles: [UserRole.CLIENT, UserRole.COACH], minTier: 'ADVANCED', category: 'DIAGNOSTICS' },
    { id: 'health', label: 'Biomarker Suite', icon: 'fa-heart-pulse', roles: [UserRole.COACH, UserRole.CLIENT], minTier: 'ADVANCED', category: 'DIAGNOSTICS' },
    
    // SYSTEM SETTINGS
    { id: 'cms', label: 'Website Master', icon: 'fa-globe', roles: [UserRole.COACH], minTier: 'BEGINNER', category: 'SYSTEM' },
    { id: 'auditor', label: 'Integrity Audit', icon: 'fa-shield-halved', roles: [UserRole.COACH], minTier: 'BEGINNER', category: 'SYSTEM' },
    { id: 'voice', label: 'Remote Connect', icon: 'fa-headset', roles: [UserRole.COACH, UserRole.CLIENT], minTier: 'BEGINNER', category: 'CORE' },
    { id: 'billing', label: 'Financial Ledger', icon: 'fa-receipt', roles: [UserRole.CLIENT], minTier: 'BEGINNER', category: 'CORE' },
    { id: 'schedule', label: 'Strategic Schedule', icon: 'fa-calendar-days', roles: [UserRole.COACH, UserRole.CLIENT], minTier: 'BEGINNER', category: 'CORE' },
  ];

  const filteredItems = menuItems.filter(item => {
    const roleMatch = item.roles.includes(role);
    if (!roleMatch) return false;

    if (role === UserRole.COACH) return true;
    
    const tierMap: Record<ExperienceTier, number> = { 
      'BEGINNER': 1, 
      'INTERMEDIATE': 2, 
      'ADVANCED': 3, 
      'ELITE': 4,
      'PRO': 5 
    };
    const athleteTierValue = tierMap[tier];
    const itemTierValue = tierMap[item.minTier as ExperienceTier];
    return athleteTierValue >= itemTierValue;
  });

  const categories = Array.from(new Set(filteredItems.map(i => i.category)));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-20'} 
        transition-all duration-300 ease-in-out h-full glass border-r border-gray-800 flex flex-col overflow-hidden
      `}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shrink-0">
              <i className="fas fa-bolt text-white"></i>
            </div>
            {isOpen && <span className="font-black italic text-lg tracking-tighter uppercase">RIPPED CITY</span>}
          </div>
          {isOpen && (
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500">
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <nav className="flex-1 py-6 overflow-hidden">
          <div className="space-y-8 px-3 overflow-y-auto h-full scrollbar-hide">
            {categories.map(cat => (
              <div key={cat} className="space-y-1">
                {isOpen && (
                  <p className="px-4 text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3">
                    {cat}
                  </p>
                )}
                <ul className="space-y-1">
                  {filteredItems.filter(i => i.category === cat).map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          if (window.innerWidth < 1024) setIsOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all group
                          ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'}
                        `}
                      >
                        <i className={`fas ${item.icon} w-5 shrink-0 text-sm`}></i>
                        {isOpen && <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">{item.label}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-4 mt-auto border-t border-gray-800">
          <div className="flex flex-col gap-2">
            {isOpen && <span className="text-[9px] text-gray-500 font-black uppercase mb-1 tracking-widest">Identity Switch</span>}
            <div className="flex flex-col gap-1.5">
              {[UserRole.COACH, UserRole.CLIENT].map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setActiveTab('dashboard');
                  }}
                  className={`
                    text-[9px] px-2 py-1.5 rounded border uppercase font-black tracking-tighter
                    ${role === r ? 'border-red-600 text-red-500 bg-red-600/5' : 'border-gray-800 text-gray-500 hover:border-gray-600'}
                  `}
                >
                  {isOpen ? r : r.charAt(0)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
