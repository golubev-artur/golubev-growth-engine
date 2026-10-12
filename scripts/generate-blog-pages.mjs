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

// Title в выдаче обрезается примерно на 60-65 символах. Приписка бренда занимает 21,
// поэтому к длинным заголовкам её не добавляем - иначе обрежется сам заголовок.
function pageTitle(t) {
  return t.length <= 41 ? `${t} — Golubev Consulting` : t;
}

// Description обрезается примерно на 160 символах: режем по границе слова сами,
// чтобы в выдаче не было оборванного на середине слова текста.
function metaDescription(d) {
  if (d.length <= 160) return d;
  return d.slice(0, 157).replace(/[\s.,;:–-]+\S*$/, "") + "…";
}

// Каноническая форма адреса: со слешем на конце. Страницы лежат каталогами,
// и GitHub Pages отдаёт 200 именно на слешевом варианте, а безслешевый - 301 на него.
function canonical(route) {
  return route === "/" ? `${SITE}/` : `${SITE}${route}/`;
}

function addCanonical(html, url) {
  return html.replace("</head>", () => `  <link rel="canonical" href="${url}" />\n  </head>`);
}

function addJsonLd(html, data) {
  return html.replace(
    "</head>",
    () => `  <script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n    </script>\n  </head>`
  );
}

// Собирает страницу из dist/index.html: мета, canonical, микроразметка, статичное тело.
function buildPage({ route, title, description, bodyHtml, jsonLd, image }) {
  const fullTitle = pageTitle(title);
  const safeTitle = escapeHtml(fullTitle);
  const safeDesc = escapeHtml(metaDescription(description));
  const url = canonical(route);
  const ogImage = image || `${SITE}/og-image.png`;

  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${safeDesc}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${safeTitle}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${safeDesc}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${ogImage}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${safeTitle}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${safeDesc}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${ogImage}" />`);

  html = addCanonical(html, url);
  if (jsonLd) html = addJsonLd(html, jsonLd);
  if (bodyHtml) html = html.replace('<div id="root"></div>', () => `<div id="root">${bodyHtml}</div>`);
  return html;
}

function writePage(route, html) {
  const dir = path.join(DIST, route.replace(/^\//, ""));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

for (const post of posts) {
  const fullTitle = pageTitle(post.title);
  const url = canonical(`/blog/${post.slug}`);
  const safeTitle = escapeHtml(fullTitle);
  const safeDesc = escapeHtml(metaDescription(post.excerpt));

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
  const postGraph = {
    "@context": "https://schema.org",
    "@graph": [
      articleSchema,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: SITE },
          { "@type": "ListItem", position: 2, name: "Блог", item: canonical("/blog") },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
  html = html.replace(
    "</head>",
    () => `  <script type="application/ld+json">\n${JSON.stringify(postGraph, null, 2)}\n    </script>\n  </head>`
  );

  html = addCanonical(html, canonical(`/blog/${post.slug}`));

  const dir = path.join(DIST, "blog", post.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), html);
}

console.log(`Generated ${posts.length} blog post pages in dist/blog/`);


// ── Разбор услуг из services.ts ──
const servicesSrc = fs.readFileSync(path.join(ROOT, "src/data/services.ts"), "utf-8");
const services = [];
{
  const headRe = /\{\s*slug:\s*"([^"]+)",\s*icon:\s*\w+,\s*title:\s*"([^"]+)",\s*shortDesc:\s*"([^"]+)",\s*description:\s*"([^"]+)",/g;
  const heads = [...servicesSrc.matchAll(headRe)];
  heads.forEach((m, i) => {
    const chunk = servicesSrc.slice(m.index, i + 1 < heads.length ? heads[i + 1].index : servicesSrc.length);
    const from = chunk.indexOf("items: [");
    const to = chunk.indexOf("chartData:");
    const itemsBlock = from !== -1 && to > from ? chunk.slice(from, to) : "";
    const items = [...itemsBlock.matchAll(/name:\s*"([^"]+)",\s*desc:\s*"([^"]+)"/g)].map((x) => ({
      name: x[1],
      desc: x[2],
    }));
    const faqFrom = chunk.indexOf("faqs: [");
    const faqBlock = faqFrom === -1 ? "" : chunk.slice(faqFrom);
    const faqs = [...faqBlock.matchAll(/question:\s*"([^"]+)",\s*answer:\s*"([^"]+)"/g)].map((x) => ({
      question: x[1],
      answer: x[2],
    }));
    services.push({ slug: m[1], title: m[2], shortDesc: m[3], description: m[4], items, faqs });
  });
}
if (services.length === 0) throw new Error("не удалось разобрать services.ts");

// ── Разбор общего FAQ (только generalFaqs, без pressFaqs) ──
const faqSrc = fs.readFileSync(path.join(ROOT, "src/data/faq.ts"), "utf-8");
const generalFaqs = (() => {
  const start = faqSrc.indexOf("generalFaqs");
  const end = faqSrc.indexOf("pressFaqs");
  const block = faqSrc.slice(start, end === -1 ? faqSrc.length : end);
  return [...block.matchAll(/question:\s*"((?:[^"\\]|\\.)*)",\s*\n\s*answer:\s*"((?:[^"\\]|\\.)*)",/g)].map((m) => ({
    question: m[1],
    answer: m[2],
  }));
})();

const ORG = {
  "@type": "Organization",
  name: "Golubev Consulting",
  url: SITE,
};

const breadcrumbs = (crumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Главная", item: SITE },
    ...crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 2, name: c.name, item: canonical(c.path) })),
  ],
});

// ── Страницы услуг ──
for (const svc of services) {
  const route = `/services/${svc.slug}`;
  const itemsHtml = svc.items.length
    ? `<h2>Что входит в направление</h2>\n<ul>${svc.items
        .map((it) => `<li><strong>${escapeText(it.name)}</strong> - ${escapeText(it.desc)}</li>`)
        .join("")}</ul>`
    : "";
  const faqHtml = svc.faqs.length
    ? `<h2>Частые вопросы</h2>` +
      svc.faqs.map((f) => `<h3>${escapeText(f.question)}</h3><p>${escapeText(f.answer)}</p>`).join("")
    : "";
  const bodyHtml =
    `<article class="prose-container">` +
    `<h1>${escapeText(svc.title)}</h1>` +
    `<p>${escapeText(svc.description)}</p>` +
    itemsHtml +
    faqHtml +
    `<p>Обсудить задачу: <a href="/forma">записаться на бесплатную консультацию</a>. ` +
    `Другие направления - в разделе услуг (<a href="/services">/services</a>).</p>` +
    `</article>`;
  const html = buildPage({
    route,
    title: svc.title,
    description: svc.description,
    bodyHtml,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: svc.title,
          description: svc.description,
          url: canonical(route),
          provider: ORG,
          areaServed: "RU",
        },
        breadcrumbs([{ name: "Услуги", path: "/services" }, { name: svc.title, path: route }]),
        ...(svc.faqs.length
          ? [
              {
                "@type": "FAQPage",
                mainEntity: svc.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: { "@type": "Answer", text: f.answer },
                })),
              },
            ]
          : []),
      ],
    },
  });
  writePage(route, html);
}
console.log(`Generated ${services.length} service pages in dist/services/`);

// ── Прочие страницы ──
const servicesListHtml =
  `<article class="prose-container"><h1>Наши услуги</h1>` +
  `<p>Системный консалтинг для малого и среднего бизнеса: ${services.length} направлений.</p><ul>` +
  services
    .map(
      (s) =>
        `<li><a href="/services/${s.slug}">${escapeText(s.title)}</a> - ${escapeText(s.shortDesc)}</li>`
    )
    .join("") +
  `</ul></article>`;

const blogListHtml =
  `<article class="prose-container"><h1>Статьи и практические руководства</h1>` +
  `<p>Практические материалы о продажах, CRM, автоматизации, управлении и маркетинге. Всего статей: ${posts.length}.</p><ul>` +
  posts
    .map((p) => `<li><a href="/blog/${p.slug}">${escapeText(p.title)}</a> <span>${p.date}</span></li>`)
    .join("") +
  `</ul></article>`;

const faqBodyHtml =
  `<article class="prose-container"><h1>Часто задаваемые вопросы</h1>` +
  generalFaqs.map((f) => `<h2>${escapeText(f.question)}</h2><p>${escapeText(f.answer)}</p>`).join("") +
  `</article>`;

const simple = (h1, text) => `<article class="prose-container"><h1>${escapeText(h1)}</h1><p>${escapeText(text)}</p></article>`;

const otherPages = [
  {
    route: "/services",
    title: `Услуги - ${services.length} направлений консалтинга для бизнеса`,
    description:
      "Продажи и CRM, маркетинг, бизнес-процессы, управление, HR, автоматизация, клиентский сервис, стратегические сессии, финансы и юридические услуги.",
    bodyHtml: servicesListHtml,
    jsonLd: breadcrumbs([{ name: "Услуги", path: "/services" }]),
  },
  {
    route: "/blog",
    title: "Блог - статьи и руководства по развитию бизнеса",
    description:
      "Практические статьи о продажах, CRM, автоматизации, управлении и маркетинге. Опыт и инструменты из реальных проектов Golubev Consulting.",
    bodyHtml: blogListHtml,
    jsonLd: breadcrumbs([{ name: "Блог", path: "/blog" }]),
  },
  {
    route: "/faq",
    title: "FAQ - Голубев Консалтинг",
    description:
      "Ответы на частые вопросы о консалтинге, стоимости, процессе работы и результатах. Голубев Консалтинг.",
    bodyHtml: faqBodyHtml,
    jsonLd: generalFaqs.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: generalFaqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null,
  },
  {
    route: "/press",
    title: "Для СМИ - Голубев Консалтинг",
    description:
      "Пресс-материалы, публикации, экспертные комментарии и контакты пресс-службы Голубев Консалтинг. Скачать логотип, фото и описание компании для СМИ.",
    bodyHtml:
      `<article class="prose-container"><h1>Пресс-центр</h1>` +
      `<p>Артур Голубев - основатель компании «Голубев Консалтинг», консультант с 12-летним опытом. ` +
      `Комментирует темы системного управления, построения отделов продаж, автоматизации и ` +
      `бизнес-процессов в малом и среднем бизнесе.</p>` +
      `<h2>Что можно получить</h2><ul>` +
      `<li>Экспертный комментарий для публикации</li>` +
      `<li>Логотип компании и фотографии в высоком разрешении</li>` +
      `<li>Описание компании и факты для справки</li>` +
      `<li>Данные и наблюдения из практики: 150+ проектов, 87 компаний-клиентов</li>` +
      `</ul>` +
      `<h2>Контакты пресс-службы</h2>` +
      `<p>Почта: press@golubev-consulting.ru. Телефон: +7 (926) 169-21-14. ` +
      `Отвечаем в течение рабочего дня.</p>` +
      `<p>Экспертные материалы компании публикуются в блоге (/blog).</p></article>`,
  },
  {
    route: "/forma",
    title: "Запись на бесплатную онлайн-встречу",
    description:
      "Запишитесь на бесплатную 45-минутную онлайн-консультацию с экспертом Голубев Консалтинг. Разберём вашу ситуацию и дадим конкретные рекомендации.",
    bodyHtml:
      `<article class="prose-container"><h1>Бесплатная консультация для вашего бизнеса</h1>` +
      `<p>45 минут онлайн с экспертом «Голубев Консалтинг». Разбираем вашу ситуацию и показываем, ` +
      `где бизнес теряет деньги. Без обязательств и без продаж на встрече.</p>` +
      `<h2>Что получите на встрече</h2><ul>` +
      `<li>Разбор текущей ситуации по фактам и цифрам</li>` +
      `<li>Точки, где теряются клиенты, время или маржа</li>` +
      `<li>Конкретные рекомендации, что делать в первую очередь</li>` +
      `<li>Честный ответ, нужен ли вам консалтинг вообще</li>` +
      `</ul>` +
      `<h2>Как проходит</h2>` +
      `<p>Вы оставляете заявку, мы связываемся и подбираем удобное время. Встреча проходит онлайн ` +
      `и занимает 45 минут. По итогам вы получаете рекомендации, независимо от того, станете вы ` +
      `клиентом или нет.</p>` +
      `<p>Направления работы описаны в разделе услуг (/services). ` +
      `Телефон для связи: +7 (926) 169-21-14.</p></article>`,
  },
  {
    route: "/presentation",
    title: "Скачать презентацию - Голубев Консалтинг",
    description:
      "Получите полную презентацию Голубев Консалтинг: подход, услуги, кейсы и результаты. Бесплатно после заполнения формы.",
    bodyHtml:
      `<article class="prose-container"><h1>Презентация компании</h1>` +
      `<p>Полная презентация «Голубев Консалтинг» в одном файле: подход к работе, семь направлений ` +
      `услуг, примеры проектов и результаты в цифрах.</p>` +
      `<h2>Что внутри</h2><ul>` +
      `<li>Как мы работаем: от диагностики до внедрения</li>` +
      `<li>Семь направлений и состав услуг по каждому</li>` +
      `<li>Примеры проектов с измеримыми результатами</li>` +
      `<li>Форматы сотрудничества и этапы работы</li>` +
      `</ul>` +
      `<p>Презентация доступна бесплатно после заполнения короткой формы. ` +
      `Если удобнее обсудить задачу голосом, записывайтесь на консультацию (/forma) ` +
      `или звоните: +7 (926) 169-21-14.</p></article>`,
  },
  {
    route: "/privacy",
    title: "Политика обработки персональных данных",
    description:
      "Политика обработки персональных данных на сайте golubev-consulting.ru. Информация о сборе, хранении и использовании данных.",
    bodyHtml:
      `<article class="prose-container"><h1>Политика обработки персональных данных</h1>` +
      `<p>Политика описывает, какие персональные данные собираются на сайте golubev-consulting.ru, ` +
      `с какой целью и как они хранятся.</p>` +
      `<h2>Какие данные собираются</h2>` +
      `<p>Через формы на сайте: имя, телефон, адрес электронной почты, название компании ` +
      `и текст сообщения. Эти данные вы указываете добровольно.</p>` +
      `<h2>Зачем они нужны</h2>` +
      `<p>Только чтобы связаться с вами по вашей заявке, согласовать время консультации ` +
      `и отправить запрошенные материалы. Данные не передаются третьим лицам и не используются ` +
      `для рассылок без вашего согласия.</p>` +
      `<h2>Как отозвать согласие</h2>` +
      `<p>Напишите на info@golubev-consulting.ru - мы удалим ваши данные. ` +
      `Сайт использует cookies для работы аналитики.</p></article>`,
  },
];

for (const page of otherPages) {
  writePage(page.route, buildPage(page));
}
console.log(`Generated ${otherPages.length} static pages (services, blog, faq, press, forma, presentation, privacy)`);


// ── Главная ──
// Раньше она была единственной страницей без пререндера: робот видел пустой #root,
// ни H1, ни canonical, ни текста. Для самой важной страницы сайта это недопустимо.
{
  const latest = posts.slice(0, 6);
  const bodyHtml =
    `<article class="prose-container">` +
    `<h1>Системный консалтинг для роста вашего бизнеса</h1>` +
    `<p>Продажи · Маркетинг · Бизнес-процессы · Управление · Автоматизация · Персонал · Клиентский сервис</p>` +
    `<h2>Выстраиваем системы, которые работают без вас</h2>` +
    `<p>ГОЛУБЕВ КОНСАЛТИНГ - это команда практиков, которая помогает собственникам бизнеса навести порядок ` +
    `в продажах, процессах, маркетинге и управлении. Мы не просто консультируем - мы внедряем решения ` +
    `и доводим их до результата. Работаем с малым и средним бизнесом в России и СНГ.</p>` +
    `<ul>` +
    `<li><strong>12+</strong> лет в консалтинге</li>` +
    `<li><strong>150+</strong> проектов доведено до внедрения</li>` +
    `<li><strong>87</strong> компаний-клиентов</li>` +
    `<li><strong>7</strong> направлений в одной команде</li>` +
    `</ul>` +
    `<h2>Направления работы</h2><ul>` +
    services.map((s) => `<li><a href="/services/${s.slug}">${escapeText(s.title)}</a> - ${escapeText(s.shortDesc)}</li>`).join("") +
    `</ul>` +
    `<h2>Из блога</h2><ul>` +
    latest.map((p) => `<li><a href="/blog/${p.slug}">${escapeText(p.title)}</a></li>`).join("") +
    `</ul><p><a href="/blog">Все статьи блога</a></p>` +
    `<h2>Контакты</h2>` +
    `<p>Телефон: +7 (926) 169-21-14. Почта: info@golubev-consulting.ru. ` +
    `Адрес: г. Москва, м. Красные ворота, Мясницкая ул., 46 стр. 1.</p>` +
    `<p><a href="/forma">Записаться на бесплатную 45-минутную консультацию</a></p>` +
    `</article>`;

  let html = template.replace('<div id="root"></div>', () => `<div id="root">${bodyHtml}</div>`);
  html = addCanonical(html, canonical("/"));
  html = addJsonLd(html, {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Голубев Консалтинг",
    url: SITE,
    inLanguage: "ru-RU",
    publisher: ORG,
  });
  fs.writeFileSync(path.join(DIST, "index.html"), html);
  console.log("Generated homepage with prerendered content");
}

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

// Список услуг берём из services.ts: раньше он был зашит здесь руками
// и в нём не хватало finance и legal - их страницы в sitemap не попадали.
const servicePages = services.map((s) => s.slug);

function sitemapEntry(loc, lastmod, changefreq, priority) {
  return `  <url><loc>${canonical(loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
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
