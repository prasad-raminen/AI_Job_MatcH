import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'SkillMatch AI — AI Job Scraper & Resume Matcher',
  description: 'Upload your resume, search for jobs, and get AI-powered match scores with improvement suggestions. Built with Next.js and Google Gemini.',
  keywords: ['resume matcher', 'job scraper', 'AI', 'career', 'skills analysis'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
