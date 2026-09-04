'use client';
import { useState, useRef } from 'react';
import { sampleResume, sampleFrontendResume } from '@/lib/sampleData';
import { useToast } from './Toast';

export default function ResumeUpload({ onParsed, loading }) {
  const [mode, setMode] = useState('upload');
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const toast = useToast();

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);

    const formData = new FormData();
    if (file.type === 'application/pdf') {
      formData.append('resume', file);
    } else {
      const fileText = await file.text();
      formData.append('text', fileText);
    }

    try {
      const res = await fetch('/api/parse-resume', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        onParsed(data.data, data.rawText);
        toast('Resume parsed successfully!', 'success');
      } else {
        toast(data.error || 'Failed to parse resume', 'error');
      }
    } catch (err) {
      toast('Error parsing resume: ' + err.message, 'error');
    }
  };

  const handlePaste = async () => {
    if (!text.trim()) return;
    try {
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.success) {
        onParsed(data.data, text);
        toast('Resume parsed successfully!', 'success');
      } else {
        toast(data.error || 'Failed to parse resume', 'error');
      }
    } catch (err) {
      toast('Error parsing resume: ' + err.message, 'error');
    }
  };

  const handleLoadSample = (sampleObj) => {
    const formattedRawText = `${sampleObj.name}\n${sampleObj.email} | ${sampleObj.phone} | ${sampleObj.location}\n\nSUMMARY:\n${sampleObj.summary}\n\nSKILLS:\n${sampleObj.skills.join(', ')}\n\nEXPERIENCE:\n` +
      sampleObj.experience.map(e => `${e.title} - ${e.company} (${e.duration})\n` + e.highlights.map(h => `- ${h}`).join('\n')).join('\n');
    
    onParsed(sampleObj, formattedRawText);
    toast(`Loaded ${sampleObj.name}'s sample resume`, 'success');
  };

  return (
    <div>
      {/* Demo Mode Banner */}
      <div className="demo-banner">
        <div className="demo-banner-content">
          <div>
            <div className="demo-banner-title">⚡ Instant Demo Mode</div>
            <div className="demo-banner-sub">No PDF ready? Try a sample profile instantly:</div>
          </div>
          <div className="demo-banner-btns">
            <button className="btn btn-glass btn-sm" onClick={() => handleLoadSample(sampleResume)}>
              👨‍💻 Alex (Full-Stack)
            </button>
            <button className="btn btn-glass btn-sm" onClick={() => handleLoadSample(sampleFrontendResume)}>
              👩‍💻 Sara (Frontend)
            </button>
          </div>
        </div>
      </div>

      <div className="mode-toggle">
        <button className={`btn btn-sm ${mode === 'upload' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('upload')}>
          📄 Upload PDF / TXT
        </button>
        <button className={`btn btn-sm ${mode === 'paste' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('paste')}>
          ✏️ Paste Resume Text
        </button>
      </div>

      {mode === 'upload' ? (
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
        >
          <div className="upload-icon-wrapper">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="8" width="40" height="32" rx="4" stroke="var(--accent-primary)" strokeWidth="2" fill="rgba(99,102,241,0.08)" />
              <path d="M24 18v12M18 24l6-6 6 6" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="upload-text">
            {fileName ? `Selected: ${fileName}` : 'Drag & drop your resume here, or click to browse'}
          </p>
          <p className="upload-hint">Supports PDF, TXT, and DOC formats</p>
          <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" onChange={(e) => handleFile(e.target.files[0])} style={{ display: 'none' }} />
        </div>
      ) : (
        <div>
          <textarea
            className="textarea"
            placeholder="Paste your resume text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ minHeight: '200px' }}
          />
          <button className="btn btn-primary" onClick={handlePaste} disabled={loading || !text.trim()} style={{ marginTop: '1rem' }}>
            {loading ? '⏳ Parsing...' : '🚀 Parse Resume'}
          </button>
        </div>
      )}
    </div>
  );
}
