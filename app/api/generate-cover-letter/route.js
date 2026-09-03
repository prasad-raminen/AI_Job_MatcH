import { generateCoverLetter } from '@/lib/jobMatcher';

export async function POST(request) {
  try {
    const { resume, job } = await request.json();

    if (!resume || !job) {
      return Response.json(
        { error: 'Resume data and job details are required' },
        { status: 400 }
      );
    }

    const letterData = await generateCoverLetter(resume, job);
    return Response.json({ success: true, data: letterData });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    return Response.json(
      { error: error.message || 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}
