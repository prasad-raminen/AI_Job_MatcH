'use client';
import { useState } from 'react';
import { useToast } from './Toast';

function ScoreGauge({ score }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)';

  return (
    <div className="gauge-wrapper">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-value" style={{ color }}>{score}</span>
        <span className="gauge-label">/ 100</span>
      </div>
    </div>
  );
}

export default function SkillAnalysis({ analysis }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const toast = useToast();

  if (!analysis) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📊</div>
        <h3>No Analysis Yet</h3>
        <p>Upload your resume first, then click &quot;Analyze Resume&quot;</p>
      </div>
    );
  }

  const copySuggestion = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast('Suggestion copied!', 'success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Comprehensive AI Resume Audit & Marketability Assessment
        </span>
        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
          🖨️ Export Report
        </button>
      </div>

      {/* Overall Score Gauge */}
      <div className="glass-card score-hero-card">
        <ScoreGauge score={analysis.overallScore} />
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Overall Resume Quality Score
        </div>
        {analysis.seniorityLevel && (
          <div className="seniority-badge">
            💼 Assessed Seniority: <strong>{analysis.seniorityLevel}</strong>
          </div>
        )}
        {analysis.summary && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem', maxWidth: '600px', lineHeight: '1.6', textAlign: 'center' }}>
            {analysis.summary}
          </p>
        )}
      </div>

      <div className="analysis-grid">
        {analysis.strengths?.length > 0 && (
          <div className="glass-card analysis-card">
            <h3>💪 Strengths</h3>
            <ul className="analysis-list">
              {analysis.strengths.map((s, i) => (
                <li key={i}><span style={{ color: 'var(--green)', fontWeight: 'bold' }}>✓</span> {s}</li>
              ))}
            </ul>
          </div>
        )}

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

      {analysis.suggestions?.length > 0 && (
        <div className="glass-card analysis-card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>💡 Actionable Enhancements</h3>
          <div className="suggestions-list">
            {analysis.suggestions.map((s, i) => (
              <div key={i} className="suggestion-card">
                <div className="suggestion-number">{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div className="suggestion-meta">
                    <span className={`priority-badge priority-${s.priority}`}>{s.priority}</span>
                    <span className="skill-tag" style={{ fontSize: '0.7rem' }}>{s.category}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'white', lineHeight: '1.5' }}>{s.suggestion}</div>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={() => copySuggestion(s.suggestion, i)}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', whiteSpace: 'nowrap' }}>
                  {copiedIndex === i ? 'Copied ✓' : '📋 Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
