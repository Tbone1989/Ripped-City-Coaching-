
import React from 'react';
import { UserRole } from '../types';
import CoachDashboard from './CoachDashboard';
import ClientDashboard from './ClientDashboard';

interface DashboardProps {
  role: UserRole;
  onNavigate?: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ role, onNavigate }) => {
  if (role === UserRole.COACH) {
    return <CoachDashboard />;
  }
  return <ClientDashboard onNavigate={onNavigate || (() => {})} />;
};

export default Dashboard;
