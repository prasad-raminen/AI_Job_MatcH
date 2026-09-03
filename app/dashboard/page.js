'use client';

import { useState, useEffect, useCallback } from 'react';
import ResumeUpload from '@/components/ResumeUpload';
import ResumePreview from '@/components/ResumePreview';
import JobSearch from '@/components/JobSearch';
import JobCard from '@/components/JobCard';
import MatchResults from '@/components/MatchResults';
import SkillAnalysis from '@/components/SkillAnalysis';
import LoadingSpinner from '@/components/LoadingSpinner';

const TABS = [
  { id: 'upload', label: '📄 Resume', icon: '📄' },
  { id: 'jobs', label: '🔍 Find Jobs', icon: '🔍' },
  { id: 'matches', label: '🎯 Matches', icon: '🎯' },
  { id: 'analysis', label: '📊 Analysis', icon: '📊' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('upload');
  const [resume, setResume] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobs, setJobs] = useState([]);
  const [jobSource, setJobSource] = useState('');
  const [selectedJobs, setSelectedJobs] = useState(new Set());
  const [matches, setMatches] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState({
    parsing: false,
    searching: false,
    matching: false,
    analyzing: false,
  });

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('skillmatch_data');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.resume) setResume(data.resume);
        if (data.resumeText) setResumeText(data.resumeText);
        if (data.matches) setMatches(data.matches);
        if (data.analysis) setAnalysis(data.analysis);
      }
    } catch {}
  }, []);

  // Save to localStorage whenever key data changes
  const saveData = useCallback((newData) => {
    try {
      const existing = JSON.parse(localStorage.getItem('skillmatch_data') || '{}');
      localStorage.setItem('skillmatch_data', JSON.stringify({ ...existing, ...newData }));
    } catch {}
  }, []);

  const handleResumeParsed = (data, rawText) => {
    setResume(data);
    setResumeText(rawText);
    setLoading((l) => ({ ...l, parsing: false }));
    saveData({ resume: data, resumeText: rawText });
  };

  const handleJobsFound = (newJobs, source) => {
    setJobs(newJobs);
    setJobSource(source);
    setSelectedJobs(new Set());
    setLoading((l) => ({ ...l, searching: false }));
  };

  const handleAddManualJob = (job) => {
    setJobs((prev) => [job, ...prev]);
  };

  const toggleJob = (id) => {
    setSelectedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleMatch = async () => {
    if (!resume || selectedJobs.size === 0) {
      alert('Please upload a resume and select at least one job');
      return;
    }
    setLoading((l) => ({ ...l, matching: true }));
    setActiveTab('matches');
    try {
      const selected = jobs.filter((j) => selectedJobs.has(j.id));
      const res = await fetch('/api/match-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobs: selected }),
      });
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches);
        saveData({ matches: data.matches });
      } else {
        alert('Error: ' + (data.error || 'Matching failed'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setLoading((l) => ({ ...l, matching: false }));
  };

  const handleAnalyze = async () => {
    if (!resume) {
      alert('Please upload a resume first');
      return;
    }
    setLoading((l) => ({ ...l, analyzing: true }));
    try {
      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume }),
      });
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
        saveData({ analysis: data.analysis });
      } else {
        alert('Error: ' + (data.error || 'Analysis failed'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setLoading((l) => ({ ...l, analyzing: false }));
  };

  const clearData = () => {
    setResume(null);
    setResumeText('');
    setJobs([]);
    setSelectedJobs(new Set());
    setMatches([]);
    setAnalysis(null);
    localStorage.removeItem('skillmatch_data');
    setActiveTab('upload');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {resume && (
            <button className="btn btn-secondary btn-sm" onClick={clearData}>
              🗑️ Clear All
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '2rem' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id === 'matches' && matches.length > 0 && (
              <span style={{ marginLeft: '0.25rem', opacity: 0.7 }}>({matches.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* UPLOAD TAB */}
        {activeTab === 'upload' && (
          <div>
            {!resume ? (
              <>
                <div className="section-header">
                  <h2>Upload Your Resume</h2>
                </div>
                <ResumeUpload
                  onParsed={handleResumeParsed}
                  loading={loading.parsing}
                />
                {loading.parsing && <LoadingSpinner text="AI is parsing your resume..." />}
              </>
            ) : (
              <>
                <div className="section-header">
                  <h2>Your Resume</h2>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => { setResume(null); setResumeText(''); }}
                  >
                    📄 Upload New
                  </button>
                </div>
                <ResumePreview resume={resume} />
              </>
            )}
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div>
            <div className="section-header">
              <h2>Find Jobs</h2>
              {selectedJobs.size > 0 && (
                <button className="btn btn-primary btn-sm" onClick={handleMatch}>
                  🎯 Match {selectedJobs.size} Job{selectedJobs.size > 1 ? 's' : ''}
                </button>
              )}
            </div>

            {!resume && (
              <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem', borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.05)' }}>
                ⚠️ Upload your resume first for best results. You can still search and browse jobs.
              </div>
            )}

            <JobSearch
              onJobsFound={handleJobsFound}
              onAddManualJob={handleAddManualJob}
              loading={loading.searching}
            />

            {loading.searching && <LoadingSpinner text="Searching for jobs..." />}

            {jobs.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {jobs.length} job{jobs.length > 1 ? 's' : ''} found
                    {jobSource === 'sample' && ' (sample data — configure Adzuna API for real results)'}
                  </span>
                  {jobs.length > 1 && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        if (selectedJobs.size === jobs.length) setSelectedJobs(new Set());
                        else setSelectedJobs(new Set(jobs.map((j) => j.id)));
                      }}
                    >
                      {selectedJobs.size === jobs.length ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>
                <div className="jobs-grid">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      selected={selectedJobs.has(job.id)}
                      onToggle={toggleJob}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* MATCHES TAB */}
        {activeTab === 'matches' && (
          <div>
            <div className="section-header">
              <h2>Match Results</h2>
            </div>
            {loading.matching ? (
              <LoadingSpinner text="AI is analyzing job matches... This may take a moment." />
            ) : (
              <MatchResults matches={matches} resume={resume} />
            )}
          </div>
        )}

        {/* ANALYSIS TAB */}
        {activeTab === 'analysis' && (
          <div>
            <div className="section-header">
              <h2>Resume Analysis</h2>
              {resume && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleAnalyze}
                  disabled={loading.analyzing}
                >
                  {loading.analyzing ? '⏳ Analyzing...' : '🔄 Analyze Resume'}
                </button>
              )}
            </div>
            {loading.analyzing ? (
              <LoadingSpinner text="AI is deeply analyzing your resume..." />
            ) : (
              <SkillAnalysis analysis={analysis} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
