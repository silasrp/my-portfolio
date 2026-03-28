# My Portfolio Website

A production-grade personal portfolio built with React and deployed on Vercel's global edge network.

[![Live](https://img.shields.io/badge/Live-silasrp.dev-4AFFC4?style=flat-square&logo=vercel&logoColor=black)](https://silasrp.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)

---

## Overview

This is the source code for my personal portfolio site — a single-page React application that acts as a hub for my AI and software engineering projects. Each project card links out to an independently hosted live demo or repository.

The site was designed to balance **visual impact** with **technical honesty**: every animation and interaction has a real implementation rationale, not just an aesthetic one.

---

## Architecture

The project is structured across four distinct layers, each with a clear responsibility.

<img width="1440" height="1270" alt="image" src="https://github.com/user-attachments/assets/2c87a87b-8696-45c9-a90f-049b7cb6611b" />

### Layer 1 — Delivery (Vercel Edge CDN)

Vercel serves the portfolio from its global edge network, meaning the static files are cached and served from a node geographically close to each visitor. There is no origin server, no Node.js runtime, no database — the entire site resolves from pre-built static assets.

Deployment is triggered automatically on every push to `main`. Vercel detects the Vite framework, runs `npm run build`, and promotes the resulting `dist/` folder to the CDN in under 30 seconds. HTTPS is provisioned and renewed automatically.

### Layer 2 — Build (Vite)

Vite handles the entire build pipeline. During development it runs a lightning-fast dev server with Hot Module Replacement (HMR) so changes to `Portfolio.jsx` appear in the browser instantly, without a full reload.

For production, Vite bundles and tree-shakes the React application, strips all development-only code, and outputs a fingerprinted JS bundle alongside the static HTML and SVG favicon. The result is a minimal `dist/` folder that is the only artifact Vercel needs.

Key build outputs:
- **`index.html`** — the entry point. Contains `<meta>` tags, Open Graph social preview data, `theme-color` for mobile browsers, and the `<div id="root">` mount point.
- **`favicon.svg`** — a custom-designed SVG icon using the portfolio's exact colour palette (`#06060E` background, `#4AFFC4` mint accent), with corner bracket marks echoing the `<SilasPereira />` logo.
- **`assets/index-[hash].js`** — the complete bundled React application, content-hashed for optimal CDN cache invalidation.

### Layer 3 — Application (React)

The application is a single React component file (`Portfolio.jsx`) with no external UI library dependencies. All styles are injected as a `<style>` tag at mount time, keeping the bundle small and the component fully self-contained.

Three distinct pieces of logic live in this layer:

**`Portfolio` (main component)**  
The root component. Manages two pieces of global state: `scrolled` (a boolean that flips at 40px scroll depth, controlling the navbar's frosted-glass transition) and `mobileOpen` (controls the mobile drawer menu). Renders all five sections — Hero, Projects, About, Skills, Contact — and the fixed navbar.

**`NeuralCanvas` (canvas component)**  
A self-contained canvas animation that renders a live particle network in the hero section. Uses the browser's `requestAnimationFrame` API to run a draw loop at up to 60fps. A `ResizeObserver` watches the canvas element and defers initialisation until the browser has painted the element with real pixel dimensions — avoiding a common bug where `offsetWidth`/`offsetHeight` return `0` at mount time. Node count scales with viewport area (capped at 75) to keep performance consistent across screen sizes.

**`useTyping` (custom hook)**  
A pure React hook with no dependencies beyond `useState` and `useEffect`. Cycles through an array of title strings, typing each character at 80ms intervals, pausing for 2.2s at completion, then deleting at 40ms intervals before moving to the next word. Fully controlled by timeouts — no `setInterval`, no drift.

### Layer 4 — External (Google Fonts CDN)

Three typefaces are loaded from Google Fonts at runtime via a CSS `@import`:

- **Syne** (700, 800 weights) — used for all headings. Geometric, slightly futuristic, high visual weight.
- **Outfit** (300, 400, 500 weights) — used for body text. Clean and readable at small sizes.
- **JetBrains Mono** (400, 500 weights) — used for code labels, the nav links, section labels, and the typing animation. Signals technical context without being harsh.

---

## How It Works

### Boot sequence

When a user visits the site, this is the sequence of events:

1. **DNS resolves** to the nearest Vercel edge node. The response is typically served from cache with a `Cache-Control: public, max-age=31536000, immutable` header on the JS bundle.

2. **`index.html` is parsed** by the browser. The React script tag triggers the download of the JS bundle. While that loads, the browser also begins fetching the Google Fonts stylesheet.

3. **React bootstraps** — `ReactDOM.createRoot` mounts the `Portfolio` component into `#root`. The component renders its initial state synchronously.

4. **`useEffect` hooks fire** after the first paint:
   - The scroll listener is attached to `window`.
   - `ResizeObserver` is attached to the `<canvas>` element.

5. **`ResizeObserver` callback fires** once the canvas has real pixel dimensions. `init(width, height)` runs, generating the node array. The `requestAnimationFrame` loop starts.

6. **The typing hook** begins its first cycle after React's first commit, typing "Systems Engineer" one character at a time.

7. **Google Fonts arrive** (usually within 100–300ms on a warm connection). The browser swaps the fallback font for Syne, Outfit, and JetBrains Mono. Because the `@import` is in a `<style>` tag inside the React tree (not in `<head>`), the FOUT (Flash of Unstyled Text) window is minimal.

### Scroll-reactive navbar

The navbar listens for `window.scroll` events and flips a React boolean (`scrolled`) when `window.scrollY > 40`. This boolean drives two inline style changes on the `<nav>` element:

- `background` transitions from `transparent` to `rgba(6,6,14,0.92)` — a near-opaque version of the page background.
- `backdropFilter: blur(24px)` is always applied, but only becomes visible once the background is non-transparent.
- `borderBottom` transitions from `1px solid transparent` to `1px solid rgba(255,255,255,0.07)`.

All three changes are smoothed by `transition: all 0.3s` on the nav element.

### Canvas animation

Each animation frame:
1. Clears the canvas with `clearRect`.
2. Iterates all node pairs (O(n²)). For any pair within 130px of each other, draws a line with `strokeStyle` opacity and `lineWidth` proportional to `(1 - distance/130)` — closer nodes produce thicker, brighter edges.
3. For each node, draws a radial gradient "glow" (5× the node radius) then a solid core circle. The radius pulses subtly using `Math.sin(node.phase)`.
4. Updates each node's `(x, y)` position by its velocity. Reverses velocity on boundary collision.
5. Schedules the next frame with `requestAnimationFrame`.

Cleanup: the `useEffect` return function cancels the pending `raf` and disconnects the `ResizeObserver`, preventing memory leaks when the component unmounts.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| UI framework | React 18 | Component model, state, hooks |
| Build tool | Vite 5 | Dev server, bundling, HMR |
| Animations | Canvas API + rAF | Neural network background |
| Styling | CSS-in-JS (`<style>` tag) | Zero runtime overhead |
| Typography | Google Fonts | Syne, Outfit, JetBrains Mono |
| Hosting | Vercel | CDN, HTTPS, CI/CD |
| Favicon | SVG | Scalable, branded, 32×32 |

---

## Project Structure

```
my-portfolio/
├── public/
│   └── favicon.svg          # Custom SP-branded SVG icon
├── src/
│   ├── Portfolio.jsx         # Entire application (self-contained)
│   └── main.jsx              # React entry point
├── index.html                # HTML shell + meta/OG tags
├── vite.config.js            # Vite configuration
└── package.json
```

The deliberate choice to keep the entire application in a single `Portfolio.jsx` file — rather than splitting it into a conventional component tree — reflects the nature of the project: a static, single-page document with no routing, no shared state between sections, and no need for code-splitting. A flat structure here is simpler to reason about and easier to hand off.

---

## Local Development

```bash
# Clone and install
git clone https://github.com/silasrp/my-portfolio.git
cd my-portfolio
npm install

# Start the dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## Deployment

The `main` branch is connected to Vercel. Every push triggers an automatic deployment:

```bash
git add .
git commit -m "your change"
git push origin main
# → Vercel builds and deploys in ~30s
```

Manual deployment via CLI:

```bash
npm run build
npx vercel --prod
```

---

## Design Decisions

**Why a single JSX file?**  
For a portfolio with one page and no routing, splitting into multiple component files would add structural overhead without any benefit. Everything lives in one place — easy to read top-to-bottom, easy to fork and customise.

**Why CSS-in-JS via a `<style>` tag instead of a `.css` file?**  
It keeps the component fully self-contained. Drop `Portfolio.jsx` into any Vite project and it works without a separate stylesheet import. The style tag is injected once at mount and doesn't change — no runtime performance cost.

**Why `ResizeObserver` instead of `window.resize` for the canvas?**  
`window.resize` fires late and gives you window dimensions, not element dimensions. `ResizeObserver` fires as soon as the element's layout is computed by the browser — guaranteed to have real pixel values. It's also more precise for the canvas use-case, where we care about the element's rendered size, not the viewport.

**Why no UI component library?**  
Every visual detail on this site is intentional and specific. Using a library like shadcn/ui or Chakra would require overriding defaults constantly. Plain CSS with a design token system (CSS custom properties) gives full control with less code.

---

## Contact

- **Email** — silasrp@gmail.com
- **LinkedIn** — [linkedin.com/in/silasrp](https://www.linkedin.com/in/silasrp/)
- **GitHub** — [github.com/silasrp](https://github.com/silasrp/)
