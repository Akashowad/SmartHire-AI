import React, { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="animate-fade-in container" style={{ paddingTop:'4rem', paddingBottom:'4rem', maxWidth:'600px' }}>
      <div className="text-center" style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontSize:'2rem', fontWeight:800, marginBottom:'0.5rem' }}>Contact Us</h1>
        <p style={{ color:'var(--text-secondary)' }}>Have questions? We would love to hear from you.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding:'2rem', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
        {submitted && (
          <div style={{ padding:'1rem', borderRadius:'var(--radius-sm)', background:'rgba(16,185,129,0.1)', color:'var(--success)', textAlign:'center' }}>
            Message sent successfully! We will get back to you soon.
          </div>
        )}
        <div>
          <label style={{ display:'block', fontSize:'0.85rem', fontWeight:600, marginBottom:'0.35rem' }}>Name</label>
          <input type="text" className="search-field" style={{ width:'100%', borderRadius:'var(--radius-sm)', border:'1px solid var(--glass-border)', padding:'0.7rem 1rem' }} required placeholder="Your name" />
        </div>
        <div>
          <label style={{ display:'block', fontSize:'0.85rem', fontWeight:600, marginBottom:'0.35rem' }}>Email</label>
          <input type="email" className="search-field" style={{ width:'100%', borderRadius:'var(--radius-sm)', border:'1px solid var(--glass-border)', padding:'0.7rem 1rem' }} required placeholder="you@company.com" />
        </div>
        <div>
          <label style={{ display:'block', fontSize:'0.85rem', fontWeight:600, marginBottom:'0.35rem' }}>Message</label>
          <textarea className="search-field" style={{ width:'100%', borderRadius:'var(--radius-sm)', border:'1px solid var(--glass-border)', padding:'0.7rem 1rem', minHeight:'120px', resize:'vertical' }} required placeholder="How can we help?"></textarea>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width:'100%' }}>Send Message</button>
      </form>
    </div>
  );
}

