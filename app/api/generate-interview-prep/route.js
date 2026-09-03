import { generateInterviewPrep } from '@/lib/jobMatcher';

export async function POST(request) {
  try {
    const { resume, job } = await request.json();

    if (!resume || !job) {
      return Response.json(
        { error: 'Resume data and job details are required' },
        { status: 400 }
      );
    }

    const prepData = await generateInterviewPrep(resume, job);
    return Response.json({ success: true, data: prepData });
  } catch (error) {
    console.error('Interview prep generation error:', error);
    return Response.json(
      { error: error.message || 'Failed to generate interview prep' },
      { status: 500 }
    );
  }
}
