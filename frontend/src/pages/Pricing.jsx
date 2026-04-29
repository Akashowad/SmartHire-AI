import React from 'react';
import { Link } from 'react-router-dom';

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      desc: 'Perfect for individual job seekers.',
      features: ['Resume parsing', 'Basic job search', '5 AI match scores/month', 'Community support'],
      cta: 'Get Started',
      primary: false
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      desc: 'For serious candidates and small teams.',
      features: ['Everything in Free', 'Unlimited AI match scores', 'AI cover letters & emails', 'Application tracking', 'Priority support'],
      cta: 'Start Pro Trial',
      primary: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      desc: 'For talent teams hiring at scale.',
      features: ['Everything in Pro', 'Custom integrations', 'SSO & SAML', 'Dedicated account manager', 'SLA guarantee'],
      cta: 'Contact Sales',
      primary: false
    }
  ];

  return (
    <div className="animate-fade-in container" style={{ paddingTop:'4rem', paddingBottom:'4rem' }}>
      <div className="text-center" style={{ marginBottom:'3rem' }}>
        <h1 style={{ fontSize:'2.5rem', fontWeight:800, marginBottom:'1rem' }}>Simple, transparent pricing</h1>
        <p style={{ color:'var(--text-secondary)', maxWidth:'600px', margin:'0 auto' }}>Start free. Scale as you grow. No hidden fees.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'1.5rem', maxWidth:'1000px', margin:'0 auto' }}>
        {plans.map(plan => (
          <div key={plan.name} className="glass-panel" style={{ padding:'2rem', display:'flex', flexDirection:'column', border: plan.primary ? '1px solid var(--accent)' : '1px solid var(--glass-border)' }}>
            <h3 style={{ fontSize:'1rem', fontWeight:600, color:'var(--text-secondary)', textTransform:'uppercase' }}>{plan.name}</h3>
            <div style={{ margin:'1rem 0' }}>
              <span style={{ fontSize:'2.5rem', fontWeight:800 }}>{plan.price}</span>
              <span style={{ color:'var(--text-muted)' }}>{plan.period}</span>
            </div>
            <p style={{ color:'var(--text-secondary)', marginBottom:'1.5rem' }}>{plan.desc}</p>
            <ul style={{ listStyle:'none', flex:1, marginBottom:'1.5rem' }}>
              {plan.features.map(f => (
                <li key={f} style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem', fontSize:'0.9rem' }}>
                  <span style={{ color:'var(--success)' }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <Link to="/signup" className={`btn ${plan.primary ? 'btn-primary' : 'btn-secondary'}`} style={{ width:'100%', textAlign:'center', textDecoration:'none' }}>{plan.cta}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

