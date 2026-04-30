# Google Search Console Implementation Guide

**For:** Portfolio Website (Mohamad Fiky Ba'dafitro)  
**Purpose:** Step-by-step setup and usage of Google Search Console for SEO monitoring

---

## 📋 Quick Setup Summary

### 1. Create GSC Property
- Go to [Google Search Console](https://search.google.com/search-console)
- Click "Add property" → Choose "URL prefix"
- Enter: `https://portfolio-fiky.vercel.app`
- Click "Continue"

### 2. Verify Ownership (Choose ONE Method)

#### ✅ Recommended: HTML File Upload
1. Download verification file from GSC (named like `googleXXXXXXXXXX.html`)
2. Place in `/public/` folder:
   ```
   /public/googleXXXXXXXXXX.html
   ```
3. Commit & push to GitHub
4. After Vercel deploy, verify at: `https://portfolio-fiky.vercel.app/googleXXXXXXXXXX.html`
5. Click "Verify" in GSC

#### Alternative: HTML Meta Tag
1. Edit `/public/index.html` line 11:
   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
   ```
2. Deploy to Vercel
3. Click "Verify" in GSC

#### Alternative: DNS Record (via Vercel)
1. Vercel Dashboard → Project → Settings → Domains
2. Select `portfolio-fiky.vercel.app`
3. Add TXT record with value from GSC
4. Click "Verify"

### 3. Submit Sitemap
1. In GSC dashboard → Left sidebar → "Sitemaps"
2. Enter: `/sitemap.xml`
3. Click "Submit"
4. Wait for status to show ✅ "Success"

### 4. Request Indexing (Do After Deployment)
1. GSC → Top bar → "URL Inspection"
2. Enter: `https://portfolio-fiky.vercel.app/`
3. Click "Request indexing"
4. Repeat for important pages:
   - `/about`
   - `/project`
   - `/skill`
   - `/contact`

### 5. Monitor Performance
- **Coverage Report** (Left sidebar): Check for indexing errors
- **Performance Report** (Left sidebar): Track impressions, clicks, CTR
- **URL Inspection Tool**: Debug specific page indexing status

---

## 🔧 Troubleshooting Common Issues

| Issue | Solution |
|-------|----------|
| **Verification fails** | Use HTML file upload method (most reliable) |
| **Sitemap not processing** | Validate XML at [xmlvalidation.com](https://www.xmlvalidation.com/) |
| **URL not indexed** | Use URL Inspection → Check "Coverage" details → Fix errors → Re-request |
| **No data in Performance Report** | Wait 24-48 hours after verification; ensure GA4/GSC properly linked |
| **404 errors in Coverage** | Create custom 404 page or fix broken links |

---

## 📊 Key Metrics to Monitor

1. **Impressions**: How often your site appears in search results
2. **Clicks**: How many times users click your listing
3. **CTR (Click-Through Rate)**: Clicks ÷ Impressions (Target: >3%)
4. **Average Position**: Your ranking in search results (Target: Top 10)
5. **Indexing Status**: Number of valid indexed pages vs. submitted

---

## ✅ Post-Implementation Checklist

- [ ] GSC property verified
- [ ] Sitemap submitted and processed (✅ Success)
- [ ] Homepage indexed (URL Inspection shows "URL is on Google")
- [ ] At least 5 main pages indexed
- [ ] No critical errors in Coverage report
- [ ] Performance report showing data after 48 hours

---

## 🔗 Useful Links

- [Google Search Console](https://search.google.com/search-console)
- [URL Inspection Tool Guide](https://support.google.com/webmasters/answer/9012289)
- [Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Coverage Report Help](https://support.google.com/webmasters/answer/7440203)

**Last Updated:** 2026-04-30
**Note:** Google typically takes 24-72 hours to process new verifications and indexing requests.