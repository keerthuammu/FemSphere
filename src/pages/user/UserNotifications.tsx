import React from 'react';
import { Bell, Trash2, CheckCircle2 } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function UserNotifications() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
  } = useUser();

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE9FE] shadow-sm space-y-6 font-inter">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#EDE9FE] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#7C3AED]" />
            <h3 className="font-bold text-xl text-[#3a3135]">Notifications Center</h3>
          </div>
          <p className="text-xs text-[#7a6f75] mt-1">Real-time system updates, clinical appointment alerts, and report scans</p>
        </div>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllNotificationsRead} 
            className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`p-4.5 rounded-2xl border flex items-start justify-between gap-4 transition-all text-xs ${
              n.read ? 'bg-[#FAF8FC] border-[#EDE9FE] opacity-75' : 'bg-white border-[#7C3AED]/30 shadow-xs'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${n.read ? 'bg-transparent' : 'bg-[#7C3AED]'}`}></span>
                <h4 className="font-bold text-sm text-[#3a3135]">{n.title}</h4>
                <span className="text-[10px] text-[#7a6f75]">{n.time}</span>
              </div>
              <p className="text-[#64595e]">{n.message}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {!n.read && (
                <button 
                  onClick={() => markNotificationRead(n.id)} 
                  className="text-[11px] font-bold text-[#7C3AED] hover:underline cursor-pointer"
                >
                  Mark as read
                </button>
              )}
              <button 
                onClick={() => deleteNotification(n.id)} 
                className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete Notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-12 border border-dashed border-[#EDE9FE] rounded-3xl text-[#7a6f75] text-xs">
            No notifications to display.
          </div>
        )}
      </div>
    </div>
  );
}
