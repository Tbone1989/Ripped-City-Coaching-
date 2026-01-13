
import React, { useEffect } from 'react';
import { Notification } from '../types';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-24 right-6 z-[60] animate-in slide-in-from-right-10 fade-in duration-300">
      <div className="glass bg-gray-900 border border-red-600/30 rounded-xl p-4 w-72 shadow-2xl shadow-red-600/10">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${
            notification.type === 'ALERT' ? 'bg-red-600/20 text-red-500' : 
            notification.type === 'SUCCESS' ? 'bg-green-600/20 text-green-500' :
            'bg-blue-600/20 text-blue-500'
          }`}>
            <i className={`fas ${
              notification.type === 'ALERT' ? 'fa-triangle-exclamation' : 
              notification.type === 'SUCCESS' ? 'fa-check-circle' :
              'fa-bell'
            }`}></i>
          </div>
          <div className="flex-1">
            <h4 className="text-[10px] font-black uppercase text-red-500 tracking-widest">{notification.title}</h4>
            <p className="text-xs text-gray-300 mt-1">{notification.message}</p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors">
            <i className="fas fa-times text-[10px]"></i>
          </button>
        </div>
        <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-red-600 animate-[shrink_5s_linear_forwards]"></div>
        </div>
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast;
