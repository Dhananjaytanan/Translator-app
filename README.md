Vercel Translator (Serverless)
=============================

Files:
- index.html
- style.css
- app.js
- api/translate.js  (Vercel serverless function - proxies translation API calls)
- package.json

How to deploy to Vercel (recommended):
1. Unzip this project and push to a GitHub repo (or zip upload to Vercel).
2. In Vercel dashboard, create a new project and connect your repo (or import from ZIP).
3. Vercel will detect the `api` folder and deploy serverless function automatically.
4. Open the deployed site; the UI will call `/api/translate` which proxies to external translation APIs.

Notes & troubleshooting:
- Public LibreTranslate instances sometimes rate-limit or require API keys. The function tries Argos (https://translate.argosopentech.com) then libretranslate.de.
- If translations still fail, consider obtaining a stable translation API (paid) and updating `api/translate.js` to call it (add API key via Vercel Environment Variables and use process.env.API_KEY).
- To test locally: `npm install` then use `vercel dev` (if you have Vercel CLI) or run a simple static server and test the function with Vercel CLI.

