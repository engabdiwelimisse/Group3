import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import StatusPill from '../../components/StatusPill';
import ImageUpload from '../../components/ImageUpload';
import api from '../../api/client';

export default function Verification() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ fullName: '', idDocumentUrl: null });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api
      .get('/beneficiaries/me')
      .then(({ data }) => {
        setProfile(data);
        setForm({ fullName: data.fullName, idDocumentUrl: data.idDocumentUrl || null });
      })
      .catch(() => setProfile(null));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await api.post('/beneficiaries/me', {
        fullName: form.fullName,
        idDocumentUrl: form.idDocumentUrl || undefined,
      });
      setProfile(data);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Could not submit your verification. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageLayout>
      <div className="max-w-[560px] mx-auto px-xl py-3xl">
        <h1 className="text-[24px] font-bold text-text-primary mb-xs">Beneficiary verification</h1>
        <p className="text-[14px] text-text-secondary mb-2xl">
          Verifying the beneficiary builds trust with donors, and is required before any withdrawal can
          be requested for their campaign.
        </p>

        {profile && (
          <div className="bg-background border border-border rounded-lg p-lg mb-xl flex items-center justify-between">
            <span className="text-[14px] text-text-primary">Current status</span>
            <StatusPill status={profile.verificationStatus} />
          </div>
        )}

        {submitted ? (
          <div className="bg-success/10 border border-success/30 rounded-lg p-xl flex items-center gap-md">
            <span className="material-symbols-outlined text-success">check_circle</span>
            <div>
              <p className="text-[15px] font-medium text-text-primary">Submitted for review</p>
              <p className="text-[13px] text-text-secondary">Our team will verify these details and update the status above.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
            <Input
              label="Full legal name"
              id="fullName"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />

            <ImageUpload
              label="Identity document (photo ID)"
              value={form.idDocumentUrl}
              onChange={(url) => setForm({ ...form, idDocumentUrl: url })}
            />

            {error && <p className="text-[13px] text-error bg-error/10 border border-error/30 rounded p-md">{error}</p>}

            <Button type="submit" disabled={submitting} className="self-start">
              {submitting ? 'Submitting…' : 'Submit for verification'}
            </Button>
          </form>
        )}
      </div>
    </PageLayout>
  );
}
