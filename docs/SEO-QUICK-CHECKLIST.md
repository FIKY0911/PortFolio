# SEO Quick Implementation Checklist

**Project:** Portfolio | **Tech:** React + Vite | **Goal:** SEO to Google Index

---

## 📦 Phase 1: Code Implementation

### Install Dependencies
```bash
npm install react-helmet-async react-ga4
```

### Update `src/main.jsx`
```jsx
import { HelmetProvider } from 'react-helmet-async'
import ReactGA from 'react-ga4'

ReactGA.initialize('G-XXXXXXXXXX')

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
)
```

### Create New Files
```
src/components/seo/SEO.jsx
src/utils/analytics.js
src/pages/NotFound.jsx (optional but recommended)
```

### Add SEO Component to Every Page
```jsx
// Di setiap page component
import SEO from '../components/seo/SEO'

<SEO
  title="Page Title"
  description="Page description"
  ogUrl="/current-path"
  canonical="/current-path"
/>
```

### Update `App.jsx` or `router.jsx`
```jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../utils/analytics'

useEffect(() => {
  trackPageView(location.pathname)
}, [location])
```

### Update `package.json`
```json
{
  "scripts": {
    "build": "vite build",
    "postbuild": "node scripts/generate-sitemap.js"
  }
}
```

### Update `public/sitemap.xml`
- Pastikan semua route entries
- Update `lastmod` tanggal ke hari ini

---

## 🔍 Phase 2: Google Search Console

### Create Property
- [ ] Go to search.google.com/search-console
- [ ] Add property: `https://portfolio-fiky.vercel.app`
- [ ] Choose URL prefix method

### Verify Ownership
Pick ONE method:

- [ ] **HTML File Upload** (Recommended)
  - [ ] Download `googleXXXXXXXXXX.html` from GSC
  - [ ] Copy to `public/` folder
  - [ ] Commit & push
  - [ ] Click Verify in GSC

- [ ] **HTML Meta Tag**
  - [ ] Replace placeholder in `index.html` line 11
  - [ ] Deploy to Vercel
  - [ ] Click Verify

- [ ] **DNS Record via Vercel**
  - [ ] Vercel Dashboard → Settings → Domains
  - [ ] Add TXT record
  - [ ] Click Verify

### Submit Sitemap
- [ ] GSC → Sitemaps
- [ ] Enter: `/sitemap.xml`
- [ ] Click Submit
- [ ] Wait for ✅ Success status

### Request Indexing (Do this AFTER deployment)
- [ ] URL Inspection → Input homepage → Request indexing
- [ ] Repeat for `/about`
- [ ] Repeat for `/project`
- [ ] Repeat for `/skill`
- [ ] Repeat for `/contact`

---

## 📊 Phase 3: Google Analytics 4

### Create GA4 Property
- [ ] Go to analytics.google.com
- [ ] Create property → Web
- [ ] Enter website URL
- [ ] Copy Measurement ID (format: `G-XXXXXXXXXX`)

### Add to Code
- [ ] Update `main.jsx` with GA4 ID
- [ ] Deploy

### Verify Tracking
- [ ] Open production site
- [ ] Chrome DevTools → Console → type `dataLayer`
- [ ] Should see GA4 events
- [ ] Network tab → filter "collect" → see requests

---

## 🚀 Phase 4: Deploy to Vercel

### Pre-Deployment
- [ ] Run local build: `npm run build`
- [ ] Preview locally: `npm run preview`
- [ ] Check console for errors
- [ ] Test all routes work

### Git Push
```bash
git add .
git commit -m "feat: complete SEO implementation"
git push origin main
```

### Vercel Deployment
- [ ] Wait for Vercel build (1-3 min)
- [ ] Check production URL: https://portfolio-fiky.vercel.app
- [ ] View page source → meta tags appear
- [ ] Inspect element → check `<head>` content
- [ ] Test routing (click all nav links)

### Post-Deployment Tests
- [ ] [PageSpeed Insights](https://pagespeed.web.dev) → Score > 80
- [ ] [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) → ✅ Pass
- [ ] [Rich Results Test](https://search.google.com/test/rich-results) → No errors
- [ ] Open Graph debugger (Facebook/LinkedIn)
- [ ] GA4 real-time report → see your visit

---

## ✅ Phase 5: Verification (Wait 24-48 hours)

### Day 1 Check
- [ ] GSC: Property verified
- [ ] GSC: Sitemap submitted & processed
- [ ] GA4: Real-time tracking works

### Day 3-7 Check
- [ ] GSC: URL Inspection → "URL is on Google" (indexed)
- [ ] Search Google: `site:portfolio-fiky.vercel.app`
- [ ] At least 5 URLs indexed
- [ ] No crawl errors in GSC Coverage

### Day 14+ Check
- [ ] Keywords appear in Google search
- [ ] CTR > 0% (some clicks)
- [ ] Impressions increasing weekly

---

## 🔧 Common Issues & Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Meta tags not showing | Check HelmetProvider wraps App, check SEO component mounted |
| GA4 not tracking | Verify Measurement ID, check adblocker, check console errors |
| GSC verification fails | Use HTML file upload method (most reliable) |
| 404 page not showing | Add `<Route path="*" element={<NotFound />} />` di router |
| Sitemap error | Validate XML at xmlvalidation.com |
| Slow LCP | Optimize hero image (compress, use WebP, add loading="lazy") |

---

## 📋 Final SEO Scorecard

### On-Page SEO (30 points)
- [ ] Unique title per page (5 pts)
- [ ] Unique meta description per page (5 pts)
- [ ] Proper heading hierarchy (H1, H2, H3) (5 pts)
- [ ] Canonical URLs set (5 pts)
- [ ] Open Graph tags (5 pts)
- [ ] Twitter Card tags (5 pts)

### Technical SEO (30 points)
- [ ] robots.txt configured (5 pts)
- [ ] Sitemap.xml submitted (5 pts)
- [ ] No broken links (5 pts)
- [ ] HTTPS enabled (5 pts)
- [ ] Mobile-responsive (5 pts)
- [ ] PageSpeed > 80 (5 pts)

### Content SEO (20 points)
- [ ] Quality content (>300 words / page) (10 pts)
- [ ] Keywords naturally integrated (5 pts)
- [ ] Internal linking (5 pts)

### Structured Data (10 points)
- [ ] JSON-LD schema implemented (10 pts)

### Analytics & Monitoring (10 points)
- [ ] GA4 tracking installed (5 pts)
- [ ] GSC verified & monitored (5 pts)

**Target Score:** 90+ points ✅

---

## 📞 Emergency Contacts

**Google Documentation:**
- [GSC Help](https://support.google.com/webmasters/)
- [GA4 Help](https://support.google.com/analytics/)

**Debug Tools:**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [URL Inspection Tool](https://search.google.com/search-console)

---

**Last Updated:** 2025-04-21  
**Estimated Time to Complete:** 2-3 hours (code) + 1 week (Google indexing)
