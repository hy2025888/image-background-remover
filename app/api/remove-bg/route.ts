import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // @ts-ignore - Cloudflare Pages env
    const apiKey = process.env.REMOVEBG_API_KEY || '';
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const removeBgForm = new FormData();
    removeBgForm.append('image_file', image);
    removeBgForm.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgForm,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove.bg API error:', errorText);
      return NextResponse.json({ 
        error: 'Background removal failed', 
        details: errorText 
      }, { status: response.status });
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: { 'Content-Type': 'image/png' },
    });
  } catch (error) {
    console.error('Error in remove-bg route:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
