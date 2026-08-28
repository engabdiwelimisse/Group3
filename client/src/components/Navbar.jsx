import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import StartFundraiserLink from './StartFundraiserLink';
import Logo from './Logo';
import api from '../api/client';

// Navigation reflects the user's role — never show organizer/admin controls
// to a donor, and vice versa (Design_Rules.md Rule 32/33).
// `minimal` hides the profile icon, notifications, and log-out control —
// used on the email-verification gate pages, where the only action
// available should be verifying (or resending) the email, not navigating
// away into the app.
export default function Navbar({ minimal = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  const isOrganizer = user?.roles?.includes('organizer');
  const isAdmin = user?.roles?.includes('admin') || user?.roles?.includes('moderator');

  useEffect(() => {
    if (!user || minimal) return;
    api
      .get('/notifications/mine')
      .then(({ data }) => setUnreadCount(data.unreadCount))
      .catch(() => {});
  }, [user, minimal]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="bg-surface border-b border-border w-full sticky top-0 z-50">
      <div className="max-w-container mx-auto px-xl h-16 flex items-center justify-between">
        <div className="flex items-center gap-2xl">
          <Logo />
          <nav className="hidden md:flex items-center gap-xl text-[14px]">
            <Link to="/explore" className="text-text-secondary hover:text-primary transition-colors">
              Explore
            </Link>
            <Link to="/how-it-works" className="text-text-secondary hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link to="/safety" className="text-text-secondary hover:text-primary transition-colors">
              Safety
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-text-secondary hover:text-primary transition-colors">
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-md">
          <button className="hidden lg:flex items-center gap-xs text-[13px] text-text-secondary hover:text-primary transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              language
            </span>
            Somali | English
          </button>

          {user ? (
            <>
              {isOrganizer ? (
                <Link to="/organizer">
                  <Button variant="secondary" className="h-[38px]">Organizer dashboard</Button>
                </Link>
              ) : (
                <StartFundraiserLink>
                  <Button variant="secondary" className="h-[38px]">Start a fundraiser</Button>
                </StartFundraiserLink>
              )}
              {!minimal && (
                <>
                  <Link to="/donor/notifications" className="relative text-text-secondary hover:text-primary transition-colors flex items-center p-sm">
                    <span className="material-symbols-outlined">notifications</span>
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-error text-white text-[10px] flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/donor" className="text-text-secondary hover:text-primary transition-colors flex items-center p-sm">
                    <span className="material-symbols-outlined">account_circle</span>
                  </Link>
                  <button onClick={handleLogout} className="text-[13px] text-text-secondary hover:text-error transition-colors">
                    Log out
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="text-[14px] text-text-secondary hover:text-primary transition-colors">
                Log in
              </Link>
              <StartFundraiserLink>
                <Button className="h-[38px]">Start a fundraiser</Button>
              </StartFundraiserLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
