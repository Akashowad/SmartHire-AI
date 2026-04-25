import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-light)',
    }}>
      <div className="container flex-between" style={{ height: '64px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: '34px',
            height: '34px',
            background: 'var(--primary-900)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Briefcase size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.25rem',
            color: 'var(--text-heading)',
            letterSpacing: '-0.03em',
          }}>
            SmartHire
          </span>
        </Link>

        <div className="hide-mobile flex" style={{ gap: '2rem', alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                textDecoration: 'none',
                color: location.pathname === link.to ? 'var(--text-heading)' : 'var(--text-muted)',
                fontWeight: location.pathname === link.to ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={e => { if (location.pathname !== link.to) e.target.style.color = 'var(--text-heading)'; }}
              onMouseLeave={e => { if (location.pathname !== link.to) e.target.style.color = 'var(--text-muted)'; }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hide-mobile flex" style={{ gap: '0.75rem', alignItems: 'center' }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm" style={{ color: 'var(--text-body)' }}>
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="hide-desktop"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="container" style={{
          paddingBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              style={{
                textDecoration: 'none',
                color: location.pathname === link.to ? 'var(--text-heading)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

