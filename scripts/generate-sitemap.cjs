#!/usr/bin/env node

/**
 * Sitemap Generator Script
 *
 * This script automatically generates a sitemap.xml file based on the routes
 * defined in the router configuration. It runs after every `npm run build`.
 *
 * Usage: node scripts/generate-sitemap.cjs
 *
 * The generated sitemap will be saved to public/sitemap.xml
 */

const fs = require('fs')
const path = require('path')

// ============================================================================
// CONFIGURATION
// ============================================================================

const config = {
  // Base URL of your deployed site
  baseUrl: 'https://portfolio-fiky.vercel.app',

  // Router configuration file path (relative to project root)
  routerPath: './src/routers/router.jsx',

  // Output sitemap path (relative to project root)
  outputPath: './public/sitemap.xml',

  // Default values for new routes (can be overridden per route)
  defaultChangefreq: 'monthly',
  defaultPriority: 0.8,

  // Route-specific configuration (override defaults)
  routeOverrides: {
    '/': {
      changefreq: 'weekly',
      priority: 1.0
    },
    '/about': {
      changefreq: 'monthly',
      priority: 0.8
    },
    '/skill': {
      changefreq: 'monthly',
      priority: 0.8
    },
    '/project': {
      changefreq: 'monthly',
      priority: 0.8
    },
    '/contact': {
      changefreq: 'monthly',
      priority: 0.8
    }
  }
}

// ============================================================================
// ROUTE PARSER
// ============================================================================

/**
 * Extract routes from router.jsx file
 * Reads the router configuration and extracts all top-level paths
 */
function extractRoutesFromRouter(routerFilePath) {
  const routerFile = fs.readFileSync(path.resolve(routerFilePath), 'utf8')

  // Simple regex to find path patterns in route definitions
  // Matches: path: "/about" or path: "/contact"
  const pathRegex = /path:\s*['"]([^'"]+)['"]/g

  const routes = []
  let match

  while ((match = pathRegex.exec(routerFile)) !== null) {
    const routePath = match[1]

    // Skip routes with parameters (e.g., "/project/:id")
    // Skip empty routes that are handled by parent
    if (!routePath.includes(':') && routePath !== '') {
      routes.push(routePath)
    }
  }

  // Remove duplicates while preserving order
  const uniqueRoutes = [...new Set(routes)]

  if (uniqueRoutes.length === 0) {
    console.warn('⚠️  No routes found in router file. Using fallback routes.')
    return ['/', '/about', '/skill', '/project', '/contact']
  }

  console.log(`✅ Found ${uniqueRoutes.length} routes:`, uniqueRoutes.join(', '))
  return uniqueRoutes
}

// ============================================================================
// SITEMAP GENERATOR
// ============================================================================

/**
 * Generate sitemap XML from routes
 */
function generateSitemap(routes, config) {
  const currentDate = new Date().toISOString().split('T')[0]

  const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>
<!-- ✅ Sitemap successfully generated on ${currentDate} -->
<!-- 📍 Generated from: ${config.routerPath} -->
<!-- 🔗 Total URLs: ${routes.length} -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  const sitemapFooter = `</urlset>
`

  const urlEntries = routes.map(routePath => {
    // Get route-specific config or use defaults
    const routeConfig = config.routeOverrides[routePath] || {}

    const changefreq = routeConfig.changefreq || config.defaultChangefreq
    const priority = routeConfig.priority || config.defaultPriority

    return `  <url>
    <loc>${config.baseUrl}${routePath}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  }).join('\n')

  return sitemapHeader + urlEntries + '\n' + sitemapFooter
}

/**
 * Write sitemap to file
 */
function writeSitemap(content, outputPath) {
  const absoluteOutputPath = path.resolve(outputPath)
  const outputDir = path.dirname(absoluteOutputPath)

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    console.log(`📁 Created directory: ${outputDir}`)
  }

  fs.writeFileSync(absoluteOutputPath, content, 'utf8')
  console.log(`✅ Sitemap written to: ${absoluteOutputPath}`)
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  console.log('🚀 Starting sitemap generation...\n')

  // Step 1: Extract routes from router
  console.log(`📖 Reading router configuration: ${config.routerPath}`)
  const routes = extractRoutesFromRouter(config.routerPath)

  // Step 2: Generate sitemap XML
  console.log('\n🔨 Generating sitemap XML...')
  const sitemap = generateSitemap(routes, config)

  // Step 3: Write to file
  console.log(`\n📝 Writing sitemap to: ${config.outputPath}`)
  writeSitemap(sitemap, config.outputPath)

  // Step 4: Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 SITEMAP SUMMARY')
  console.log('='.repeat(60))
  console.log(`Base URL:     ${config.baseUrl}`)
  console.log(`Total URLs:   ${routes.length}`)
  console.log(`Routes:       ${routes.join(', ')}`)
  console.log(`Output:       ${path.resolve(config.outputPath)}`)
  console.log('='.repeat(60))
  console.log('\n✅ Sitemap generation complete!')
  console.log('📌 Next: Commit & push to deploy to Vercel')
  console.log('🔍 Validate XML at: https://www.xmlvalidation.com/\n')
}

// Run the script
main()
