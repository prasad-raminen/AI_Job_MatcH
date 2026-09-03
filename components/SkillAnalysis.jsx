'use client';
import { useState } from 'react';

export default function SkillAnalysis({ analysis }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!analysis) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📊</div>
        <h3>No Analysis Yet</h3>
        <p>Upload your resume first, then click &quot;Analyze Resume&quot;</p>
      </div>
    );
  }

  const scoreColor = analysis.overallScore >= 75
    ? 'var(--green)' : analysis.overallScore >= 50
    ? 'var(--amber)' : 'var(--red)';

  const copySuggestion = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Comprehensive AI Resume Audit & Marketability Assessment
        </span>
        <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
          🖨️ Export Audit Report
        </button>
      </div>

      {/* Overall Score */}
      <div className="glass-card" style={{ textAlign: 'center', marginBottom: '1.5rem', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontSize: '3.5rem', fontWeight: '800', color: scoreColor, lineHeight: 1 }}>
          {analysis.overallScore}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
          Overall Resume Quality Score (Out of 100)
        </div>
        <div className="progress-bar" style={{ maxWidth: '320px', margin: '0.75rem auto' }}>
          <div className="progress-fill" style={{ width: `${analysis.overallScore}%` }} />
        </div>
        {analysis.seniorityLevel && (
          <div className="skill-tag" style={{ marginTop: '1rem', background: 'rgba(99,102,241,0.2)', color: 'white', borderColor: 'var(--accent-primary)', padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
            💼 Assessed Seniority: <strong>{analysis.seniorityLevel}</strong>
          </div>
        )}
        {analysis.summary && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 0', lineHeight: '1.6' }}>
            {analysis.summary}
          </p>
        )}
      </div>

      <div className="analysis-grid">
        {/* Strengths */}
        {analysis.strengths?.length > 0 && (
          <div className="glass-card analysis-card">
            <h3>💪 Identified Strengths</h3>
            <ul className="analysis-list">
              {analysis.strengths.map((s, i) => (
                <li key={i}><span style={{ color: 'var(--green)', fontWeight: 'bold' }}>✓</span> {s}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {analysis.weaknesses?.length > 0 && (
          <div className="glass-card analysis-card">
            <h3>⚠️ Areas to Improve</h3>
            <ul className="analysis-list">
              {analysis.weaknesses.map((w, i) => (
                <li key={i}><span style={{ color: 'var(--amber)', fontWeight: 'bold' }}>!</span> {w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Top Skills */}
        {analysis.topSkills?.length > 0 && (
          <div className="glass-card analysis-card">
            <h3>⭐ Top Marketable Skills</h3>
            <div className="skills-grid">
              {analysis.topSkills.map((s, i) => (
                <span key={i} className="skill-tag match">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Industry Fit */}
        {analysis.industryFit?.length > 0 && (
          <div className="glass-card analysis-card">
            <h3>🏢 Best Industry Fit</h3>
            <div className="skills-grid">
              {analysis.industryFit.map((ind, i) => (
                <span key={i} className="skill-tag">{ind}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {analysis.suggestions?.length > 0 && (
        <div className="glass-card analysis-card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>💡 Actionable Resume Enhancements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analysis.suggestions.map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span className={`priority-${s.priority}`} style={{ fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase', padding: '0.15rem 0.5rem', borderRadius: '4px', background: s.priority === 'high' ? 'rgba(239,68,68,0.15)' : s.priority === 'medium' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)' }}>
                      {s.priority} priority
                    </span>
                    <span className="skill-tag" style={{ fontSize: '0.7rem' }}>{s.category}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'white', lineHeight: '1.5' }}>
                    {s.suggestion}
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => copySuggestion(s.suggestion, i)}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                >
                  {copiedIndex === i ? 'Copied! ✓' : '📋 Copy Suggestion'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
