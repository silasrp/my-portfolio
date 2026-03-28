# AI/ML Portfolio — Setup & Deployment Guide

## 1. Scaffold the project (5 minutes)

```bash
npm create vite@latest my-portfolio -- --template react
cd my-portfolio
npm install
```

Copy `Portfolio.jsx` into `src/`.

Replace `src/App.jsx` with:

```jsx
import Portfolio from './Portfolio'
export default function App() { return <Portfolio /> }
```

Run locally:
```bash
npm run dev
```

---

## 2. Personalise (search for "EDIT:" in Portfolio.jsx)

| Location              | What to change                              |
|-----------------------|---------------------------------------------|
| `<YourName />`        | Your name / handle in the nav logo          |
| `Your Name` in hero   | Your actual name                            |
| Hero tagline          | Your personal pitch sentence                |
| Bio paragraphs        | About-section text                          |
| Stats (6+, 20+, 3)    | Real numbers                                |
| `PROJECTS` array      | Real project titles, descriptions, and URLs |
| `SKILLS` object       | Your real tech stack                        |
| Contact links         | Your email, LinkedIn, GitHub URLs           |

---

## 3. Hosting options (ranked by professionalism)

### ★ Option A — Vercel (Recommended, Free tier covers everything)

Best for React/Vite. Zero-config. Instant global CDN. Custom domain with auto-HTTPS.

```bash
npm install -g vercel
vercel
# follow prompts — it auto-detects Vite
```

Or connect your GitHub repo at vercel.com and push-to-deploy is automatic.
Custom domain: add in Vercel dashboard → Domains. ~$10–15/yr for a `.com` domain via Namecheap or Cloudflare Registrar.

**Recommended domain format:** `yourname.dev` or `yourname.ai` (~$12–20/yr)

---

### Option B — Netlify (Free, similar to Vercel)

```bash
npm run build
# drag-drop the `dist/` folder at app.netlify.com/drop
```
Or connect GitHub for CI/CD. Custom domain support included.

---

### Option C — Cloudflare Pages (Free, fastest global CDN)

```bash
npm run build
```
Upload `dist/` via Cloudflare dashboard → Pages → Deploy.
Bonus: if you buy a domain through Cloudflare Registrar, DNS setup is one click.

---

### Option D — GitHub Pages (Free, slight limitations)

Add to `vite.config.js`:
```js
export default { base: '/your-repo-name/' }
```

```bash
npm install --save-dev gh-pages
# add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"
npm run deploy
```

---

## 4. Custom domain (strongly recommended for recruiters)

Buy from **Cloudflare Registrar** (at-cost, no markup) or **Namecheap**.

Good formats:
- `yourname.dev`      — clean, modern (~$12/yr)
- `yourname.ai`       — signals the field (~$60–80/yr, worth it for AI roles)
- `yourname.io`       — classic dev portfolio (~$35/yr)

Point your domain to Vercel/Netlify via their DNS docs (takes ~5 minutes).

---

## 5. Recommended extras (optional but impactful)

| Tool                | Why                                      | Cost       |
|---------------------|------------------------------------------|------------|
| **Plausible.io**    | Privacy-friendly analytics (see traffic) | $9/mo      |
| **Umami**           | Self-hosted analytics (free on Vercel)   | Free       |
| **GitHub README**   | Link portfolio in your GitHub profile    | Free       |
| **og:image**        | Social preview card (add meta tags)      | Free       |

### Add Open Graph meta tags (paste in `index.html` `<head>`):
```html
<meta property="og:title"       content="Your Name — AI Engineer" />
<meta property="og:description" content="AI/ML projects and research" />
<meta property="og:image"       content="https://yoursite.dev/og.png" />
<meta property="og:url"         content="https://yoursite.dev" />
<meta name="twitter:card"       content="summary_large_image" />
```

---

## 6. Adding a new project

In `Portfolio.jsx`, add an entry to the `PROJECTS` array:

```js
{
  id:     "07",
  title:  "Your Project Name",
  desc:   "One or two sentences describing what it does and why it matters.",
  tags:   ["Python", "PyTorch", "FastAPI"],
  link:   "https://your-project-url.com",
  status: "Active",   // Production | Active | Research | Experimental
},
```
