'use client';
import { useState } from 'react';

export default function JobSearch({ onJobsFound, onAddManualJob, loading }) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [showManual, setShowManual] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      const params = new URLSearchParams({ q: query });
      if (location.trim()) params.set('location', location);
      const res = await fetch(`/api/search-jobs?${params}`);
      const data = await res.json();
      if (data.success) {
        onJobsFound(data.jobs, data.source);
      } else {
        alert('Error: ' + (data.error || 'Search failed'));
      }
    } catch (err) {
      alert('Error searching: ' + err.message);
    }
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
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          className="input"
          placeholder="Job title (e.g. Software Engineer)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          className="input"
          placeholder="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ maxWidth: '200px' }}
        />
        <button className="btn btn-primary" type="submit" disabled={loading || !query.trim()}>
          {loading ? '⏳' : '🔍'} Search
        </button>
      </form>

      <div style={{ marginTop: '1rem' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowManual(!showManual)}
        >
          {showManual ? '✕ Cancel' : '📋 Paste Job Description'}
        </button>
      </div>

      {showManual && (
        <div className="paste-job-section glass-card" style={{ marginTop: '1rem' }}>
          <h3>Add Custom Job Description</h3>
          <div className="input-group" style={{ marginBottom: '0.75rem' }}>
            <label>Job Title</label>
            <input
              className="input"
              placeholder="e.g. Senior Frontend Developer"
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
            />
          </div>
          <div className="input-group" style={{ marginBottom: '0.75rem' }}>
            <label>Job Description</label>
            <textarea
              className="textarea"
              placeholder="Paste the full job description here..."
              value={manualDesc}
              onChange={(e) => setManualDesc(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddManual}
            disabled={!manualDesc.trim()}
          >
            ➕ Add Job
          </button>
        </div>
      )}
    </div>
  );
}
