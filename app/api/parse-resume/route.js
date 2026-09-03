import { parseResume } from '@/lib/resumeParser';

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let text = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('resume');
      const pastedText = formData.get('text');

      if (pastedText) {
        text = pastedText;
      } else if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        // Dynamic import to avoid webpack issues
        const pdfParse = (await import('pdf-parse')).default;
        const pdfData = await pdfParse(buffer);
        text = pdfData.text;
      }
    } else {
      const body = await request.json();
      text = body.text || '';
    }

    if (!text.trim()) {
      return Response.json({ error: 'No resume text provided' }, { status: 400 });
    }

    const parsed = await parseResume(text);
    return Response.json({ success: true, data: parsed, rawText: text });
  } catch (error) {
    console.error('Resume parse error:', error);
    return Response.json(
      { error: error.message || 'Failed to parse resume' },
      { status: 500 }
    );
  }
}
