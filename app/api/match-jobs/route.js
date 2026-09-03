import { matchResumeToJob } from '@/lib/jobMatcher';

export async function POST(request) {
  try {
    const { resume, jobs } = await request.json();

    if (!resume || !jobs || !jobs.length) {
      return Response.json(
        { error: 'Resume data and at least one job are required' },
        { status: 400 }
      );
    }

    const matches = [];
    for (const job of jobs) {
      try {
        const jobText = `${job.title} at ${job.company}\nLocation: ${job.location}\n${job.description}`;
        const result = await matchResumeToJob(resume, jobText);
        matches.push({
          job,
          ...result,
        });
      } catch (err) {
        console.error(`Match error for ${job.title}:`, err.message);
        matches.push({
          job,
          overallScore: 0,
          error: 'Failed to analyze this job',
        });
      }
    }

    matches.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
    return Response.json({ success: true, matches });
  } catch (error) {
    console.error('Match error:', error);
    return Response.json(
      { error: error.message || 'Failed to match jobs' },
      { status: 500 }
    );
  }
}
