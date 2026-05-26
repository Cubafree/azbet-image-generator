const SIZE_MAP = {
  portrait:  '1024x1536',
  square:    '1024x1024',
  landscape: '1536x1024',
};

async function generateImage({ systemPrompt, userPrompt, imageSize = 'portrait' }) {
  const fullPrompt = `${systemPrompt}\n\nUser request: ${userPrompt}`;

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model:         'gpt-image-2',
      prompt:        fullPrompt,
      size:          SIZE_MAP[imageSize] || SIZE_MAP.portrait,
      quality:       'medium',
      output_format: 'jpeg',
      n:             1,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI API error ${response.status}`);
  }

  const data = await response.json();
  const b64 = data.data[0].b64_json;
  return Buffer.from(b64, 'base64');
}

module.exports = { generateImage };
