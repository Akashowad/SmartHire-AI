import React, { useState } from 'react';
import { apiClient } from '../api';
import { useApp } from '../context/AppContext';

export default function UploadModal({ onUploadSuccess }) {
  const { updateResume, setLoading, setError } = useApp();
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const data = await apiClient('/resumes/upload-resume', { method: 'POST', body: formData });
      updateResume(data);
      onUploadSuccess?.();
    } catch (err) {
      setError(err.message || 'Failed to upload resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome to SmartHire</h2>
          <p className="text-secondary" style={{ fontSize: '0.95rem' }}>Upload your resume to initialize your AI Career Profile and match with live remote roles.</p>
        </div>

        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const dropped = e.dataTransfer.files[0];
            if (dropped) setFile(dropped);
          }}
          style={{
            border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--glass-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.02)',
            transition: 'var(--transition)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div style={{ fontSize: '2.5rem' }}>{file ? '📄' : '☁️'}</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>
              {file ? file.name : 'Drag & drop your resume'}
            </p>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Supports PDF and Word (.docx)</p>
          </div>
          
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept=".pdf,.docx,.doc" 
            style={{ display: 'none' }} 
            id="file-upload" 
          />
          <label htmlFor="file-upload" className="btn btn-secondary">
            {file ? 'Change File' : 'Browse Computer'}
          </label>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', height: '48px' }} 
          disabled={!file}
          onClick={handleUpload}
        >
          Initialize AI Profile 🚀
        </button>
      </div>
    </div>
  );
}
