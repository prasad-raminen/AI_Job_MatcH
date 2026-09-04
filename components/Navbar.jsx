'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: 'https://github.com/prasad-raminen/AI_Job_MatcH', label: 'GitHub', ext: true },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <Link href="/" className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <span>SkillMatch <span style={{ color: 'var(--accent-primary)' }}>AI</span></span>
        </Link>
        <div className="navbar-links desktop-nav">
          {links.map((l) =>
            l.ext ? (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
            ) : (
              <Link key={l.href} href={l.href} className={pathname === l.href ? 'nav-active' : ''}>{l.label}</Link>
            )
          )}
        </div>
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>
      {/* Mobile drawer */}
      <div className={`mobile-drawer ${menuOpen ? 'drawer-open' : ''}`}>
        <div className="drawer-overlay" onClick={() => setMenuOpen(false)} />
        <div className="drawer-panel">
          {links.map((l) =>
            l.ext ? (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="drawer-link">{l.label} ↗</a>
            ) : (
              <Link key={l.href} href={l.href} className={`drawer-link ${pathname === l.href ? 'nav-active' : ''}`} onClick={() => setMenuOpen(false)}>{l.label}</Link>
            )
          )}
        </div>
      </div>
    </>
  );
}
