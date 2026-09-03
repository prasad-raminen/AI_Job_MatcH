import { searchJobs } from '@/lib/jobScraper';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'software engineer';
    const location = searchParams.get('location') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);

    const results = await searchJobs(query, location, page);
    return Response.json({ success: true, ...results });
  } catch (error) {
    console.error('Job search error:', error);
    return Response.json(
      { error: error.message || 'Failed to search jobs' },
      { status: 500 }
    );
  }
}
