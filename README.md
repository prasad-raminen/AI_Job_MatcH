# SkillMatch AI — AI Job Scraper & Resume Matcher

An AI-powered web application built for job seekers and recruiters to analyze resumes, search jobs, match skills against job descriptions, generate tailored cover letters, and prepare for interviews using AI.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-blue?style=flat-square&logo=google)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)

---

## 🚀 Live Demo & Documentation

* 🌐 **[View Live Web App](https://aijobmatch-six.vercel.app)**
* 📖 **[Read Full Technical Documentation & Architecture Guide (DOCUMENTATION.md)](DOCUMENTATION.md)**


---

## ✨ Core & Advanced Features

### 📄 Smart Resume Parsing
* Upload PDF, TXT, or DOC resumes, or paste text directly.
* AI extracts candidate contact info, summary, skills array, work history, and education into structured JSON.
* **Instant Demo Mode**: 1-click sample resume preloads (Alex - Full Stack Eng, Sara - Frontend Dev) for immediate HR evaluation.

### 🔍 Real-Time Job Search
* Query real-time job listings via Adzuna Job Board API.
* Paste any custom job description directly for instant matching.
* High-tech sample job fallback (Google, Stripe, OpenAI, Netflix, Airbnb).

### 🎯 AI Match Scoring & Skill Gap Analysis
* Detailed overall match score (0-100) with category breakdowns (Skills, Experience, Education).
* Instant side-by-side comparison of **Matching Skills** vs. **Missing Skills**.
* Actionable improvement suggestions to maximize ATS selection chances.

### ✉️ AI Cover Letter & Elevator Pitch Generator *(NEW)*
* 1-click tailored 3-paragraph cover letter generation for any matched job.
* 30-second speaking elevator pitch for networking and recruiter calls.
* Instant copy-to-clipboard buttons with visual confirmation feedback.

### 🎯 AI Tailored Interview Prep Generator *(NEW)*
* Generates predicted Technical, Behavioral, and System Design interview questions tailored to the candidate's skill gaps and the target job.
* Includes key talking points and interviewer pro tips for candidate preparation.

### 📊 Resume Quality Audit & Exportable PDF Reports *(NEW)*
* Comprehensive resume quality score, seniority level assessment, strengths, and top marketable skills.
* **🖨️ PDF Audit Export**: Print-ready CSS formatting (`@media print`) for clean report export.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** (App Router) | Full-stack React framework with serverless API handlers |
| **Google Gemini 1.5 Flash** | AI engine for parsing, match scoring, cover letters, and interview prep |
| **Adzuna API** | Live job search listings |
| **pdf-parse** | Server-side PDF text extraction |
| **Vanilla CSS** | Custom glassmorphism design system & print styles |
| **Vercel** | One-click production deployment |

---

## 🏁 Getting Started

### Prerequisites
* Node.js 18+ and npm
* (Optional) Google Gemini API key from [AI Studio](https://aistudio.google.com/apikey)

### Installation & Execution

```bash
# Clone the repository
git clone https://github.com/prasad-raminen/Skillians.git
cd Skillians

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧠 Architecture & File Structure

```
Skillians/
├── app/
│   ├── page.js                    # Landing page
│   ├── dashboard/page.js          # Tabbed main dashboard
│   ├── globals.css                # Glassmorphism design system & print CSS
│   └── api/
│       ├── parse-resume/route.js  # Resume parser handler
│       ├── search-jobs/route.js   # Job search handler
│       ├── match-jobs/route.js    # Resume-Job matcher handler
│       ├── analyze-resume/route.js # Quality audit handler
│       ├── generate-cover-letter/route.js # Cover letter generator
│       └── generate-interview-prep/route.js # Interview Q&A generator
├── components/
│   ├── ResumeUpload.jsx           # Upload & Instant Demo mode
│   ├── MatchResults.jsx           # Scores, cover letters & interview prep
│   ├── SkillAnalysis.jsx          # Resume quality audit
│   └── ...                        # Additional visual components
└── lib/
    ├── gemini.js                  # Gemini API SDK & fallbacks
    ├── jobMatcher.js              # Prompt engineering functions
    └── sampleData.js              # Demo datasets
```

---

## 👤 Author

**Prasad Raminen**
* IIIT Hyderabad
* GitHub: [@prasad-raminen](https://github.com/prasad-raminen)
