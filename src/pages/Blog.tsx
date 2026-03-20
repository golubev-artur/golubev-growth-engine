import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { blogPosts } from "@/data/blog";
import { ArrowRight, Calendar, Clock } from "lucide-react";

const BlogPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Layout>
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
            {blogPosts.map((post, i) => (
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
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
