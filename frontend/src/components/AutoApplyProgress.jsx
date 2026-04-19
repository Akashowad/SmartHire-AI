import React, { useState, useEffect } from 'react';

const STEPS = [
  { id: 'profile', label: 'Analyzing Profile fit', icon: '👤' },
  { id: 'tailor', label: 'Tailoring Application', icon: '🎯' },
  { id: 'draft', label: 'Generating Cover Letter', icon: '📝' },
  { id: 'submit', label: 'Submitting Application', icon: '🚀' }
];

export default function AutoApplyProgress({ job, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < STEPS.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [currentStep, onComplete]);

  return (
    <div className="flex-center" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
      zIndex: 2000, padding: '2rem'
    }}>
      <div className="glass-panel text-center" style={{ maxWidth: '500px', width: '100%', padding: '3rem' }}>
        <h2 className="text-accent mb-2" style={{ fontSize: '1.8rem', fontWeight: 700 }}>AI Auto-Apply</h2>
        <p className="text-secondary mb-4">Applying to <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{job.title}</span> at {job.company}</p>

        <div className="flex-col gap-3 text-left">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.id} className="flex-between" style={{
                opacity: isCompleted || isCurrent ? 1 : 0.4,
                transition: 'all 0.3s ease',
                padding: '0.8rem',
                borderRadius: '12px',
                background: isCurrent ? 'rgba(255,255,255,0.05)' : 'transparent',
                border: isCurrent ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent'
              }}>
                <div className="flex-center gap-2">
                  <span style={{ fontSize: '1.2rem' }}>{step.icon}</span>
                  <span style={{ fontWeight: isCurrent ? 600 : 400, color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{step.label}</span>
                </div>
                {isCompleted ? (
                  <span className="text-success" style={{ fontWeight: 'bold' }}>✓</span>
                ) : isCurrent ? (
                  <span className="spinner" style={{ width: '16px', height: '16px', borderTopColor: 'var(--accent)' }}></span>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-4" style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ 
                height: '100%', 
                background: 'var(--accent-gradient)', 
                width: `${(currentStep / STEPS.length) * 100}%`,
                transition: 'width 0.4s ease'
            }} />
        </div>
      </div>
    </div>
  );
}
