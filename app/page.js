import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">⚡ AI-Powered Resume Matching</div>
        <h1>
          Find Your Perfect<br />
          <span className="gradient-text">Job Match</span>
        </h1>
        <p className="hero-subtitle">
          Upload your resume, let AI analyze your skills, and get matched with the best
          jobs — complete with match scores, skill gap analysis, and actionable suggestions.
        </p>
        <div className="hero-actions">
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            🚀 Get Started
          </Link>
          <a href="#features" className="btn btn-secondary btn-lg">
            Learn More ↓
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <h2>How It <span className="gradient-text">Works</span></h2>
        <div className="features-grid">
          <div className="glass-card feature-card">
            <div className="feature-icon">📄</div>
            <h3>Smart Resume Parsing</h3>
            <p>
              Upload your PDF resume or paste text. Our AI extracts skills,
              experience, education, and more into structured data.
            </p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Real-Time Job Search</h3>
            <p>
              Search thousands of jobs from real job boards, or paste any
              job description you want to match against.
            </p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon">🎯</div>
            <h3>AI Match Scoring</h3>
            <p>
              Get detailed match analysis for each job — overall score,
              category breakdowns, and matching vs missing skills.
            </p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon">📊</div>
            <h3>Skill Gap Analysis</h3>
            <p>
              Understand your resume&apos;s strengths and weaknesses with
              actionable improvement suggestions from AI.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Section */}
      <section className="features-section" style={{ paddingTop: 0 }}>
        <h2>Built With <span className="gradient-text">Modern Tech</span></h2>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
          {['Next.js 14', 'Google Gemini AI', 'React 18', 'Adzuna API', 'PDF Parse', 'Vercel'].map((tech) => (
            <span key={tech} className="skill-tag">{tech}</span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          Built by <a href="https://github.com/prasad-raminen" target="_blank" rel="noopener noreferrer">Prasad Raminen</a> •{' '}
          <a href="https://github.com/prasad-raminen/Skillians" target="_blank" rel="noopener noreferrer">View Source</a>
        </p>
      </footer>
    </>
  );
}
