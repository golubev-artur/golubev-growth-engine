import { useEffect } from "react";

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  type?: string;
  image?: string;
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

const Seo = ({ title, description, path = "/", type = "website", image }: SeoProps) => {
  const fullTitle = title ? `${title} — Golubev Consulting` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESC;
  const url = `${SITE}${path}`;
  const ogImage = image || `${SITE}/favicon-512.png`;

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

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:type", type);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", ogImage);

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", desc);
    setMeta("name", "twitter:image", ogImage);

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [fullTitle, desc, url, type, ogImage]);

  return null;
};

export default Seo;
