import React, { useState, useRef } from 'react';
import { apiClient } from '../api';

export default function UploadModal({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const data = await apiClient('/resumes/upload-resume', {
        method: 'POST',
        body: formData,
      });
      onUploadSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in p-4 text-center mx-auto" style={{ maxWidth: '650px', marginTop: '6rem' }}>
      <div className="mb-4">
        <h2 className="mb-1" style={{ fontSize: '2.2rem', fontWeight: '700' }}>Upload your Resume</h2>
        <p className="text-secondary" style={{ fontSize: '1.1rem' }}>Let our AI engine find and secure your perfect job match.</p>
      </div>

      <div 
        className={`file-drop-zone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
      >
        {file ? (
          <div className="flex-col flex-center gap-1">
            <span style={{ fontSize: '2rem' }}>📄</span>
            <p className="text-accent" style={{ fontWeight: 600 }}>{file.name}</p>
            <p className="text-secondary" style={{ fontSize: '0.85rem' }}>Click or drag to replace</p>
          </div>
        ) : (
          <div className="flex-col flex-center gap-2">
            <span style={{ fontSize: '3rem', opacity: 0.8 }}>📁</span>
            <p className="text-secondary" style={{ fontSize: '1.1rem' }}>
              Drag and drop your PDF here, or click to browse
            </p>
            <button className="btn">Select File</button>
          </div>
        )}
        <input 
          type="file" 
          ref={inputRef} 
          style={{ display: 'none' }} 
          accept="application/pdf"
          onChange={handleChange}
        />
      </div>

      {error && <p className="text-danger mt-3 badge badge-danger">{error}</p>}
      
      <div className="mt-4">
        <button 
          className="btn btn-primary" 
          onClick={onUpload}
          disabled={!file || loading}
          style={{ width: '100%', padding: '1rem', fontSize: '1.15rem' }}
        >
          {loading ? (
            <span className="flex-center gap-2"><span className="spinner"></span> Analyzing Resume...</span>
          ) : 'Start Matching'}
        </button>
      </div>
    </div>
  );
}
