import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// One place decides where "Start a fundraiser" goes, so Navbar and Home stay
// consistent: logged out -> register; logged in but not yet an organizer ->
// the one-click onboarding (redirected to /check-email first if their email
// isn't verified yet); already an organizer -> their dashboard
// (Design_Rules.md Rule 32 — reflect the user's actual state).
export default function StartFundraiserLink({ children, className }) {
  const { user } = useAuth();
  const isOrganizer = user?.roles?.includes('organizer');

  let to = '/register';
  if (user) to = isOrganizer ? '/organizer' : '/organizer/onboard';

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}
