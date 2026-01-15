
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
  role: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role, isOpen, setIsOpen }) => {
  const coachItems: MenuItem[] = [
    { id: 'dashboard', label: 'Command Center', icon: 'fa-table-columns', role: UserRole.COACH },
    { id: 'roster', label: 'Client Roster', icon: 'fa-users', role: UserRole.COACH },
    { id: 'units', label: 'Tactical Units', icon: 'fa-layer-group', role: UserRole.COACH },
    { id: 'crm', label: 'Prospect CRM', icon: 'fa-user-plus', role: UserRole.COACH },
    { id: 'cms', label: 'Website CMS', icon: 'fa-globe', role: UserRole.COACH },
    { id: 'intelligence', label: 'Business Intel', icon: 'fa-chart-line', role: UserRole.COACH },
    { id: 'terminal', label: 'Payment Terminal', icon: 'fa-credit-card', role: UserRole.COACH },
    { id: 'auditor', label: 'System Audit', icon: 'fa-shield-halved', role: UserRole.COACH },
  ];

  const clientItems: MenuItem[] = [
    { id: 'dashboard', label: 'Daily Protocol', icon: 'fa-calendar-day', role: UserRole.CLIENT },
    { id: 'workout', label: 'Gym Mode', icon: 'fa-dumbbell', role: UserRole.CLIENT },
    { id: 'grocery', label: 'Grocery List', icon: 'fa-basket-shopping', role: UserRole.CLIENT },
    { id: 'schedule', label: 'Schedule', icon: 'fa-clock', role: UserRole.CLIENT },
    { id: 'photos', label: 'Progress Photos', icon: 'fa-camera', role: UserRole.CLIENT },
    { id: 'scanner', label: 'Meal Scan', icon: 'fa-utensils', role: UserRole.CLIENT },
    { id: 'fuel-audit', label: 'Label Scan', icon: 'fa-barcode', role: UserRole.CLIENT },
    { id: 'voice', label: 'Coach Connect', icon: 'fa-headset', role: UserRole.CLIENT },
  ];

  const items = role === UserRole.COACH ? coachItems : clientItems;

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
          <div className="space-y-2 px-3 overflow-y-auto h-full scrollbar-hide">
            {items.map((item) => (
              <button
                key={item.id}
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
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-800">
           {isOpen && <div className="text-[9px] font-black uppercase text-gray-600 text-center tracking-widest">{role} PORTAL</div>}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
