# LifeOS

A simple Daily Check-In web app built with Next.js. Capture how you're feeling, reflect on your day, and let AI summarize your notes into a quick takeaway.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Features
- Mood selector and reflection text area for each check-in
- AI-generated summary powered by the `/api/summary` route
- Saved check-in history stored locally in the browser

## Notes
Add an `OPENAI_API_KEY` environment variable to enable AI summaries. Without a key, the API route will return an error response.
