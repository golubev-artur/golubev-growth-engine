import type { BlogPost } from "@/data/blog";

// Детерминированный хэш от slug: замена дубля не должна прыгать между рендерами.
const hash = (s: string) => {
  let h = 7;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

/**
 * Возвращает посты страницы так, чтобы картинки на ней не повторялись.
 * Пост с уже занятой картинкой получает свободную из общего пула блога.
 * Данные постов не меняются - подмена только для карточек списка.
 */
export const withUniqueImages = (pagePosts: BlogPost[], allPosts: BlogPost[]): BlogPost[] => {
  const pool = [...new Set(allPosts.map((p) => p.image))];
  const used = new Set<string>();

  return pagePosts.map((post) => {
    if (!used.has(post.image)) {
      used.add(post.image);
      return post;
    }
    const start = hash(post.slug) % pool.length;
    for (let k = 0; k < pool.length; k++) {
      const candidate = pool[(start + k) % pool.length];
      if (!used.has(candidate)) {
        used.add(candidate);
        return { ...post, image: candidate };
      }
    }
    return post; // картинок в пуле меньше, чем постов на странице
  });
};
