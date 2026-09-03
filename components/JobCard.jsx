'use client';

export default function JobCard({ job, selected, onToggle }) {
  return (
    <div
      className={`glass-card job-card ${selected ? 'selected' : ''}`}
      onClick={() => onToggle(job.id)}
    >
      <div style={{ flex: 1 }}>
        <div className="job-title">{job.title}</div>
        <div className="job-company">{job.company}</div>
        {job.location && <div className="job-location">📍 {job.location}</div>}
        {job.salary && <div className="job-salary">💰 {job.salary}</div>}
        {job.description && (
          <div className="job-description">
            {job.description.length > 200
              ? job.description.slice(0, 200) + '...'
              : job.description}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <div
          style={{
            width: '24px', height: '24px',
            borderRadius: '6px',
            border: `2px solid ${selected ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
            background: selected ? 'var(--accent-primary)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', color: 'white',
            transition: 'all var(--transition)',
          }}
        >
          {selected && '✓'}
        </div>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            onClick={(e) => e.stopPropagation()}
            style={{ fontSize: '0.7rem', padding: '0.3rem 0.5rem' }}
          >
            View ↗
          </a>
        )}
      </div>
    </div>
  );
}
