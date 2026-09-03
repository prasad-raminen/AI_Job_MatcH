'use client';
import { useState } from 'react';

function ScoreBadge({ score }) {
  const cls = score >= 75 ? 'score-high' : score >= 50 ? 'score-mid' : 'score-low';
  return <div className={`score-badge ${cls}`}>{score}</div>;
}

export default function MatchResults({ matches, resume }) {
  const [activeCoverLetter, setActiveCoverLetter] = useState(null);
  const [coverLetterData, setCoverLetterData] = useState({});
  const [loadingCover, setLoadingCover] = useState({});

  const [activeInterviewPrep, setActiveInterviewPrep] = useState(null);
  const [interviewPrepData, setInterviewPrepData] = useState({});
  const [loadingPrep, setLoadingPrep] = useState({});

  const [copiedKey, setCopiedKey] = useState(null);

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
    if (activeCoverLetter === index) {
      setActiveCoverLetter(null);
      return;
    }
    setActiveCoverLetter(index);
    if (coverLetterData[index]) return; // already generated

    setLoadingCover((prev) => ({ ...prev, [index]: true }));
    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resume || { name: 'Candidate', skills: [] }, job }),
      });
      const data = await res.json();
      if (data.success) {
        setCoverLetterData((prev) => ({ ...prev, [index]: data.data }));
      } else {
        alert('Failed to generate cover letter: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setLoadingCover((prev) => ({ ...prev, [index]: false }));
  };

  const handleGenerateInterviewPrep = async (job, index) => {
    if (activeInterviewPrep === index) {
      setActiveInterviewPrep(null);
      return;
    }
    setActiveInterviewPrep(index);
    if (interviewPrepData[index]) return; // already generated

    setLoadingPrep((prev) => ({ ...prev, [index]: true }));
    try {
      const res = await fetch('/api/generate-interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resume || { name: 'Candidate', skills: [] }, job }),
      });
      const data = await res.json();
      if (data.success) {
        setInterviewPrepData((prev) => ({ ...prev, [index]: data.data }));
      } else {
        alert('Failed to generate interview prep: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setLoadingPrep((prev) => ({ ...prev, [index]: false }));
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportPrint = () => {
    window.print();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Top matched jobs analyzed with Google Gemini 1.5 Flash
        </span>
        <button className="btn btn-secondary btn-sm" onClick={handleExportPrint}>
          🖨️ Export / Print Report
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
            <ScoreBadge score={match.overallScore || 0} />
          </div>

          {match.summary && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px' }}>
              💬 <strong>AI Analysis:</strong> {match.summary}
            </p>
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
                💡 Key Recommendations to Maximize Selection Chance
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

          {/* Action Toolbar for impressive features */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${activeCoverLetter === i ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleGenerateCoverLetter(match.job, i)}
            >
              ✉️ {activeCoverLetter === i ? 'Hide Cover Letter' : 'Generate Cover Letter & Pitch'}
            </button>

            <button
              className={`btn btn-sm ${activeInterviewPrep === i ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleGenerateInterviewPrep(match.job, i)}
            >
              🎯 {activeInterviewPrep === i ? 'Hide Interview Prep' : 'Generate Interview Prep Q&A'}
            </button>
          </div>

          {/* COVER LETTER SECTION */}
          {activeCoverLetter === i && (
            <div className="glass-card" style={{ marginTop: '1rem', background: 'rgba(17,17,39,0.9)', borderColor: 'var(--accent-primary)' }}>
              {loadingCover[i] ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  ⚡ AI is crafting your tailored cover letter and elevator pitch...
                </div>
              ) : coverLetterData[i] ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1rem', color: '#a5b4fc' }}>✉️ Personalized Cover Letter</h3>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => copyToClipboard(coverLetterData[i].coverLetter, `cl-${i}`)}
                    >
                      {copiedKey === `cl-${i}` ? 'Copied! ✓' : '📋 Copy Letter'}
                    </button>
                  </div>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    marginBottom: '1rem'
                  }}>
                    {coverLetterData[i].coverLetter}
                  </pre>

                  {/* Elevator Pitch */}
                  <div style={{ background: 'rgba(99,102,241,0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.85rem', color: 'white' }}>🎙️ 30-Second Elevator Pitch:</span>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                        onClick={() => copyToClipboard(coverLetterData[i].elevatorPitch, `ep-${i}`)}
                      >
                        {copiedKey === `ep-${i}` ? 'Copied! ✓' : '📋 Copy Pitch'}
                      </button>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#c7d2fe', italic: 'true' }}>
                      &quot;{coverLetterData[i].elevatorPitch}&quot;
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* INTERVIEW PREP SECTION */}
          {activeInterviewPrep === i && (
            <div className="glass-card" style={{ marginTop: '1rem', background: 'rgba(17,17,39,0.9)', borderColor: 'var(--teal)' }}>
              {loadingPrep[i] ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  🎯 AI is predicting targeted interview questions and recommended answers...
                </div>
              ) : interviewPrepData[i] ? (
                <div>
                  <h3 style={{ fontSize: '1rem', color: '#67e8f9', marginBottom: '1rem' }}>
                    🎯 Predicted Interview Q&A for {match.job.title}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {interviewPrepData[i].questions?.map((q, qidx) => (
                      <div key={qidx} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--teal)' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span className="skill-tag" style={{ background: 'rgba(6,182,212,0.15)', color: '#67e8f9', borderColor: 'rgba(6,182,212,0.3)', fontSize: '0.7rem' }}>
                            {q.type} Question
                          </span>
                        </div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'white', marginBottom: '0.5rem' }}>
                          Q: {q.question}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                          <strong>Recommended Talking Points:</strong>
                          <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem' }}>
                            {q.keyTalkingPoints?.map((tp, tpidx) => (
                              <li key={tpidx}>{tp}</li>
                            ))}
                          </ul>
                        </div>
                        {q.advice && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--amber)', fontStyle: 'italic' }}>
                            💡 Pro Tip: {q.advice}
                          </div>
                        )}
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
