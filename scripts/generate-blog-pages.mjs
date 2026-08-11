import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const SITE = "https://golubev-consulting.ru";

const blogSrc = fs.readFileSync(path.join(ROOT, "src/data/blog.ts"), "utf-8");

const imageVars = {};
for (const m of blogSrc.matchAll(/const\s+(\w+)\s*=\s*"([^"]+)"/g)) {
  imageVars[m[1]] = m[2];
}

const posts = [];
const postRegex =
  /\{\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*excerpt:\s*"([^"]+)",\s*date:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*readTime:\s*"([^"]+)",\s*image:\s*(\w+),/g;

let match;
while ((match = postRegex.exec(blogSrc)) !== null) {
  const imageVar = match[7];
  const imagePath = imageVars[imageVar] || "/og-image.png";
  posts.push({
    slug: match[1],
    title: match[2],
    excerpt: match[3],
    date: match[4],
    category: match[5],
    readTime: match[6],
    image: `${SITE}${imagePath}`,
  });
}

console.log(`Found ${posts.length} blog posts`);

const template = fs.readFileSync(path.join(DIST, "index.html"), "utf-8");

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeText(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Inline markdown -> HTML (mirrors fmt() in src/pages/BlogPost.tsx)
function fmtInline(text) {
  return escapeText(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\(\/(blog|services)(\/[a-z0-9-]+)\)/g, '(<a href="/$1$2">/$1$2</a>)');
}

// Block markdown -> HTML (mirrors renderContent() in src/pages/BlogPost.tsx)
function renderContentToHtml(content) {
  return content
    .split("\n\n")
    .map((block) => {
      const b = block.trim();
      if (!b) return "";
      if (b.startsWith("## ")) return `<h2>${escapeText(b.slice(3))}</h2>`;
      if (b.startsWith("- ")) {
        const items = b.split("\n").filter((l) => l.startsWith("- "));
        return `<ul>${items.map((it) => `<li>${fmtInline(it.slice(2))}</li>`).join("")}</ul>`;
      }
      return `<p>${fmtInline(b)}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

// Extract a post's markdown body (content field) from blog.ts by slug
function extractContent(slug) {
  const idx = blogSrc.indexOf(`slug: "${slug}"`);
  if (idx === -1) return null;
  const m = blogSrc.slice(idx).match(/content:\s*`([\s\S]*?)`\s*,?\s*\n\s*\}/);
  return m ? m[1] : null;
}

for (const post of posts) {
  const fullTitle = `${post.title} — Golubev Consulting`;
  const url = `${SITE}/blog/${post.slug}`;
  const safeTitle = escapeHtml(fullTitle);
  const safeDesc = escapeHtml(post.excerpt);

  let html = template;

  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${safeTitle}</title>`
  );

  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${safeDesc}" />`
  );

  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta property="og:type" content="[^"]*"\s*\/?>/,
    `<meta property="og:type" content="article" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${url}" />`
  );
  html = html.replace(
    /<meta property="og:image" content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${post.image}" />`
  );

  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta name="twitter:image" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:image" content="${post.image}" />`
  );

  const articleMeta = [
    `<meta property="article:published_time" content="${post.date}" />`,
    `<meta property="article:author" content="Артур Голубев" />`,
    `<meta property="article:section" content="Бизнес-консалтинг" />`,
    `<meta property="og:locale" content="ru_RU" />`,
    `<meta property="og:site_name" content="Golubev Consulting" />`,
  ].join("\n    ");
  html = html.replace(
    /<meta property="og:image:height" content="630"\s*\/?>/,
    `<meta property="og:image:height" content="630" />\n    ${articleMeta}`
  );

  // ── Prerender article body into #root (SEO: Yandex/Google see full text without JS) ──
  const content = extractContent(post.slug);
  if (content) {
    const bodyHtml = `<article class="prose-container"><h1>${escapeText(post.title)}</h1>\n${renderContentToHtml(content)}</article>`;
    html = html.replace('<div id="root"></div>', () => `<div id="root">${bodyHtml}</div>`);
  } else {
    console.warn(`  ! No content extracted for ${post.slug} — body not prerendered`);
  }

  // ── BlogPosting structured data ──
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: "Артур Голубев", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "Golubev Consulting",
      logo: { "@type": "ImageObject", url: `${SITE}/og-image.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: post.category,
    inLanguage: "ru-RU",
  };
  html = html.replace(
    "</head>",
    () => `  <script type="application/ld+json">\n${JSON.stringify(articleSchema, null, 2)}\n    </script>\n  </head>`
  );

  const dir = path.join(DIST, "blog", post.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

console.log(`Generated ${posts.length} blog post pages in dist/blog/`);

// ── Sitemap generation ──
const today = new Date().toISOString().slice(0, 10);
const latestPostDate = posts.length > 0 ? posts[0].date : today;

const staticPages = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/services", changefreq: "monthly", priority: "0.9" },
  { loc: "/blog", changefreq: "weekly", priority: "0.9", lastmod: latestPostDate },
  { loc: "/privacy", changefreq: "yearly", priority: "0.3" },
  { loc: "/forma", changefreq: "monthly", priority: "0.8" },
  { loc: "/faq", changefreq: "monthly", priority: "0.6" },
  { loc: "/press", changefreq: "monthly", priority: "0.5" },
  { loc: "/presentation", changefreq: "monthly", priority: "0.5" },
];

const servicePages = [
  "sales-crm", "business-processes", "marketing", "management-strategy",
  "hr-team", "tech-automation", "client-service", "strategic-session",
];

function sitemapEntry(loc, lastmod, changefreq, priority) {
  return `  <url><loc>${SITE}${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
];

for (const p of staticPages) {
  lines.push(sitemapEntry(p.loc, p.lastmod || today, p.changefreq, p.priority));
}

for (const slug of servicePages) {
  lines.push(sitemapEntry(`/services/${slug}`, today, "monthly", "0.8"));
}

lines.push("");

for (const post of posts) {
  lines.push(sitemapEntry(`/blog/${post.slug}`, post.date, "monthly", "0.7"));
}

lines.push("</urlset>");

fs.writeFileSync(path.join(DIST, "sitemap.xml"), lines.join("\n"));
console.log(`Generated sitemap.xml with ${staticPages.length + servicePages.length + posts.length} URLs`);
