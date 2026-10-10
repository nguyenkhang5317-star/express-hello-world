## WormGPT Code Lab

A responsive AI coding workspace with a dark neon interface and a server-side OpenAI-compatible Chat Completions proxy.

## Features
- Responsive chat workspace and coding-task shortcuts
- Chat history during the current browser session
- Coding modes: build, generate, debug, explain, refactor, review
- Server-side provider requests; API credentials are not sent to browser JavaScript
- Health endpoint at /health and configuration status at /api/status
- Request-size limits, bounded message history, request timeout, and clear provider errors

## Run locally
1. Install Node.js 20 or newer.
2. Run npm install.
3. Set environment variables: OPENAI_BASE_URL (for example https://api.openai.com/v1), OPENAI_MODEL (the exact model ID allowed by your provider), and OPENAI_API_KEY (your secret API key).
4. Run npm start and open http://localhost:3001.

Do not commit API keys to this repository or place them in frontend code.

## Deploy on Render
1. Open the Render Dashboard and choose New -> Web Service, or use the Blueprint from render.yaml.
2. Select this repository and choose branch wormgpt-code-lab.
3. Build command: npm install. Start command: npm start.
4. Add OPENAI_BASE_URL, OPENAI_MODEL, and OPENAI_API_KEY in Render Environment settings. Use the exact base URL and model ID supplied by your provider.
5. Deploy and check /health.

The website does not include or train a model. Answer quality, context limits, and coding ability depend on the configured provider/model and its API access. This project is intended for general software development, debugging, code review, and defensive security.
