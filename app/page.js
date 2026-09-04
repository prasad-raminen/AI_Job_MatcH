import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-particles">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
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
            🚀 Get Started Free
          </Link>
          <a href="#features" className="btn btn-secondary btn-lg">
            Learn More ↓
          </a>
        </div>

        {/* Stats Strip */}
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Jobs Analyzed</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">95%</span>
            <span className="stat-label">Match Accuracy</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">AI</span>
            <span className="stat-label">Gemini Powered</span>
          </div>
        </div>
      </section>

      {/* How It Works — Step Flow */}
      <section className="features-section" id="features">
        <h2>How It <span className="gradient-text">Works</span></h2>
        <div className="steps-flow">
          <div className="step-card glass-card">
            <div className="step-number">1</div>
            <div className="feature-icon">📄</div>
            <h3>Upload Resume</h3>
            <p>Upload your PDF resume or paste text. AI extracts skills, experience, and education into structured data.</p>
          </div>
          <div className="step-connector">→</div>
          <div className="step-card glass-card">
            <div className="step-number">2</div>
            <div className="feature-icon">🔍</div>
            <h3>Search Jobs</h3>
            <p>Search thousands of real jobs from Adzuna, or paste any job description to match against.</p>
          </div>
          <div className="step-connector">→</div>
          <div className="step-card glass-card">
            <div className="step-number">3</div>
            <div className="feature-icon">🎯</div>
            <h3>Get AI Matches</h3>
            <p>Get detailed match scores, skill gap analysis, cover letters, and interview prep — all AI-generated.</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section" style={{ paddingTop: 0 }}>
        <h2>Powerful <span className="gradient-text">Features</span></h2>
        <div className="features-grid">
          <div className="glass-card feature-card">
            <div className="feature-icon-v2" style={{ background: 'rgba(99,102,241,0.15)' }}>🧠</div>
            <h3>Smart Resume Parsing</h3>
            <p>Google Gemini AI extracts and structures your resume data intelligently.</p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon-v2" style={{ background: 'rgba(6,182,212,0.15)' }}>📊</div>
            <h3>Skill Gap Analysis</h3>
            <p>Know exactly which skills to learn to become the ideal candidate.</p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon-v2" style={{ background: 'rgba(16,185,129,0.15)' }}>✉️</div>
            <h3>AI Cover Letters</h3>
            <p>Generate tailored cover letters and elevator pitches for each job.</p>
          </div>
          <div className="glass-card feature-card">
            <div className="feature-icon-v2" style={{ background: 'rgba(245,158,11,0.15)' }}>🎯</div>
            <h3>Interview Prep Q&A</h3>
            <p>AI-predicted interview questions with recommended talking points.</p>
          </div>
        </div>
      </section>

      {/* Tech Section */}
      <section className="features-section" style={{ paddingTop: 0 }}>
        <h2>Built With <span className="gradient-text">Modern Tech</span></h2>
        <div className="tech-badges">
          {['Next.js 14', 'Google Gemini AI', 'React 18', 'Adzuna API', 'PDF Parse', 'Vercel'].map((tech) => (
            <span key={tech} className="tech-badge">{tech}</span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">⚡ SkillMatch <span style={{ color: 'var(--accent-primary)' }}>AI</span></span>
            <p>AI-powered job matching for the modern job seeker.</p>
          </div>
          <div className="footer-links">
            <Link href="/dashboard">Dashboard</Link>
            <a href="https://github.com/prasad-raminen/AI_Job_MatcH" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://developer.adzuna.com/" target="_blank" rel="noopener noreferrer">Adzuna API</a>
          </div>
        </div>
        <div className="footer-bottom">
          Built by <a href="https://github.com/prasad-raminen" target="_blank" rel="noopener noreferrer">Prasad Raminen</a> • 
          Powered by Google Gemini AI
        </div>
      </footer>
    </>
  );
}
