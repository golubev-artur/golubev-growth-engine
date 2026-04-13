import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import { blogPosts } from "@/data/blog";
import { ArrowRight, ArrowLeft, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const POSTS_PER_PAGE = 6;

const BlogPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const totalPages = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * POSTS_PER_PAGE;
  const pagePosts = blogPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);

  useEffect(() => {
    window.scrollTo(0, 0);
    setVisible(false);
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [safePage]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setSearchParams({ page: String(page) });
  };

  return (
    <Layout>
      <Seo
        title="Блог — статьи и руководства по развитию бизнеса"
        description="Практические статьи о продажах, CRM, автоматизации, управлении и маркетинге. Опыт и инструменты из реальных проектов Golubev Consulting."
        path="/blog"
      />
      <section className="py-20 md:py-28 bg-primary">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Блог</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground tracking-tight leading-[1.08] text-wrap-balance">
            Статьи и практические руководства
          </h1>
          <p className="text-primary-foreground/60 text-lg mt-4 max-w-2xl">
            Делимся опытом, инструментами и подходами из реальных проектов
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8" ref={ref}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagePosts.map((post, i) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group block border border-border rounded-lg overflow-hidden bg-card shadow-sm hover:shadow-lg transition-all active:scale-[0.98]"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(14px)",
                  transition: `opacity 500ms ${80 + i * 70}ms cubic-bezier(0.16,1,0.3,1), transform 500ms ${80 + i * 70}ms cubic-bezier(0.16,1,0.3,1)`,
                }}
              >
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block text-xs font-medium bg-accent/10 text-accent px-2.5 py-1 rounded-md mb-3">
                    {post.category}
                  </span>
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(post.date).toLocaleDateString("ru-RU")}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage <= 1}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Предыдущая страница"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg border text-sm font-medium transition-all ${
                    page === safePage
                      ? "bg-accent text-accent-foreground border-accent"
                      : "border-border bg-card text-foreground hover:bg-accent/10 hover:border-accent/30"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage >= totalPages}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Следующая страница"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
