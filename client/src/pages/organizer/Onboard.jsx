import { useState } from 'react';
import PageLayout from '../../components/PageLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

// Becoming an organizer requires a dedicated email confirmation — a
// deliberate, separate step from general account verification — so nobody
// gets organizer access just by loading this page or clicking one button.
// Submitting this form only sends a confirmation email; the role is granted
// when that link is clicked (see OrganizerConfirm.jsx).
export default function OrganizerOnboard() {
  const { user, requestOrganizerAccess } = useAuth();
  const [form, setForm] = useState({ fullName: user?.fullName || '', purpose: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await requestOrganizerAccess(form);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <PageLayout noFooter>
        <div className="max-w-[480px] mx-auto px-xl py-4xl text-center flex flex-col items-center gap-lg">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 48 }}>mark_email_unread</span>
          <h1 className="text-[22px] font-bold text-text-primary">Confirm by email to continue</h1>
          <p className="text-[14px] text-text-secondary">
            We sent a confirmation link to your email address. Click it to enable organizer access on
            your account — you'll be able to create your campaign right after.
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout noFooter>
      <div className="max-w-[480px] mx-auto px-xl py-4xl">
        <div className="text-center mb-2xl flex flex-col items-center gap-sm">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 40 }}>campaign</span>
          <h1 className="text-[24px] font-bold text-text-primary">Start a fundraiser</h1>
          <p className="text-[14px] text-text-secondary">
            Confirm a few details and we'll email you a link to activate organizer access.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-lg bg-surface border border-border rounded-lg p-xl">
          <Input
            label="Your full name"
            id="fullName"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />

          <div className="flex flex-col gap-sm">
            <label htmlFor="purpose" className="text-[14px] font-medium text-text-primary">
              What do you plan to raise money for?
            </label>
            <textarea
              id="purpose"
              rows={3}
              placeholder="e.g. Medical treatment for my mother"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              className="w-full px-lg py-md rounded border border-border bg-surface text-text-primary outline-none focus:border-2 focus:border-primary transition-colors"
            />
          </div>

          {error && <p className="text-[13px] text-error bg-error/10 border border-error/30 rounded p-md">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Sending…' : 'Send confirmation email'}
          </Button>
        </form>
      </div>
    </PageLayout>
  );
}
