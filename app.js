const express = require('express');
const path = require('node:path');

const app = express();
const port = Number(process.env.PORT || 3001);
app.disable('x-powered-by');
app.use(express.json({ limit: '24kb' }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1h' }));

const baseUrl = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
const model = process.env.OPENAI_MODEL || '';
const apiKey = process.env.OPENAI_API_KEY || '';

app.get('/health', (_req, res) => res.json({ status: 'ok', app: 'WormGPT Code Lab' }));
app.get('/api/status', (_req, res) => {
  let safeBase = '';
  try { safeBase = new URL(baseUrl).origin + new URL(baseUrl).pathname.replace(/\/+$/, ''); } catch {}
  res.json({ configured: Boolean(apiKey && model), baseUrl: safeBase, model: model || '' });
});

app.post('/api/chat', async (req, res) => {
  const messages = req.body && req.body.messages;
  const mode = typeof req.body?.mode === 'string' ? req.body.mode.slice(0, 60) : 'General coding';
  const language = req.body?.language === 'English' ? 'English' : 'Vietnamese';
  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 24) {
    return res.status(400).json({ error: 'Messages must be an array with 1–24 items.' });
  }
  const clean = [];
  let total = 0;
  for (const m of messages) {
    if (!m || !['user', 'assistant'].includes(m.role) || typeof m.content !== 'string') {
      return res.status(400).json({ error: 'Invalid message format.' });
    }
    const content = m.content.slice(0, 12000);
    total += content.length;
    clean.push({ role: m.role, content });
  }
  if (total > 20000) return res.status(413).json({ error: 'Conversation is too large. Send a shorter prompt.' });
  if (!apiKey || !model) {
    return res.status(503).json({
      error: 'AI provider is not configured yet. Set OPENAI_API_KEY and OPENAI_MODEL in the hosting environment. OPENAI_BASE_URL is optional for OpenAI-compatible providers.'
    });
  }
  let endpoint;
  try {
    const parsed = new URL(baseUrl);
    if (parsed.protocol !== 'https:' && parsed.hostname !== 'localhost' && parsed.hostname !== '127.0.0.1') {
      return res.status(400).json({ error: 'Provider URL must use HTTPS, except for local development.' });
    }
    endpoint = new URL(baseUrl + '/chat/completions').toString();
  } catch {
    return res.status(400).json({ error: 'OPENAI_BASE_URL is not a valid URL.' });
  }

  const systemPrompt = [
    'You are a highly capable software engineering assistant inside Code Lab.',
    'Help with practical programming, project architecture, debugging, code review, tests, documentation, and defensive security.',
    'Be precise. State assumptions. When generating multi-file projects, label each file path and provide complete code where practical.',
    'Do not claim to have executed or tested code unless a tool actually did so. Point out relevant limitations and security risks.',
    'Do not provide malware, credential theft, unauthorized access, or instructions to evade security protections. Offer safe alternatives when needed.',
    'Reply in ' + language + '. Current task mode: ' + mode + '.'
  ].join('\n');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: systemPrompt }, ...clean],
        temperature: 0.25,
        max_tokens: 4096,
        stream: false
      }),
      signal: controller.signal
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const providerMessage = data?.error?.message || data?.message || ('Provider returned HTTP ' + response.status);
      return res.status(502).json({ error: String(providerMessage).slice(0, 700) });
    }
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      return res.status(502).json({ error: 'The provider response did not contain a text answer. Check that the configured model supports chat completions.' });
    }
    return res.json({ content, model: data.model || model, usage: data.usage || null, demo: false });
  } catch (error) {
    const message = error.name === 'AbortError'
      ? 'The model request timed out after 90 seconds.'
      : 'Could not reach the configured AI provider. Check the base URL and provider status.';
    return res.status(502).json({ error: message });
  } finally {
    clearTimeout(timer);
  }
});

app.use((err, _req, res, _next) => {
  if (err && err.type === 'entity.too.large') return res.status(413).json({ error: 'Request body is too large.' });
  res.status(500).json({ error: 'Unexpected server error.' });
});

app.listen(port, '0.0.0.0', () => {
  console.log('WormGPT Code Lab listening on port ' + port);
});
