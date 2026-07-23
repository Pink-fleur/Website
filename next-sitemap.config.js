/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://pinkfleur.org',
  generateRobotsTxt: false, // we have a manual robots.txt
  exclude: ['/api/*', '/studio/*'],
  generateIndexSitemap: false,
}
