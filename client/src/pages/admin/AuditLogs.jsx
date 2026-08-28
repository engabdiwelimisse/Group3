import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import EmptyState from '../../components/EmptyState';
import api from '../../api/client';
import { ADMIN_NAV } from './nav';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    api
      .get('/admin/audit-logs', { params: { limit: 50 } })
      .then(({ data }) => {
        setLogs(data.items);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <DashboardLayout title="Admin" nav={ADMIN_NAV}>
      <div className="flex flex-col gap-xl">
        <h1 className="text-[24px] font-bold text-text-primary">Audit logs</h1>

        {status === 'loading' && (
          <div className="flex flex-col gap-sm">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-surface border border-border rounded-lg animate-pulse" />)}</div>
        )}

        {status === 'error' && (
          <EmptyState icon="wifi_off" title="Couldn't load audit logs" description="Please check your connection and try again." />
        )}

        {status === 'ready' && logs.length === 0 && (
          <EmptyState icon="history" title="No activity yet" description="Admin and financial actions will appear here as they happen." />
        )}

        {logs.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="text-left text-[12px] text-text-secondary uppercase border-b border-border">
                  <th className="py-sm pr-md">Time</th>
                  <th className="py-sm pr-md">Actor</th>
                  <th className="py-sm pr-md">Action</th>
                  <th className="py-sm pr-md">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td className="py-md pr-md text-text-secondary font-mono text-[13px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-md pr-md text-text-primary">{log.actorId?.email || log.actorType}</td>
                    <td className="py-md pr-md text-text-secondary font-mono text-[13px]">{log.action}</td>
                    <td className="py-md pr-md text-text-secondary">
                      {log.targetType}
                      {log.metadata?.title || log.metadata?.fullName || log.metadata?.email
                        ? ` — ${log.metadata.title || log.metadata.fullName || log.metadata.email}`
                        : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
