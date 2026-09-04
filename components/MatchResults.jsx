'use client';
import { useState } from 'react';
import { useToast } from './Toast';

function ScoreRing({ score, size = 64 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)';

  return (
    <div className="score-ring-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <span className="score-ring-value" style={{ color }}>{score}</span>
    </div>
  );
}

export default function MatchResults({ matches, resume }) {
  const [activeCoverLetter, setActiveCoverLetter] = useState(null);
  const [coverLetterData, setCoverLetterData] = useState({});
  const [loadingCover, setLoadingCover] = useState({});
  const [activeInterviewPrep, setActiveInterviewPrep] = useState(null);
  const [interviewPrepData, setInterviewPrepData] = useState({});
  const [loadingPrep, setLoadingPrep] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);
  const toast = useToast();

  if (!matches || matches.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🎯</div>
        <h3>No Matches Yet</h3>
        <p>Select jobs from the Find Jobs tab and click &quot;Match Selected Jobs&quot;</p>
      </div>
    );
  }

  const handleGenerateCoverLetter = async (job, index) => {
    if (activeCoverLetter === index) { setActiveCoverLetter(null); return; }
    setActiveCoverLetter(index);
    if (coverLetterData[index]) return;

    setLoadingCover((prev) => ({ ...prev, [index]: true }));
    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resume || { name: 'Candidate', skills: [] }, job }),
      });
      const data = await res.json();
      if (data.success) {
        setCoverLetterData((prev) => ({ ...prev, [index]: data.data }));
        toast('Cover letter generated!', 'success');
      } else {
        toast('Failed to generate cover letter: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (err) { toast('Error: ' + err.message, 'error'); }
    setLoadingCover((prev) => ({ ...prev, [index]: false }));
  };

  const handleGenerateInterviewPrep = async (job, index) => {
    if (activeInterviewPrep === index) { setActiveInterviewPrep(null); return; }
    setActiveInterviewPrep(index);
    if (interviewPrepData[index]) return;

    setLoadingPrep((prev) => ({ ...prev, [index]: true }));
    try {
      const res = await fetch('/api/generate-interview-prep', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resume || { name: 'Candidate', skills: [] }, job }),
      });
      const data = await res.json();
      if (data.success) {
        setInterviewPrepData((prev) => ({ ...prev, [index]: data.data }));
        toast('Interview prep ready!', 'success');
      } else {
        toast('Failed to generate interview prep: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (err) { toast('Error: ' + err.message, 'error'); }
    setLoadingPrep((prev) => ({ ...prev, [index]: false }));
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast('Copied to clipboard!', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Top matched jobs analyzed with Google Gemini AI
        </span>
        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
          🖨️ Export / Print
        </button>
      </div>

      {matches.map((match, i) => (
        <div key={i} className="glass-card match-card" style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both` }}>
          <div className="match-header">
            <div>
              <div className="job-title">{match.job?.title}</div>
              <div className="job-company">{match.job?.company}</div>
              {match.job?.location && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📍 {match.job.location}</div>}
            </div>
            <ScoreRing score={match.overallScore || 0} />
          </div>

          {match.summary && (
            <div className="ai-analysis-box">
              💬 <strong>AI Analysis:</strong> {match.summary}
            </div>
          )}

          {match.categoryScores && (
            <div className="match-scores">
              {Object.entries(match.categoryScores).map(([key, val]) => (
                <div key={key} className="match-score-item">
                  <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{val}%</div>
                  <div className="progress-bar" style={{ marginTop: '0.5rem' }}>
                    <div className="progress-fill" style={{ width: `${val}%` }} />
                  </div>
                  <div className="label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {match.matchingSkills?.length > 0 && (
              <div className="match-skills">
                <h4>✅ Matching Skills ({match.matchingSkills.length})</h4>
                <div className="skills-grid">
                  {match.matchingSkills.map((s, j) => (
                    <span key={j} className="skill-tag match">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {match.missingSkills?.length > 0 && (
              <div className="match-skills">
                <h4>❌ Missing Skills ({match.missingSkills.length})</h4>
                <div className="skills-grid">
                  {match.missingSkills.map((s, j) => (
                    <span key={j} className="skill-tag missing">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {match.improvements?.length > 0 && (
            <div className="match-suggestions" style={{ marginTop: '1rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                💡 Key Recommendations
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {match.improvements.map((s, j) => (
                  <li key={j} style={{ padding: '0.4rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    → {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="match-actions">
            <button
              className={`btn btn-sm ${activeCoverLetter === i ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleGenerateCoverLetter(match.job, i)}
            >
              ✉️ {activeCoverLetter === i ? 'Hide Cover Letter' : 'Cover Letter & Pitch'}
            </button>
            <button
              className={`btn btn-sm ${activeInterviewPrep === i ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleGenerateInterviewPrep(match.job, i)}
            >
              🎯 {activeInterviewPrep === i ? 'Hide Interview Prep' : 'Interview Prep Q&A'}
            </button>
          </div>

          {/* Cover Letter */}
          {activeCoverLetter === i && (
            <div className="expandable-section" style={{ borderColor: 'var(--accent-primary)' }}>
              {loadingCover[i] ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  ⚡ Crafting your tailored cover letter...
                </div>
              ) : coverLetterData[i] ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1rem', color: '#a5b4fc' }}>✉️ Personalized Cover Letter</h3>
                    <button className="btn btn-secondary btn-sm" onClick={() => copyToClipboard(coverLetterData[i].coverLetter, `cl-${i}`)}>
                      {copiedKey === `cl-${i}` ? 'Copied! ✓' : '📋 Copy'}
                    </button>
                  </div>
                  <pre className="letter-pre">{coverLetterData[i].coverLetter}</pre>
                  {coverLetterData[i].elevatorPitch && (
                    <div className="pitch-box">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>🎙️ 30-Second Elevator Pitch:</span>
                        <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                          onClick={() => copyToClipboard(coverLetterData[i].elevatorPitch, `ep-${i}`)}>
                          {copiedKey === `ep-${i}` ? 'Copied! ✓' : '📋 Copy'}
                        </button>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#c7d2fe', fontStyle: 'italic' }}>
                        &quot;{coverLetterData[i].elevatorPitch}&quot;
                      </p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {/* Interview Prep */}
          {activeInterviewPrep === i && (
            <div className="expandable-section" style={{ borderColor: 'var(--teal)' }}>
              {loadingPrep[i] ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  🎯 Predicting interview questions...
                </div>
              ) : interviewPrepData[i] ? (
                <div>
                  <h3 style={{ fontSize: '1rem', color: '#67e8f9', marginBottom: '1rem' }}>
                    🎯 Interview Q&A for {match.job.title}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {interviewPrepData[i].questions?.map((q, qidx) => (
                      <div key={qidx} className="interview-q-card">
                        <span className="q-type-badge">{q.type}</span>
                        <div className="q-text">Q: {q.question}</div>
                        <div className="q-answer">
                          <strong>Key Talking Points:</strong>
                          <ul>{q.keyTalkingPoints?.map((tp, tpidx) => <li key={tpidx}>{tp}</li>)}</ul>
                        </div>
                        {q.advice && <div className="q-tip">💡 {q.advice}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
