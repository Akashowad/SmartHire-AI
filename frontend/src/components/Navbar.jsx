import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
background: var(--bg-surface),
      borderBottom: '1px solid var(--border-light)',
    }}>
      <div className="container flex-between" style={{ height: '68px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'var(--accent-gradient)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
          }}>
            <Zap size={18} color="var(--primary-green)" strokeWidth={2.5} />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.3rem',
            color: 'var(--primary-dark)',
            letterSpacing: '-0.03em',
          }}>SmartHire</span>
        </Link>

        <div className="hide-mobile flex" style={{ gap: '2rem', alignItems: 'center' }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                textDecoration: 'none',
                color: isActive(link.to) ? '#fff' : 'var(--text-secondary)',
                fontWeight: isActive(link.to) ? 600 : 500,
                fontSize: '0.9rem',
                transition: 'var(--transition-fast)',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!isActive(link.to)) e.target.style.color = '#fff'; }}
              onMouseLeave={e => { if (!isActive(link.to)) e.target.style.color = 'var(--text-secondary)'; }}
            >
              {link.label}
              {isActive(link.to) && (
                <span style={{
                  position: 'absolute',
                  bottom: '-6px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '16px',
                  height: '2px',
                  background: 'var(--accent-gradient)',
                  borderRadius: '1px',
                }} />
              )}
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
              <Link to="/login" className="btn btn-ghost btn-sm" style={{ color: 'var(--text-secondary)' }}>
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
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'none' }}
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
                color: isActive(link.to) ? '#fff' : 'var(--text-secondary)',
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

