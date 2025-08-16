const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Vercel serverless (CommonJS)
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { q, source, target } = req.body || {};
  if (!q) {
    res.status(400).json({ error: 'No text to translate' });
    return;
  }

  // Try Argos OpenTech first (sometimes more reliable), fallback to libretranslate.de
  const endpoints = [
    'https://translate.argosopentech.com/translate',
    'https://libretranslate.de/translate'
  ];

  let lastError = null;
  for (const url of endpoints) {
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q, source, target, format: 'text' })
      });
      if (!r.ok) {
        lastError = new Error('API returned ' + r.status + ' for ' + url);
        continue;
      }
      const data = await r.json();
      // Common response shape: { translatedText: '...' }
      if (data && (data.translatedText || data.translations || data.result)) {
        // Some endpoints may return translatedText directly
        return res.status(200).json({ translatedText: data.translatedText || (data.translations && data.translations[0]) || data.result });
      }
      // If API uses different key, try to handle simple cases
      if (Array.isArray(data) && data[0] && data[0].translatedText) {
        return res.status(200).json({ translatedText: data[0].translatedText });
      }
      // Fallback: if response has any string field, try to return first
      for (const k of Object.keys(data)) {
        if (typeof data[k] === 'string') {
          return res.status(200).json({ translatedText: data[k] });
        }
      }
      lastError = new Error('Unexpected API shape from ' + url);
    } catch (err) {
      lastError = err;
    }
  }

  console.error('Translate failed:', lastError);
  res.status(500).json({ error: 'Translation failed' });
};
