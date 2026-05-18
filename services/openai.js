const { SYSTEM_PROMPT } = require('../config');

async function generateImage(userPrompt) {
  const fullPrompt = `${SYSTEM_PROMPT}\n\nUser request: ${userPrompt}`;

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-image-2',
      prompt: fullPrompt,
      size: '1024x1536',
      quality: 'medium',
      output_format: 'jpeg',
      n: 1,
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
