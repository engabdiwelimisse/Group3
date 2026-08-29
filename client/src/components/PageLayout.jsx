import Navbar from './Navbar';
import Footer from './Footer';

export default function PageLayout({ children, noFooter = false, minimalNav = false }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar minimal={minimalNav} />
      <main className="flex-grow w-full">{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
}
