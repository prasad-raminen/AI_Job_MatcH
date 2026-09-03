# SkillMatch AI — Comprehensive Technical Documentation & Internship Submission Guide

Welcome to the complete technical and architectural guide for **SkillMatch AI**. This document provides an in-depth breakdown of how the project is built, the algorithms and AI prompts used, step-by-step instructions on how everything functions, and how to pitch this application to HR and technical interviewers for internship selection.

---

## 📌 Executive Summary

**SkillMatch AI** is a full-stack, AI-powered career assistant built with **Next.js 14 (App Router)** and **Google Gemini 1.5 Flash**. It solves the problem of resume black holes by allowing job seekers to:
1. **Parse & Structure Resumes**: Automatically extract skills, experience, education, and summaries from PDFs or raw text.
2. **Search Real-Time Jobs**: Search live job listings via the Adzuna API or paste custom job descriptions.
3. **AI Match Scoring & Skill Gap Analysis**: Calculate a 0-100 match score, category breakdowns (Skills, Experience, Education), matching vs. missing skills, and priority improvements.
4. **AI Cover Letter & Elevator Pitch Generator**: Generate tailored 3-paragraph cover letters and 30-second speaking pitches for any matched job with 1-click clipboard copying.
5. **AI Mock Interview Questions Generator**: Predict technical, behavioral, and system design interview questions tailored to the candidate's skill gaps and target job.
6. **Exportable PDF Audit Reports**: Print clean candidate match reports for offline review.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Unified React SSR/CSR frontend and serverless API handlers in one project. |
| **Language** | JavaScript (ES6+ / Node 18+) | Clean, standard frontend & serverless handler execution. |
| **AI Model** | Google Gemini 1.5 Flash | High speed, cost-effective, free tier availability, and structured JSON output capability. |
| **PDF Extraction** | `pdf-parse` (Server-side) | Parses PDF buffers safely without browser bundle bloat. |
| **Job Data API** | Adzuna API + Sample Fallbacks | Live market job search with sample data backup when API keys are unconfigured. |
| **Styling** | Custom Vanilla CSS (Glassmorphism) | Sleek dark theme with gradients, micro-animations, glass cards, and print styles. |
| **Persistence** | Browser `localStorage` | Preserves parsed resume, matches, and analysis between sessions without DB overhead. |

---

## 📂 Codebase Structure

```
Skillians/
├── app/
│   ├── layout.js                     # Root HTML layout with SEO metadata & navbar
│   ├── page.js                       # Hero landing page & feature overview
│   ├── globals.css                   # Glassmorphism design system & print styles
│   ├── dashboard/
│   │   └── page.js                   # Tabbed dashboard state manager
│   └── api/
│       ├── parse-resume/route.js     # PDF/text resume parsing endpoint
│       ├── search-jobs/route.js      # Job search query endpoint (Adzuna API)
│       ├── match-jobs/route.js       # Gemini-powered resume-job matcher
│       ├── analyze-resume/route.js   # Overall resume quality auditor
│       ├── generate-cover-letter/route.js # Tailored cover letter & pitch generator
│       └── generate-interview-prep/route.js # Custom interview Q&A generator
├── components/
│   ├── Navbar.jsx                    # Header navigation bar
│   ├── ResumeUpload.jsx              # PDF upload, paste text & Instant Demo preloads
│   ├── ResumePreview.jsx             # Parsed resume visual preview
│   ├── JobSearch.jsx                 # Search bar + custom job description modal
│   ├── JobCard.jsx                   # Individual job listing card
│   ├── MatchResults.jsx              # Match scores, cover letters & interview prep
│   ├── SkillAnalysis.jsx             # Resume quality score & actionable suggestions
│   └── LoadingSpinner.jsx            # Dynamic loading indicators
├── lib/
│   ├── gemini.js                     # Gemini SDK client & fallback JSON caller
│   ├── resumeParser.js               # Resume extraction prompts & regex fallbacks
│   ├── jobMatcher.js                 # Matcher, analysis, cover letter & interview prep prompts
│   ├── jobScraper.js                 # Adzuna API fetcher & fallback job dataset
│   └── sampleData.js                 # Demo resumes (Alex & Sara) & default jobs
├── DOCUMENTATION.md                  # Detailed technical documentation (This file)
├── package.json                      # Project dependencies & npm scripts
└── README.md                         # Submission overview & setup guide
```

---

## ⚡ How Each Feature & Component Works (Technical Deep-Dive)

### 1. Instant Demo Mode & Resume Parsing (`ResumeUpload.jsx` & `lib/resumeParser.js`)
* **How it works**:
  * Users can upload a PDF file, paste raw resume text, or click **"⚡ Alex (Full-Stack Eng)"** / **"⚡ Sara (Frontend Dev)"**.
  * PDFs are sent via `multipart/form-data` to `/api/parse-resume`, where `pdf-parse` extracts raw text.
  * Raw text is sent to Google Gemini 1.5 Flash with a strictly formatted JSON prompt requesting: name, email, phone, summary, skills array, experience array, education, and certifications.
  * **Fallback Mechanism**: If the Gemini API key is missing or quota is exceeded, a regex/heuristic parser extracts email, phone, lines, and matches against a pre-compiled array of 25+ common technical skills.

### 2. Live Job Search & Custom Input (`JobSearch.jsx` & `lib/jobScraper.js`)
* **How it works**:
  * Queries are dispatched to `/api/search-jobs?q=query&location=loc`.
  * The handler checks if `ADZUNA_APP_ID` and `ADZUNA_API_KEY` are present in `.env.local`. If present, it queries Adzuna's REST API.
  * If keys are omitted or Adzuna fails, it filters pre-loaded high-tech sample jobs (Google, Stripe, OpenAI, Netflix, Airbnb) by keyword.
  * Candidates can also click **"📋 Paste Job Description"** to input any arbitrary job posting.

### 3. AI Match Scoring Engine (`MatchResults.jsx` & `lib/jobMatcher.js`)
* **How it works**:
  * Candidates select 1 or more jobs and click **"🎯 Match Selected Jobs"**.
  * The frontend calls `/api/match-jobs`, passing candidate resume data and job array.
  * Gemini evaluates:
    * `overallScore` (0-100)
    * Category breakdown (`skills`, `experience`, `education`)
    * `matchingSkills` vs. `missingSkills`
    * Actionable recommendations to improve fit.
  * Matches are automatically sorted in descending order of fit score.

### 4. AI Cover Letter & Elevator Pitch Generator (`/api/generate-cover-letter`)
* **How it works**:
  * On any matched job card, clicking **"✉️ Generate Cover Letter & Pitch"** calls `/api/generate-cover-letter`.
  * Gemini receives candidate resume + target job title/company/description.
  * Generates a 3-paragraph tailored cover letter, a 30-second speaking pitch, and key alignment points.
  * Users can copy either text with 1-click clipboard feedback ("Copied! ✓").

### 5. AI Tailored Interview Prep Generator (`/api/generate-interview-prep`)
* **How it works**:
  * Clicking **"🎯 Generate Interview Prep Q&A"** calls `/api/generate-interview-prep`.
  * Gemini generates 3 predicted interview questions (Technical, Behavioral, System Design) specifically targeting candidate skill gaps and job specifics.
  * Includes key talking points to mention during the interview and interviewer pro tips.

### 6. Overall Resume Quality Audit (`SkillAnalysis.jsx` & `analyzeResume()`)
* **How it works**:
  * Clicking **"📊 Analyze Resume"** calculates an overall quality score out of 100, identified strengths, areas to improve, marketable skills, best industry fit, and assessed seniority level.
  * Action items include copy buttons and priority badges (`high`, `medium`, `low`).

### 7. Print & PDF Exporting (`@media print` in `globals.css`)
* **How it works**:
  * Clicking **"🖨️ Export Report"** invokes `window.print()`.
  * `@media print` CSS strips navigation, background glows, and tab bars, re-styling cards in high-contrast black-and-white for clean PDF saving.

---

## 🤖 Prompt Engineering & JSON Schema Design Strategy

To prevent LLM hallucination and ensure reliable UI rendering, all Gemini interactions use **Single-Shot Structured JSON Prompting**:

```javascript
// Example Prompt Pattern
const prompt = `You are an expert HR recruiter...
Return ONLY a valid JSON object (no markdown, no explanation):
{
  "overallScore": <number 0-100>,
  "categoryScores": { ... },
  "matchingSkills": [...],
  "missingSkills": [...]
}

CANDIDATE RESUME: ${JSON.stringify(resumeData)}
JOB DESCRIPTION: ${jobDescription}`;
```

* **Cleaning Strategy**: `lib/gemini.js` strips potential markdown fences (````json`) before parsing:
  ```javascript
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
  ```

---

## 🌟 Why This Project Will Impress HR & Hiring Managers

1. **Zero Friction HR Review (1-Click Demo Mode)**: HR evaluators can test the entire app instantly using preloaded candidate profiles without having to prepare a PDF.
2. **Beyond Basic Scrapers**: Combines resume parsing, job scraping, ATS match scoring, AI cover letter creation, AND tailored mock interview prep.
3. **Enterprise Resilience**: Works seamlessly with live Gemini API keys, but degrades gracefully to intelligent fallback algorithms if API limits are hit.
4. **Modern UI/UX**: Custom dark-mode glassmorphism design with responsive micro-animations and exportable PDF audit views.
5. **Full-Stack Competency**: Demonstrates Next.js App Router API design, prompt engineering, server-side PDF parsing, and modular React state management.

---

## 🗣️ 2-Minute HR Demo Script (For Interview Presentation)

When presenting this project to an interviewer or HR evaluator:

1. **The Hook (30 sec)**:
   > "Job seekers spend hours manually customizing resumes and cover letters for every application without knowing if they pass ATS screening. I built **SkillMatch AI** to automate resume parsing, live job matching, cover letter generation, and interview preparation using Next.js 14 and Google Gemini AI."

2. **The Walkthrough (60 sec)**:
   > "Let me demonstrate using our **Instant Demo Mode**. With one click, we load Alex's Full-Stack resume. Next, we search live jobs or select our sample tech jobs at Google, Stripe, and OpenAI.
   > 
   > When I click 'Match Selected Jobs', Gemini calculates a precise match score, identifies matching vs missing skills, and gives priority recommendations.
   > 
   > Furthermore, with one click, it generates a custom 3-paragraph Cover Letter, a 30-second Elevator Pitch, and even predicts Technical & Behavioral Interview Questions based on skill gaps."

3. **Technical Highlights (30 sec)**:
   > "Architecturally, it features a Next.js App Router full-stack setup, server-side PDF text extraction, structured JSON prompt engineering, local persistence, print PDF export, and fallback heuristic engines so the app never crashes under rate limits."

---

## 🚀 Local Setup & Deployment Instructions

### Prerequisites
* Node.js 18+ and npm installed
* (Optional) Google Gemini API Key from [AI Studio](https://aistudio.google.com/apikey)

### Steps
```bash
# 1. Clone repository
git clone https://github.com/prasad-raminen/Skillians.git
cd Skillians

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local

# Add your key to .env.local (Optional - fallbacks active if omitted):
# GEMINI_API_KEY=your_gemini_api_key

# 4. Start Development Server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📄 License
MIT License — Free to use and expand. Built by **Prasad Raminen** (IIIT Hyderabad).
