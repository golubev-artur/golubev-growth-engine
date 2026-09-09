import { describe, it, expect } from "vitest";
import { blogPosts } from "@/data/blog";
import { withUniqueImages } from "@/lib/uniquePageImages";

const POSTS_PER_PAGE = 6;

const page = (n: number) =>
  withUniqueImages(blogPosts.slice((n - 1) * POSTS_PER_PAGE, n * POSTS_PER_PAGE), blogPosts);

describe("картинки в списке блога", () => {
  it("в пуле хватает картинок на целую страницу", () => {
    const pool = new Set(blogPosts.map((p) => p.image));
    expect(pool.size).toBeGreaterThanOrEqual(POSTS_PER_PAGE);
  });

  it("на первой странице все картинки разные", () => {
    const images = page(1).map((p) => p.image);
    expect(new Set(images).size).toBe(images.length);
  });

  it("на каждой странице все картинки разные", () => {
    const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
    for (let n = 1; n <= totalPages; n++) {
      const images = page(n).map((p) => p.image);
      expect(new Set(images).size, `страница ${n}`).toBe(images.length);
    }
  });

  it("подмена стабильна: одинаковый вход - одинаковый выход", () => {
    expect(page(1).map((p) => p.image)).toEqual(page(1).map((p) => p.image));
  });

  it("порядок и состав постов не меняются", () => {
    const slugs = page(1).map((p) => p.slug);
    expect(slugs).toEqual(blogPosts.slice(0, POSTS_PER_PAGE).map((p) => p.slug));
  });
});
