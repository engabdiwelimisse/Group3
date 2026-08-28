import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import EmptyState from '../../components/EmptyState';
import Button from '../../components/Button';
import api from '../../api/client';
import { DONOR_NAV } from './nav';

// Only meaningful events reach here — no notification noise
// (Design_Rules.md Rule 38).
export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState('loading');

  function load() {
    api
      .get('/notifications/mine')
      .then(({ data }) => {
        setNotifications(data.items);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }

  useEffect(load, []);

  async function markAllRead() {
    await api.patch('/notifications/read-all');
    load();
  }

  async function markRead(id) {
    await api.patch(`/notifications/${id}/read`);
    load();
  }

  return (
    <DashboardLayout title="My account" nav={DONOR_NAV}>
      <div className="flex flex-col gap-xl">
        <div className="flex items-center justify-between">
          <h1 className="text-[24px] font-bold text-text-primary">Notifications</h1>
          {notifications.some((n) => !n.read) && (
            <Button variant="tertiary" className="h-auto p-0" onClick={markAllRead}>Mark all as read</Button>
          )}
        </div>

        {status === 'loading' && (
          <div className="flex flex-col gap-sm">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-surface border border-border rounded-lg animate-pulse" />)}</div>
        )}

        {status === 'error' && (
          <EmptyState icon="wifi_off" title="Couldn't load notifications" description="Please check your connection and try again." />
        )}

        {status === 'ready' && notifications.length === 0 && (
          <EmptyState icon="notifications" title="No notifications yet" description="Updates on your donations, campaigns, and account will appear here." />
        )}

        {notifications.length > 0 && (
          <div className="flex flex-col divide-y divide-border border-t border-b border-border">
            {notifications.map((n) => (
              <div key={n._id} className={`flex items-start justify-between gap-md py-lg ${n.read ? '' : 'bg-primary/5 -mx-lg px-lg'}`}>
                <div>
                  <p className="text-[14px] font-medium text-text-primary">{n.title}</p>
                  {n.body && <p className="text-[13px] text-text-secondary mt-xs">{n.body}</p>}
                  <p className="text-[12px] text-text-secondary mt-xs">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-xs flex-shrink-0">
                  {n.targetUrl && (
                    <Link to={n.targetUrl} className="text-[13px] text-primary hover:underline">View</Link>
                  )}
                  {!n.read && (
                    <button onClick={() => markRead(n._id)} className="text-[12px] text-text-secondary hover:text-primary">
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
