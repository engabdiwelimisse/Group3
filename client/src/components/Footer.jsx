import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-4xl">
      <div className="max-w-container mx-auto px-xl py-3xl grid grid-cols-2 md:grid-cols-4 gap-xl">
        <div className="flex flex-col gap-md col-span-2 md:col-span-1">
          <Logo />
          <p className="text-[13px] text-text-secondary">© 2026 Kaalmo Somalia. Human-centered trust.</p>
        </div>
        <div className="flex flex-col gap-sm text-[13px]">
          <Link to="/how-it-works" className="text-text-secondary hover:text-primary transition-colors">How It Works</Link>
          <Link to="/safety" className="text-text-secondary hover:text-primary transition-colors">Safety &amp; Trust</Link>
        </div>
        <div className="flex flex-col gap-sm text-[13px]">
          <Link to="/help" className="text-text-secondary hover:text-primary transition-colors">Help Center</Link>
          <Link to="/contact" className="text-text-secondary hover:text-primary transition-colors">Contact</Link>
        </div>
        <div className="flex flex-col gap-sm text-[13px]">
          <Link to="/terms" className="text-text-secondary hover:text-primary transition-colors">Terms</Link>
          <Link to="/privacy" className="text-text-secondary hover:text-primary transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
