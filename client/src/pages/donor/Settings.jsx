import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { DONOR_NAV } from './nav';

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);
    try {
      await api.patch('/users/me', { fullName });
      await refreshUser();
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not save your changes.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout title="My account" nav={DONOR_NAV}>
      <div className="flex flex-col gap-xl max-w-md">
        <h1 className="text-[24px] font-bold text-text-primary">Settings</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-lg bg-surface border border-border rounded-lg p-xl">
          <Input label="Full name" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input label="Email address" id="email" value={user?.email || ''} disabled />
          <Input label="Phone number" id="phone" value={user?.phone || ''} disabled />

          {saved && <p className="text-[13px] text-success">Saved.</p>}
          {error && <p className="text-[13px] text-error">{error}</p>}

          <Button type="submit" disabled={submitting} className="self-start">
            {submitting ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
