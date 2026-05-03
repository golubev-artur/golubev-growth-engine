import { useEffect } from "react";

interface Breadcrumb {
  name: string;
  path: string;
}

interface Faq {
  question: string;
  answer: string;
}

interface ServiceData {
  title: string;
  description: string;
}

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  type?: string;
  image?: string;
  publishedTime?: string;
  breadcrumbs?: Breadcrumb[];
  faqs?: Faq[];
  service?: ServiceData;
}

const SITE = "https://golubev-consulting.ru";
const DEFAULT_TITLE = "Golubev Consulting — Системный консалтинг для бизнеса";
const DEFAULT_DESC =
  "Системный консалтинг: продажи, CRM, маркетинг, бизнес-процессы, управление, автоматизация. Комплексные решения для роста вашего бизнеса.";

const setMeta = (attr: string, key: string, content: string) => {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setJsonLd = (id: string, data: object) => {
  let el = document.querySelector(`script[data-ld="${id}"]`) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-ld", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

const removeJsonLd = (id: string) => {
  document.querySelector(`script[data-ld="${id}"]`)?.remove();
};

const resolveImage = (img?: string): string => {
  if (!img) return `${SITE}/og-image.png`;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return `${SITE}${img}`;
  return `${SITE}/og-image.png`;
};

const Seo = ({
  title,
  description,
  path = "/",
  type = "website",
  image,
  publishedTime,
  breadcrumbs,
  faqs,
  service,
}: SeoProps) => {
  const fullTitle = title ? `${title} — Golubev Consulting` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESC;
  const url = `${SITE}${path}`;
  const ogImage = resolveImage(image);

  useEffect(() => {
    document.title = fullTitle;

    setMeta("name", "description", desc);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    setMeta("property", "og:locale", "ru_RU");
    setMeta("property", "og:site_name", "Golubev Consulting");

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", ogImage);

    // Article-specific
    if (type === "article" && publishedTime) {
      setMeta("property", "article:published_time", publishedTime);
      setMeta("property", "article:modified_time", publishedTime);
      setMeta("property", "article:author", "Артур Голубев");
      setMeta("property", "article:section", "Бизнес-консалтинг");

      setJsonLd("article", {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title || DEFAULT_TITLE,
        description: desc,
        image: ogImage,
        url,
        datePublished: publishedTime,
        dateModified: publishedTime,
        author: {
          "@type": "Person",
          name: "Артур Голубев",
          url: SITE,
        },
        publisher: {
          "@type": "Organization",
          name: "Golubev Consulting",
          logo: {
            "@type": "ImageObject",
            url: `${SITE}/favicon-512.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
      });
    } else {
      removeJsonLd("article");
    }

    // BreadcrumbList
    if (breadcrumbs && breadcrumbs.length > 0) {
      setJsonLd("breadcrumb", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: SITE },
          ...breadcrumbs.map((crumb, i) => ({
            "@type": "ListItem",
            position: i + 2,
            name: crumb.name,
            item: `${SITE}${crumb.path}`,
          })),
        ],
      });
    } else {
      removeJsonLd("breadcrumb");
    }

    return () => {
      document.title = DEFAULT_TITLE;
      removeJsonLd("article");
      removeJsonLd("breadcrumb");
      removeJsonLd("service");
      removeJsonLd("faq");
    };
    // Service schema
    if (service) {
      setJsonLd("service", {
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        description: service.description,
        url,
        provider: {
          "@type": "Organization",
          name: "Golubev Consulting",
          url: SITE,
        },
      });
    } else {
      removeJsonLd("service");
    }

    // FAQPage schema
    if (faqs && faqs.length > 0) {
      setJsonLd("faq", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      });
    } else {
      removeJsonLd("faq");
    }

  }, [fullTitle, desc, url, type, ogImage, publishedTime, breadcrumbs, faqs, service]);

  return null;
};

export default Seo;
