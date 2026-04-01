export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const image = formData.get('image');

    if (!image) {
      return new Response(JSON.stringify({ error: 'No image provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = context.env.REMOVEBG_API_KEY || 'V5DvvAqBdTsX2x4okgAWFmb9';

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
      return new Response(JSON.stringify({ 
        error: 'Background removal failed', 
        details: errorText 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(response.body, {
      headers: { 'Content-Type': 'image/png' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
