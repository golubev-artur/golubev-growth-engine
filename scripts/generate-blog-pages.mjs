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

  const dir = path.join(DIST, "blog", post.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

console.log(`Generated ${posts.length} blog post pages in dist/blog/`);
