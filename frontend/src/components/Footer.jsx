import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Linkedin, Twitter, Github, Mail } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    Product: [
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Integrations', to: '#' },
      { label: 'API Docs', to: '#' },
    ],
    Company: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '#' },
      { label: 'Press', to: '#' },
      { label: 'Contact', to: '/contact' },
    ],
    Resources: [
      { label: 'Blog', to: '#' },
      { label: 'Help Center', to: '#' },
      { label: 'Community', to: '#' },
      { label: 'Status', to: '#' },
    ],
    Legal: [
      { label: 'Privacy Policy', to: '#' },
      { label: 'Terms of Service', to: '#' },
      { label: 'Cookie Policy', to: '#' },
      { label: 'GDPR', to: '#' },
    ],
  };

  return (
    <footer style={{
      background: 'var(--primary-900)',
      color: 'var(--primary-300)',
      borderTop: '1px solid var(--primary-800)',
    }}>
      <div className="container py-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2.5rem' }}>
        <div style={{ minWidth: '200px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '1rem' }}>
            <div style={{
              width: '30px',
              height: '30px',
              background: 'var(--accent-500)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Briefcase size={15} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.1rem',
              color: '#fff',
            }}>
              SmartHire
            </span>
          </Link>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--primary-400)', maxWidth: '260px' }}>
            Enterprise-grade AI recruitment platform. Automate hiring, match candidates intelligently, and scale with confidence.
          </p>
          <div className="flex" style={{ gap: '0.75rem', marginTop: '1.25rem' }}>
            <a href="#" style={{ color: 'var(--primary-400)', transition: 'var(--transition-fast)' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'var(--primary-400)'}><Linkedin size={18} /></a>
            <a href="#" style={{ color: 'var(--primary-400)', transition: 'var(--transition-fast)' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'var(--primary-400)'}><Twitter size={18} /></a>
            <a href="#" style={{ color: 'var(--primary-400)', transition: 'var(--transition-fast)' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'var(--primary-400)'}><Github size={18} /></a>
            <a href="#" style={{ color: 'var(--primary-400)', transition: 'var(--transition-fast)' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = 'var(--primary-400)'}><Mail size={18} /></a>
          </div>
        </div>

        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category}>
            <h4 style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              {category}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {links.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    style={{
                      color: 'var(--primary-400)',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      transition: 'var(--transition-fast)',
                    }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'var(--primary-400)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--primary-800)' }}>
        <div className="container flex-between" style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--primary-500)' }}>
            &copy; {new Date().getFullYear()} SmartHire AI, Inc. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--primary-500)' }}>
            Built for modern talent teams.
          </p>
        </div>
      </div>
    </footer>
  );
}

