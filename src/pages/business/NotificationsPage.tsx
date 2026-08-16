import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertOctagon, BrainCircuit, HandHeart, CheckCheck, Clock, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { notificationService } from '../../services/notificationService';
import { Notification } from '../../types';

export const NotificationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'EXPIRY' | 'FORECAST' | 'DONATION_REQUEST'>('ALL');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setNotifications(notificationService.getNotifications());
  }, []);

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications(notificationService.getNotifications());
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    setNotifications(notificationService.getNotifications());
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === 'UNREAD') return !n.isRead;
    if (activeTab === 'EXPIRY') return n.type === 'EXPIRY';
    if (activeTab === 'FORECAST') return n.type === 'FORECAST';
    if (activeTab === 'DONATION_REQUEST') return n.type === 'DONATION_REQUEST';
    return true;
  });

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'EXPIRY':
        return <AlertOctagon className="w-5 h-5 text-eco-danger" />;
      case 'FORECAST':
        return <BrainCircuit className="w-5 h-5 text-eco-blue" />;
      case 'DONATION_REQUEST':
        return <HandHeart className="w-5 h-5 text-eco-purple" />;
      default:
        return <Bell className="w-5 h-5 text-eco-green" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Alerts"
        subtitle="System alerts, expiry reminders, AI forecast updates, and charity donation requests."
        actions={
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-eco-surface hover:bg-eco-card border border-eco-border text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4 text-eco-green" /> Mark All as Read
          </button>
        }
      />

      {/* FILTER TABS matching supplied Notifications screen UI */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-eco-border/40">
        {[
          { label: 'All Alerts', value: 'ALL' },
          { label: 'Unread', value: 'UNREAD' },
          { label: 'Expiry Alerts', value: 'EXPIRY' },
          { label: 'AI Forecasts', value: 'FORECAST' },
          { label: 'Donation Requests', value: 'DONATION_REQUEST' },
        ].map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-eco-green text-eco-bg shadow-glow-green'
                  : 'bg-eco-surface border border-eco-border text-eco-muted hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* NOTIFICATION CARDS LIST */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No Notifications"
          description="You are all caught up! No notifications match the selected category."
          icon={Bell}
        />
      ) : (
        <div className="space-y-4 max-w-4xl">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkAsRead(notif.id)}
              className={`eco-card p-5 border transition-all flex flex-col sm:flex-row items-start justify-between gap-4 cursor-pointer ${
                !notif.isRead
                  ? 'border-eco-green/40 bg-eco-surface/90 shadow-lg'
                  : 'border-eco-border/60 bg-eco-card/50 opacity-80'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-eco-surface border border-eco-border shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white font-outfit">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-eco-green animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-eco-muted leading-relaxed max-w-2xl">{notif.message}</p>
                  <span className="text-[10px] text-eco-muted flex items-center gap-1 pt-1">
                    <Clock className="w-3 h-3" /> {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {notif.actionUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(notif.id);
                    navigate(notif.actionUrl!);
                  }}
                  className="px-4 py-2 bg-eco-green hover:bg-eco-greenHover text-eco-bg font-extrabold text-xs rounded-xl shadow-glow-green shrink-0 flex items-center gap-1"
                >
                  {notif.actionLabel || 'Action'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
