import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get('image') as File;

  if (!image) {
    return NextResponse.json({ error: 'No image' }, { status: 400 });
  }

  const removeBgForm = new FormData();
  removeBgForm.append('image_file', image);
  removeBgForm.append('size', 'auto');

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': process.env.REMOVEBG_API_KEY || '',
    },
    body: removeBgForm,
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'API Error' }, { status: 500 });
  }

  const blob = await response.blob();
  return new NextResponse(blob, {
    headers: { 'Content-Type': 'image/png' },
  });
}
