import './globals.css';
import Navbar from '@/components/Navbar';
import { ToastProvider } from '@/components/Toast';

export const metadata = {
  title: 'SkillMatch AI — AI Job Scraper & Resume Matcher',
  description: 'Upload your resume, search for jobs, and get AI-powered match scores with improvement suggestions. Built with Next.js and Google Gemini.',
  keywords: ['resume matcher', 'job scraper', 'AI', 'career', 'skills analysis'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ToastProvider>
          <Navbar />
          <main>{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
