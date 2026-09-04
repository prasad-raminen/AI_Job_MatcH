'use client';
import { useState } from 'react';

export default function JobCard({ job, selected, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const companyInitial = (job.company || '?')[0].toUpperCase();

  return (
    <div
      className={`glass-card job-card ${selected ? 'selected' : ''}`}
      onClick={() => onToggle(job.id)}
    >
      <div className="job-card-left">
        <div className="company-avatar">{companyInitial}</div>
        <div className="job-card-info">
          <div className="job-title">{job.title}</div>
          <div className="job-company">{job.company}</div>
          <div className="job-meta-row">
            {job.location && <span className="job-location">📍 {job.location}</span>}
            {job.salary && <span className="job-salary-pill">💰 {job.salary}</span>}
          </div>
          {job.description && (
            <div className="job-description">
              {expanded || job.description.length <= 150
                ? job.description
                : job.description.slice(0, 150) + '...'}
              {job.description.length > 150 && (
                <button
                  className="show-more-btn"
                  onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                >
                  {expanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="job-card-actions">
        <div className={`animated-checkbox ${selected ? 'checked' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            onClick={(e) => e.stopPropagation()}
            style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}
          >
            Apply ↗
          </a>
        )}
      </div>
    </div>
  );
}
