import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout';
import Button from '../../components/Button';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function OrganizerConfirm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    api
      .get(`/users/organizer-access/confirm/${token}`)
      .then(async () => {
        try {
          await refreshUser();
        } catch {
          // ignore — confirmation itself already succeeded
        }
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <PageLayout noFooter minimalNav>
      <div className="max-w-[440px] mx-auto px-xl py-4xl text-center flex flex-col items-center gap-lg">
        {status === 'loading' && (
          <p className="text-[14px] text-text-secondary">Confirming your organizer access…</p>
        )}

        {status === 'success' && (
          <>
            <span className="material-symbols-outlined text-success" style={{ fontSize: 48 }}>check_circle</span>
            <h1 className="text-[22px] font-bold text-text-primary">Organizer access enabled</h1>
            <p className="text-[14px] text-text-secondary">You can now create your first campaign.</p>
            <Link to="/organizer/new/basics"><Button>Create your campaign</Button></Link>
          </>
        )}

        {status === 'error' && (
          <>
            <span className="material-symbols-outlined text-error" style={{ fontSize: 48 }}>error</span>
            <h1 className="text-[22px] font-bold text-text-primary">This link is invalid or expired</h1>
            <p className="text-[14px] text-text-secondary">
              Confirmation links expire after 24 hours. Go back to "Start a fundraiser" to request a new one.
            </p>
            <Link to="/organizer/onboard"><Button variant="secondary">Back to Start a fundraiser</Button></Link>
          </>
        )}
      </div>
    </PageLayout>
  );
}
