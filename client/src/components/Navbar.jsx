import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './Button';
import StartFundraiserLink from './StartFundraiserLink';
import Logo from './Logo';
import api from '../api/client';

const NAV_LINKS = [
  { to: '/explore', label: 'Explore' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/safety', label: 'Safety' },
];

// Navigation reflects the user's role — never show organizer/admin controls
// to a donor, and vice versa (Design_Rules.md Rule 32/33).
// `minimal` hides the profile icon, notifications, and log-out control —
// used on the email-verification gate pages, where the only action
// available should be verifying (or resending) the email, not navigating
// away into the app.
//
// Mobile (<md) collapses nav links and secondary actions behind a hamburger
// menu rather than shrinking them in place — adapting the hierarchy, not
// just scaling it down (Design_Rules.md Rule 31).
export default function Navbar({ minimal = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
    logout();
    navigate('/');
  }

  return (
    <header className="bg-surface border-b border-border w-full sticky top-0 z-50">
      <div className="max-w-container mx-auto px-lg md:px-xl h-20 flex items-center justify-between">
        <div className="flex items-center gap-2xl">
          <Logo />
          <nav className="hidden md:flex items-center gap-xl text-[14px]">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="text-text-secondary hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" className="text-text-secondary hover:text-primary transition-colors">
                Admin
              </Link>
            )}
          </nav>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-md">
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

        {/* Mobile: unread bell (if logged in) + hamburger toggle */}
        <div className="flex md:hidden items-center gap-xs">
          {user && !minimal && (
            <Link to="/donor/notifications" className="relative text-text-secondary flex items-center p-sm">
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-error text-white text-[10px] flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="text-text-primary flex items-center p-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <nav className="flex flex-col px-lg py-md">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="py-md text-[15px] text-text-primary border-b border-border"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMenuOpen(false)} className="py-md text-[15px] text-text-primary border-b border-border">
                Admin
              </Link>
            )}

            <button className="flex items-center gap-xs py-md text-[15px] text-text-secondary border-b border-border">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>language</span>
              Somali | English
            </button>

            {user ? (
              <>
                {isOrganizer ? (
                  <Link to="/organizer" onClick={() => setMenuOpen(false)} className="py-md text-[15px] text-text-primary border-b border-border">
                    Organizer dashboard
                  </Link>
                ) : (
                  <StartFundraiserLink className="py-md text-[15px] text-text-primary border-b border-border block" onClick={() => setMenuOpen(false)}>
                    Start a fundraiser
                  </StartFundraiserLink>
                )}
                {!minimal && (
                  <Link to="/donor" onClick={() => setMenuOpen(false)} className="py-md text-[15px] text-text-primary border-b border-border">
                    My account
                  </Link>
                )}
                <button onClick={handleLogout} className="py-md text-[15px] text-error text-left">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="py-md text-[15px] text-text-primary border-b border-border">
                  Log in
                </Link>
                <div className="pt-lg">
                  <StartFundraiserLink onClick={() => setMenuOpen(false)}>
                    <Button className="w-full">Start a fundraiser</Button>
                  </StartFundraiserLink>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
