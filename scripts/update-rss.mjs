// Перегенерация public/rss.xml из src/data/blog.ts.
// Нужна, когда пост публикуется не через ~/scripts/publish-blog-post.sh:
// сборка rss.xml не трогает, лента без этого шага остаётся вчерашней.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SITE = "https://golubev-consulting.ru";
const ITEMS = 20;

const blogSrc = fs.readFileSync(path.join(ROOT, "src/data/blog.ts"), "utf-8");

const imageVars = {};
for (const m of blogSrc.matchAll(/const\s+(\w+)\s*=\s*"([^"]+)"/g)) imageVars[m[1]] = m[2];

const postRegex =
  /\{\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*excerpt:\s*"([^"]+)",\s*date:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*readTime:\s*"([^"]+)",\s*image:\s*(\w+),/g;

const posts = [];
for (const m of blogSrc.matchAll(postRegex)) {
  posts.push({
    slug: m[1], title: m[2], excerpt: m[3], date: m[4], category: m[5],
    image: imageVars[m[7]] || "/og-image.png",
  });
}
if (!posts.length) throw new Error("не удалось разобрать посты из blog.ts");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rfc822 = (d) => new Date(d).toUTCString().replace("GMT", "GMT");

const items = posts.slice(0, ITEMS).map((p) => `  <item>
    <title>${esc(p.title)}</title>
    <link>${SITE}/blog/${p.slug}</link>
    <guid isPermaLink="true">${SITE}/blog/${p.slug}</guid>
    <description>${esc(p.excerpt)}</description>
    <pubDate>${rfc822(p.date + "T00:00:00Z")}</pubDate>
    <category>${esc(p.category)}</category>
    <enclosure url="${SITE}${p.image}" type="image/jpeg" length="0"/>
  </item>`).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Голубев Консалтинг — Блог</title>
    <link>${SITE}/blog</link>
    <description>Системный консалтинг для малого и среднего бизнеса: продажи, CRM, маркетинг, управление, автоматизация.</description>
    <language>ru</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE}/og-image.png</url>
      <title>Голубев Консалтинг</title>
      <link>${SITE}</link>
    </image>
${items}
  </channel>
</rss>`;

fs.writeFileSync(path.join(ROOT, "public/rss.xml"), xml);
console.log(`rss.xml обновлён: ${Math.min(posts.length, ITEMS)} записей, верхняя - ${posts[0].slug}`);
