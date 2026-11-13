# Lihini Gimhani — Portfolio

Professional responsive portfolio with a **React + Vite frontend** and an **Express API backend**.

## Structure

```
frontend/    React app; deploy to Vercel
backend/     Express API; deploy to Render
```

## Run locally

Open two terminals:

**Terminal 1 — frontend**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 2 — backend**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The contact form uses a `mailto:` fallback until `VITE_API_URL` is configured. You can create a file named `frontend/.env.local` containing:

```env
VITE_API_URL=http://localhost:10000
```

If you enable API mode, configure SMTP in `backend/.env` for contact delivery. No messages are stored in a database.

## Publish to GitHub

1. Create a **public** repository named `lihini-portfolio` on GitHub (do not initialize with README because this project already has one).
2. Extract the ZIP and open a terminal in its root folder.
3. Run:

```bash
git init
git add .
git commit -m "Initial professional portfolio"
git branch -M main
git remote add origin https://github.com/ullihinigimhani-oss/lihini-portfolio.git
git push -u origin main
```

## Vercel frontend

1. Import your GitHub repo into Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite**; build command `npm run build`; output directory `dist`.
4. Deploy. For contact API integration, set `VITE_API_URL` to your Render backend URL and redeploy.

## Render backend

1. New Web Service → connect the same GitHub repo.
2. Set **Root Directory** to `backend`.
3. Runtime: **Node**; build command `npm install`; start command `npm start`.
4. Add environment variables: `FRONTEND_URL=https://YOUR-VERCEL-URL.vercel.app`, `CONTACT_EMAIL`, and `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` if you want contact form email delivery. SMTP availability can depend on your Render plan/network policy; otherwise use the `mailto:` fallback.
5. Test `https://YOUR-RENDER-SERVICE.onrender.com/api/health`.

**Never commit SMTP secrets or `.env` files.** Add your actual Vercel URL to `FRONTEND_URL` without a trailing slash. Multiple origins may be comma-separated.

## Content notes

- All project descriptions are curated summaries from the CV and supplied GitHub repositories. Confirm detailed contributions and project status before publishing.
- `Textile-Saree` link was provided but did not resolve during verification; check its GitHub visibility or repository spelling.
- AWS PDFs are **training completion certificates**, not professional AWS exam certifications.
- For portrait updates, replace `frontend/public/profile.png` with your preferred high-quality original photo.
- To change text, links, and projects, edit `frontend/src/main.jsx`.
