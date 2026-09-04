'use client';

export default function ResumePreview({ resume }) {
  if (!resume) return null;

  const initials = (resume.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="resume-preview">
      <div className="glass-card resume-header-card">
        <div className="resume-avatar-ring">
          <div className="resume-avatar">{initials}</div>
        </div>
        <div>
          <div className="resume-name">{resume.name || 'Unknown'}</div>
          <div className="resume-contact">
            {[resume.email, resume.phone, resume.location].filter(Boolean).join(' • ')}
          </div>
          {resume.summary && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
              {resume.summary}
            </p>
          )}
        </div>
      </div>

      {resume.skills?.length > 0 && (
        <div className="glass-card resume-section">
          <h3>🛠️ Skills</h3>
          <div className="skills-grid">
            {resume.skills.map((skill, i) => (
              <span key={i} className="skill-tag" style={{ animationDelay: `${i * 0.03}s` }}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      {resume.experience?.length > 0 && (
        <div className="glass-card resume-section">
          <h3>💼 Experience</h3>
          <div className="timeline">
            {resume.experience.map((exp, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="exp-title">{exp.title}</div>
                  <div className="exp-company">{exp.company}</div>
                  <div className="exp-duration">{exp.duration}</div>
                  {exp.highlights?.length > 0 && (
                    <ul className="exp-highlights">
                      {exp.highlights.map((h, j) => (
                        <li key={j}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {resume.education?.length > 0 && (
        <div className="glass-card resume-section">
          <h3>🎓 Education</h3>
          {resume.education.map((edu, i) => (
            <div key={i} className="experience-item">
              <div className="exp-title">{edu.degree}</div>
              <div className="exp-company">{edu.institution}</div>
              <div className="exp-duration">
                {edu.year}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {resume.certifications?.length > 0 && (
        <div className="glass-card resume-section">
          <h3>📜 Certifications</h3>
          <div className="skills-grid">
            {resume.certifications.map((cert, i) => (
              <span key={i} className="skill-tag">{cert}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
