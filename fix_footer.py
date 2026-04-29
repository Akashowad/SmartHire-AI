content = r'''import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Linkedin, Twitter, Github, Mail } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    Product: [
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'API Docs', to: '#' },
    ],
    Company: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '#' },
      { label: 'Contact', to: '/contact' },
    ],
    Resources: [
      { label: 'Blog', to: '#' },
      { label: 'Help Center', to: '#' },
      { label: 'Status', to: '#' },
    ],
    Legal: [
      { label: 'Privacy', to: '#' },
      { label: 'Terms', to: '#' },
      { label: 'GDPR', to: '#' },
    ],
  };

  return (
    <footer style={{
      background: 'var(--bg-surface)',
      color: 'var(--text-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: '3rem',
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2.5rem', paddingBottom: '2.5rem' }}>
        <div style={{ minWidth: '200px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '1rem' }}>
            <div style={{
              width: '30px',
              height: '30px',
              background: 'var(--accent-gradient)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Zap size={15} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{
              fontWeight: 800,
              fontSize: '1.1rem',
              color: '#fff',
            }}>
              SmartHire
            </span>
          </Link>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-muted)', maxWidth: '260px' }}>
            Recruitment software that parses resumes, scores matches, and helps you hire faster.
          </p>
          <div className="flex" style={{ gap: '0.75rem', marginTop: '1.25rem' }}>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'var(--transition-fast)' }}><Linkedin size={18} /></a>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'var(--transition-fast)' }}><Twitter size={18} /></a>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'var(--transition-fast)' }}><Github size={18} /></a>
            <a href="#" style={{ color: 'var(--text-muted)', transition: 'var(--transition-fast)' }}><Mail size={18} /></a>
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
                    style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', transition: 'var(--transition-fast)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container flex-between" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} SmartHire AI, Inc.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Built for modern talent teams.
          </p>
        </div>
    </footer>
  );
}
'''

with open(r'frontend/src/components/Footer.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('Footer.jsx fixed')
