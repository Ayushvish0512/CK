export default async (request, context) => {
  const driveUrl = process.env.RESUME_LINK;
  
  if (!driveUrl) {
    return new Response(JSON.stringify({ error: 'NO_DRIVE_URL', message: 'Resume link not configured' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const fileIdMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (!fileIdMatch) {
    return new Response(JSON.stringify({ error: 'INVALID_DRIVE_URL', message: 'Invalid Google Drive URL format' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const fileId = fileIdMatch[1];
  const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  try {
    const response = await fetch(directDownloadUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`Drive responded with ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new Error('Drive returned HTML (likely permission/confirmation page or file not found)');
    }

    const arrayBuffer = await response.arrayBuffer();
    
    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Ayush-Vishwakarma-Resume.pdf"',
        'Content-Length': arrayBuffer.byteLength.toString(),
        'X-Resume-Source': 'google-drive',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.log('Drive download failed:', error.message);
    return new Response(JSON.stringify({ 
      error: 'DRIVE_DOWNLOAD_FAILED', 
      message: error.message,
      fallbackUrl: '/Ayush-Vishwakarma-Resume.pdf'
    }), {
      status: 424, // Failed Dependency
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: '/api/download-resume',
};