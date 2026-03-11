exports.handler = async function() {
  const today = new Date().toISOString().split('T')[0];
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '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',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system: 'You curate positive Africa and African diaspora news. Return ONLY a valid JSON array. No markdown. No backticks.',
        messages: [{
          role: 'user',
          content: `Today is ${today}. Generate 9 uplifting news stories about Africa and the African diaspora from the past 2 weeks. Positive only: achievements, investments, launches, cultural wins. Real countries and cities. JSON array, each item: {title, description, url, source:{name}, publishedAt, category (business/innovation/culture/diaspora/health), country}`
        }]
      })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    const text = data.content.map(c => c.text || '').join('');
    const clean = text.replace(/```json\n?|```/g, '').trim();
    const articles = JSON.parse(clean);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(articles)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
