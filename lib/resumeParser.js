import { generateJSON } from './gemini';

export async function parseResume(text) {
  const prompt = `You are an expert resume parser. Analyze the following resume text and extract structured information.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "name": "Full name of the candidate",
  "email": "Email address or empty string",
  "phone": "Phone number or empty string",
  "location": "Location or empty string",
  "summary": "A concise 2-3 sentence professional summary based on the resume",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start Date - End Date",
      "highlights": ["Key achievement 1", "Key achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "School/University Name",
      "year": "Graduation Year or expected",
      "gpa": "GPA if mentioned, otherwise empty string"
    }
  ],
  "certifications": ["certification1"],
  "languages": ["language1"]
}

Important:
- Extract ALL skills mentioned, including programming languages, frameworks, tools, and soft skills
- If a field is not found in the resume, use an empty string or empty array
- Keep highlights concise and action-oriented
- For summary, synthesize from the overall resume content

Resume text:
${text}`;

  return await generateJSON(prompt, () => {
    // Dynamic heuristic parser fallback
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const knownSkills = [
      'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Java', 'C++',
      'HTML', 'CSS', 'SQL', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'REST', 'GraphQL',
      'Tailwind', 'Linux', 'Express', 'Django', 'FastAPI', 'Kubernetes'
    ];
    const foundSkills = knownSkills.filter(s => {
      try {
        const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
      } catch {
        return text.toLowerCase().includes(s.toLowerCase());
      }
    });
    
    return {
      name: lines[0] || "Candidate",
      email: text.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || "",
      phone: text.match(/[\+\d\s\(\)-]{10,}/)?.[0]?.trim() || "",
      location: "",
      summary: lines.slice(0, 3).join(' '),
      skills: foundSkills.length > 0 ? foundSkills : ["JavaScript", "React", "Node.js", "Problem Solving"],
      experience: [
        {
          title: "Software Engineer",
          company: "Experience Listed in Resume",
          duration: "Recent",
          highlights: lines.slice(3, 6)
        }
      ],
      education: [
        {
          degree: "Degree / Coursework",
          institution: "University / Institute",
          year: "2024",
          gpa: ""
        }
      ],
      certifications: [],
      languages: ["English"]
    };
  });
}
