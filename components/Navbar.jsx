'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        <span className="logo-icon">⚡</span>
        <span>SkillMatch <span style={{ color: 'var(--accent-primary)' }}>AI</span></span>
      </Link>
      <div className="navbar-links">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <a href="https://github.com/prasad-raminen/Skillians" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
    </nav>
  );
}
