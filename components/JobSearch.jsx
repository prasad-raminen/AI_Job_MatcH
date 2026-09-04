'use client';
import { useState, useEffect } from 'react';

const PRESET_KEYWORDS = ['Software Engineer', 'Frontend Engineer', 'Full Stack', 'Python Developer', 'DevOps', 'Data Scientist'];

export default function JobSearch({ onJobsFound, onAddManualJob, loading }) {
  const [query, setQuery] = useState('Software Engineer');
  const [location, setLocation] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [showManual, setShowManual] = useState(false);

  // Auto load initial jobs on mount
  useEffect(() => {
    fetchJobs('Software Engineer', '');
  }, []);

  const fetchJobs = async (searchQuery, searchLoc) => {
    try {
      const params = new URLSearchParams({ q: searchQuery || 'software engineer' });
      if (searchLoc?.trim()) params.set('location', searchLoc);
      const res = await fetch(`/api/search-jobs?${params}`);
      const data = await res.json();
      if (data.success) {
        onJobsFound(data.jobs, data.source);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    await fetchJobs(query, location);
  };

  const handlePresetClick = (preset) => {
    setQuery(preset);
    fetchJobs(preset, location);
  };

  const handleAddManual = () => {
    if (!manualDesc.trim()) return;
    onAddManualJob({
      id: 'manual-' + Date.now(),
      title: manualTitle || 'Custom Job',
      company: 'Manual Entry',
      location: '',
      salary: '',
      description: manualDesc,
      url: '',
      created: new Date().toISOString(),
    });
    setManualDesc('');
    setManualTitle('');
    setShowManual(false);
  };

  return (
    <div>
      <form className="search-bar-v2" onSubmit={handleSearch}>
        <div className="search-input-group">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Job title (e.g. Software Engineer)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="search-input-group search-loc">
          <span className="search-icon">📍</span>
          <input
            className="search-input"
            placeholder="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading || !query.trim()}>
          {loading ? '⏳' : '🔍'} Search
        </button>
      </form>

      {/* Quick Filter Chips */}
      <div className="filter-chips">
        <span className="filter-label">Quick:</span>
        {PRESET_KEYWORDS.map((kw) => (
          <button
            key={kw}
            className={`filter-chip ${query === kw ? 'chip-active' : ''}`}
            onClick={() => handlePresetClick(kw)}
          >
            {kw}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowManual(!showManual)}>
          {showManual ? '✕ Cancel' : '📋 Paste Custom Job Description'}
        </button>
      </div>

      <div className={`manual-job-section ${showManual ? 'manual-open' : ''}`}>
        <div className="glass-card" style={{ marginTop: '1rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', fontWeight: '600' }}>Add Custom Job Description</h3>
          <div className="input-group" style={{ marginBottom: '0.75rem' }}>
            <label>Job Title</label>
            <input className="input" placeholder="e.g. Senior Frontend Developer" value={manualTitle} onChange={(e) => setManualTitle(e.target.value)} />
          </div>
          <div className="input-group" style={{ marginBottom: '0.75rem' }}>
            <label>Job Description</label>
            <textarea className="textarea" placeholder="Paste the full job description here..." value={manualDesc} onChange={(e) => setManualDesc(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-sm" onClick={handleAddManual} disabled={!manualDesc.trim()}>
            ➕ Add Job
          </button>
        </div>
      </div>
    </div>
  );
}
