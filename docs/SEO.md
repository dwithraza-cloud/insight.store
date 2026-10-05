# Insight Store SEO

Build with `npm ci && npm run build`. Validate with `npm run lint && npm run seo:check`.

The build renders 249 public HTML pages: homepage, shop, about, contact, blog, shopping help, 21 categories, 213 products and nine articles. Each includes one H1, a unique title, description, canonical URL, social metadata and JSON-LD. Product schema uses catalog prices in PKR and availability; it does not invent customer reviews, business addresses or shipping policies. Product images are generated as standalone WebP files from the existing sprite sheets. Navigation uses real links with browser history support.

## Search intent

| Pages | Content focus |
| --- | --- |
| Home/shop | Online shopping in Pakistan, Insight Store, catalog categories |
| Bedsheets | Cotton bedsheets, single and king-size sets, material and included pieces |
| Clothing | Ladies and gents clothing, lawn suits, stitched/unstitched details |
| Digital products | Subscription name, plan duration, activation and renewal requirements |
| Other categories | Actual category name, PKR prices, product specifications |
| Buying guides | Practical bedding, lawn suit and digital subscription purchase questions |

These topics reflect catalog content, not measured search volume. Revisit using Search Console queries after indexing.

## Deployment

For Apache/LiteSpeed hosting, upload **all** files inside `dist/`, including `.htaccess`, generated nested directories and images, to the domain's document root. Replace any existing catch-all SPA rewrite with the supplied `.htaccess`; unknown URLs must return HTTP 404 rather than the homepage. Preserve existing mail/domain configuration. For Node hosting, use `npm start` after the build; the production server honors `PORT` and serves static pages with real 404 responses.

The production origin is `https://insightstore.designerinsight.online`. Update `SITE_URL` in `src/seo/catalog.ts` and rebuild if the domain changes. Keep the site's HTTPS and preferred hostname redirects configured at the host.

## Search Console and follow-up

The supplied Google verification meta tag is retained in generated HTML. After deployment, verify ownership in Search Console and submit `https://insightstore.designerinsight.online/sitemap.xml`. Inspect the homepage and representative category/product URLs, then monitor indexing, impressions and clicks. Sitemap generation is automatic on every build; private cart/account/checkout/wishlist/compare pages use `noindex` and are excluded.

The owner should confirm business address, return/delivery policies, existing trust claims and customer testimonials before adding richer business/review schema. Checkout and delivery data include existing demo behavior; SEO changes do not connect payment processing or order fulfilment. Ranking and rich result eligibility are determined by search engines; this implementation does not guarantee them.
