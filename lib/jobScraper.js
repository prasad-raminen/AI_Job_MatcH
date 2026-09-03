import { sampleJobs } from './sampleData';

export async function searchJobs(query, location = '', page = 1) {
  const appId = process.env.ADZUNA_APP_ID;
  const apiKey = process.env.ADZUNA_API_KEY;

  if (appId && apiKey && appId !== 'your_adzuna_app_id_here') {
    try {
      const params = new URLSearchParams({
        app_id: appId,
        app_key: apiKey,
        what: query,
        results_per_page: '10',
        content_type: 'application/json',
      });
      if (location) params.set('where', location);

      const url = `https://api.adzuna.com/v1/api/jobs/us/search/${page}?${params}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error(`Adzuna API error: ${res.status}`);

      const data = await res.json();
      return {
        jobs: data.results.map(job => ({
          id: job.id?.toString() || Math.random().toString(36).slice(2),
          title: job.title,
          company: job.company?.display_name || 'Company Not Listed',
          location: job.location?.display_name || 'Location Not Specified',
          salary: job.salary_min && job.salary_max
            ? `$${Math.round(job.salary_min).toLocaleString()} - $${Math.round(job.salary_max).toLocaleString()}`
            : job.salary_is_predicted === 1
              ? `~$${Math.round(job.salary_min || job.salary_max || 0).toLocaleString()} (estimated)`
              : '',
          description: job.description,
          url: job.redirect_url,
          created: job.created,
        })),
        total: data.count || 0,
        source: 'adzuna',
      };
    } catch (error) {
      console.error('Adzuna API failed, falling back to sample jobs:', error.message);
    }
  }

  // Fallback: filter sample jobs by query
  const q = query.toLowerCase();
  const filtered = sampleJobs.filter(job =>
    job.title.toLowerCase().includes(q) ||
    job.company.toLowerCase().includes(q) ||
    job.description.toLowerCase().includes(q)
  );

  return {
    jobs: filtered.length > 0 ? filtered : sampleJobs,
    total: filtered.length > 0 ? filtered.length : sampleJobs.length,
    source: 'sample',
  };
}
