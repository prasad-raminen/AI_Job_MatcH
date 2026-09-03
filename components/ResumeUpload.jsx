'use client';
import { useState, useRef } from 'react';
import { sampleResume, sampleFrontendResume } from '@/lib/sampleData';

export default function ResumeUpload({ onParsed, loading }) {
  const [mode, setMode] = useState('upload'); // 'upload' or 'paste'
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

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
      } else {
        alert('Error: ' + (data.error || 'Failed to parse resume'));
      }
    } catch (err) {
      alert('Error parsing resume: ' + err.message);
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
      } else {
        alert('Error: ' + (data.error || 'Failed to parse resume'));
      }
    } catch (err) {
      alert('Error parsing resume: ' + err.message);
    }
  };

  const handleLoadSample = (sampleObj) => {
    const formattedRawText = `${sampleObj.name}\n${sampleObj.email} | ${sampleObj.phone} | ${sampleObj.location}\n\nSUMMARY:\n${sampleObj.summary}\n\nSKILLS:\n${sampleObj.skills.join(', ')}\n\nEXPERIENCE:\n` +
      sampleObj.experience.map(e => `${e.title} - ${e.company} (${e.duration})\n` + e.highlights.map(h => `- ${h}`).join('\n')).join('\n');
    
    onParsed(sampleObj, formattedRawText);
  };

  return (
    <div>
      {/* Quick Demo Preloads */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', borderColor: 'rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white' }}>
              ⚡ Instant Demo Mode (For HR Review & Quick Testing)
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Don't have a PDF ready? Click a sample profile below to parse instantly:
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleLoadSample(sampleResume)}
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              👨‍💻 Alex (Full-Stack Eng)
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleLoadSample(sampleFrontendResume)}
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              👩‍💻 Sara (Frontend Dev)
            </button>
          </div>
        </div>
      </div>

      <div className="mode-toggle">
        <button
          className={`btn btn-sm ${mode === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMode('upload')}
        >
          📄 Upload PDF / TXT
        </button>
        <button
          className={`btn btn-sm ${mode === 'paste' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMode('paste')}
        >
          ✏️ Paste Resume Text
        </button>
      </div>

      {mode === 'upload' ? (
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          onClick={() => fileRef.current?.click()}
        >
          <div className="upload-icon">📄</div>
          <p className="upload-text">
            {fileName
              ? `Selected: ${fileName}`
              : 'Drag & drop your resume PDF here, or click to browse'}
          </p>
          <p className="upload-hint">Supports PDF, TXT, and DOC formats</p>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={(e) => handleFile(e.target.files[0])}
            style={{ display: 'none' }}
          />
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
          <button
            className="btn btn-primary"
            onClick={handlePaste}
            disabled={loading || !text.trim()}
            style={{ marginTop: '1rem' }}
          >
            {loading ? '⏳ Parsing...' : '🚀 Parse Resume'}
          </button>
        </div>
      )}
    </div>
  );
}

