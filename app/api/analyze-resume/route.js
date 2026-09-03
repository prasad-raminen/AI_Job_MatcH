import { analyzeResume } from '@/lib/jobMatcher';

export async function POST(request) {
  try {
    const { resume } = await request.json();

    if (!resume) {
      return Response.json({ error: 'Resume data is required' }, { status: 400 });
    }

    const analysis = await analyzeResume(resume);
    return Response.json({ success: true, analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    return Response.json(
      { error: error.message || 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}
