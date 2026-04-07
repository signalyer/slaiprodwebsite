# Signal Layer AI — Claude Code Instructions

## Project Overview
Signal Layer AI is a React + Vite + TypeScript marketing site for an AI/ML decision intelligence
platform. Deployed via Azure Static Web Apps with an integrated Azure Function for the contact API.

**Owner:** Signal Layer
**Local path:** `C:\SignalAssets\SignalLayerAI`
**GitHub:** `github.com/signalyer/slaiprodwebsite`
**Production URL:** `https://signallayer.ai`
**Platform:** Windows 11 (bash shell via Claude Code)

---

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Framer Motion animations
- React Router v6 (SPA — home `/` and `/agentic-ai` route)
- Fonts: Syne (headings) + DM Sans (body) via Google Fonts
- Azure Static Web Apps (hosting, free tier)
- Azure Functions (contact form API — integrated in SWA at `/api/contact`)
- Cloudflare Turnstile (bot protection)
- Microsoft Graph API via M365 (email delivery — sends as contact@signallayer.ai)
- Supabase (client integration in `src/integrations/supabase/`)
- Google Analytics GA4: `G-1LK1QQX5GN`

---

## Project Structure

```
C:\SignalAssets\SignalLayerAI\
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx          # Hero with animated signal flow SVG
│   │   ├── AboutSection.tsx
│   │   ├── FeaturesSection.tsx      # 2x2 image cards + modal
│   │   ├── FeatureDetailModal.tsx
│   │   ├── ApproachSection.tsx
│   │   ├── AgenticSection.tsx
│   │   ├── TestimonialsSection.tsx  # Outcomes/metrics section
│   │   ├── ContactSection.tsx       # Turnstile + Azure Function
│   │   ├── Footer.tsx               # Scroll-nav links + email only
│   │   ├── FloatingParticles.tsx
│   │   ├── CursorGlow.tsx
│   │   ├── ScrollToTop.tsx
│   │   ├── NavLink.tsx
│   │   └── agentic/                 # /agentic-ai sub-page components
│   │       ├── AgenticCTA.tsx
│   │       ├── AgenticHero.tsx
│   │       ├── ArchitecturePatterns.tsx
│   │       ├── HumanInTheLoop.tsx
│   │       ├── MetricsStrip.tsx
│   │       ├── ParadigmShift.tsx
│   │       ├── PlatformArchitecture.tsx
│   │       ├── TechCapabilities.tsx
│   │       └── diagrams/
│   ├── pages/
│   │   ├── Index.tsx
│   │   ├── AgenticAI.tsx
│   │   └── NotFound.tsx
│   ├── assets/                      # Holographic JPG images (1024x1024 square)
│   ├── hooks/
│   ├── integrations/supabase/       # Supabase client + types
│   ├── lib/
│   └── index.css                    # Global styles, dot-grid bg, animations
├── api/
│   ├── contact/
│   │   ├── index.js                 # Azure Function: Turnstile verify + Graph API email
│   │   └── function.json            # HTTP trigger config (POST /api/contact)
│   ├── host.json                    # Azure Functions v4 runtime config
│   └── package.json
├── workers/                         # Legacy Cloudflare Worker (kept for reference)
│   └── contact-api/index.js
├── supabase/
│   ├── config.toml
│   └── functions/send-contact-email/index.ts
├── public/
│   ├── robots.txt
│   ├── _headers                     # Legacy Cloudflare headers (not active on Azure)
│   ├── _redirects                   # Legacy Cloudflare redirects (not active on Azure)
│   └── *.png / *.ico / *.jpg        # Brand assets, favicons, OG image
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml  # CI/CD: builds + deploys on push to main
├── staticwebapp.config.json         # SPA routing, no-cache headers, noindex
├── index.html                       # GA4 G-1LK1QQX5GN, Syne+DM Sans fonts
├── wrangler.toml                    # Legacy Cloudflare Worker config
├── tailwind.config.ts
├── vite.config.ts
└── CLAUDE.md                        # This file
```

---

## Environment Variables

### Local development — `.env.local` (never commit)
```
VITE_TURNSTILE_SITE_KEY=<site key>
VITE_CONTACT_API_URL=/api/contact
```

### GitHub Secrets (Settings → Secrets → Actions)
```
AZURE_STATIC_WEB_APPS_API_TOKEN=<from Azure SWA creation>
VITE_TURNSTILE_SITE_KEY=<site key>
```

### Azure Portal → Static Web App → Configuration → Application Settings
```
TURNSTILE_SECRET=<Cloudflare Turnstile secret key>
GRAPH_TENANT_ID=<Azure AD tenant ID>
GRAPH_CLIENT_ID=<Azure AD client ID>
GRAPH_CLIENT_SECRET=<Azure AD client secret>
```

---

## Microsoft Graph API Setup (M365 email delivery)

The contact form sends email via Microsoft Graph API using an Azure AD app registration.
Register once before setting Azure app settings:

1. Azure Portal → Azure Active Directory → App registrations → **New registration**
2. Name: `SignalLayer Contact Form`, Single tenant
3. Copy **Application (client) ID** → `GRAPH_CLIENT_ID`
4. Copy **Directory (tenant) ID** → `GRAPH_TENANT_ID`
5. Certificates & secrets → New client secret → copy **Value** → `GRAPH_CLIENT_SECRET`
6. API permissions → Add → Microsoft Graph → Application → **Mail.Send**
7. **Grant admin consent** for the tenant

---

## Contact Form Flow

```
User fills form
  → Cloudflare Turnstile validates (client-side, invisible)
  → POST to /api/contact with { name, email, phone, message, turnstileToken }
  → Azure Function verifies token with Cloudflare siteverify API
  → Azure Function sends email via Microsoft Graph API (M365)
  → Email arrives at contact@signallayer.ai with subject "Signal Layer"
  → User sees success state + confetti
```

---

## Local Development

```bash
npm install
npm run dev
```
Site runs at `http://localhost:8080`

---

## Build Commands

```bash
npm run build       # Production build → dist/
npx tsc --noEmit    # TypeScript check only
npm run preview     # Serve dist/ locally at :4173
```

---

## Azure Deployment

### Prerequisites
```bash
az --version        # Azure CLI
node --version      # Must be 18+
git --version
```

### 1 — Authenticate
```bash
az login
az account set --subscription "YOUR_SUBSCRIPTION_ID"
```

### 2 — Create resource group
```bash
az group create --name signallayer-rg --location eastus
```

### 3 — Create Static Web App (connects to GitHub)
```bash
az staticwebapp create \
  --name signallayer-ai \
  --resource-group signallayer-rg \
  --location eastus \
  --source https://github.com/signalyer/slaiprodwebsite \
  --branch main \
  --app-location "/" \
  --api-location "api" \
  --output-location "dist" \
  --login-with-github
```

### 4 — Get deployment token → add to GitHub Secrets
```bash
az staticwebapp secrets list \
  --name signallayer-ai \
  --resource-group signallayer-rg \
  --query "properties.apiKey" \
  --output tsv
```
Add to GitHub → Settings → Secrets → Actions:
- `AZURE_STATIC_WEB_APPS_API_TOKEN` = the token above
- `VITE_TURNSTILE_SITE_KEY` = your Turnstile site key

### 5 — Set Azure application settings
```bash
az staticwebapp appsettings set \
  --name signallayer-ai \
  --resource-group signallayer-rg \
  --setting-names \
    TURNSTILE_SECRET="<paste>" \
    GRAPH_TENANT_ID="<paste>" \
    GRAPH_CLIENT_ID="<paste>" \
    GRAPH_CLIENT_SECRET="<paste>"
```

### 6 — Verify default Azure URL
```bash
az staticwebapp show \
  --name signallayer-ai \
  --resource-group signallayer-rg \
  --query defaultHostname \
  --output tsv
```

### 7 — Custom domain setup
```bash
az staticwebapp hostname set \
  --name signallayer-ai \
  --resource-group signallayer-rg \
  --hostname www.signallayer.ai

az staticwebapp hostname set \
  --name signallayer-ai \
  --resource-group signallayer-rg \
  --hostname signallayer.ai
```
SSL certificates provision automatically.

---

## Key Files Reference

| File | Purpose |
|---|---|
| `src/components/ContactSection.tsx` | Form with Turnstile, posts to /api/contact |
| `src/components/Header.tsx` | Nav with active section scroll tracking |
| `src/components/HeroSection.tsx` | Hero with animated SVG signal flow diagram |
| `src/components/FeaturesSection.tsx` | 2x2 cards, aspect-ratio 4/3, per-card objectPosition |
| `src/components/Footer.tsx` | Button-based scroll nav, email-only contact link |
| `api/contact/index.js` | Azure Function: Turnstile verify + Graph API email |
| `staticwebapp.config.json` | SPA routing, no-cache headers, noindex |
| `.github/workflows/azure-static-web-apps.yml` | CI/CD: builds on push to main |
| `index.html` | GA4 tag, Syne + DM Sans font imports |

---

## Brand Design System

| Token | Value |
|---|---|
| Primary | `hsl(172 72% 42%)` — teal |
| Accent | `hsl(188 85% 48%)` — cyan |
| Background | `hsl(222 28% 5%)` — near-black |
| Card | `hsl(222 24% 9%)` |
| Border | `hsl(222 18% 14%)` |
| Heading font | Syne (700/800 weight) |
| Body font | DM Sans (400/500 weight) |
| Border radius | `0.75rem` |
| Gradient | `linear-gradient(135deg, hsl(172 72% 42%), hsl(200 85% 52%))` |
| Background pattern | Dot grid via CSS `radial-gradient`, 28px repeat |

---

## Pending Items

- [ ] **Azure AD app registration** — need Tenant ID, Client ID, Client Secret for Graph email
- [ ] **SignalCare section** — add when ready to launch (brief + assets needed)
- [ ] **Real testimonials/outcomes** — replace placeholder metrics in `TestimonialsSection.tsx`
- [ ] **Privacy Policy page** — footer link currently points to `#`
- [ ] **Terms of Service page** — footer link currently points to `#`
