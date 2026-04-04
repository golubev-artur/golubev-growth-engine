import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getBlogPostBySlug, blogPosts } from "@/data/blog";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import arthurMain from "@/assets/arthur-main.jpg";
import ContactFormModal from "@/components/ContactFormModal";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(slug || "");
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!post) return <Navigate to="/blog" replace />;

  // Related posts: unique per post using slug-based offset
  const otherPosts = blogPosts.filter((p) => p.slug !== post.slug);
  const postIndex = blogPosts.findIndex((p) => p.slug === post.slug);
  const relatedPosts = Array.from({ length: 3 }, (_, i) =>
    otherPosts[(postIndex + i * 2) % otherPosts.length]
  ).filter((p, i, arr) => arr.findIndex((a) => a.slug === p.slug) === i);

  const renderContent = (content: string) => {
    return content.split("\n\n").map((block, i) => {
      if (block.startsWith("## ")) {
        return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-3">{block.slice(3)}</h2>;
      }
      if (block.startsWith("- ")) {
        const items = block.split("\n").filter(l => l.startsWith("- "));
        return (
          <ul key={i} className="space-y-1.5 my-3">
            {items.map((item, j) => (
              <li key={j} className="flex items-start gap-2 text-muted-foreground">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: item.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p
          key={i}
          className="text-muted-foreground leading-relaxed my-3"
          dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }}
        />
      );
    });
  };

  return (
    <Layout>
      <ContactFormModal open={formOpen} onClose={() => setFormOpen(false)} defaultDirection={post.category} />

      <section className="py-20 md:py-28 bg-primary">
        <div className="container mx-auto px-4 md:px-8">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-primary-foreground/50 hover:text-accent transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Все статьи
          </Link>
          <span className="inline-block text-xs font-medium bg-accent/15 text-accent px-2.5 py-1 rounded-md mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground tracking-tight leading-[1.12] text-wrap-balance max-w-3xl">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-primary-foreground/50 mt-4">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(post.date).toLocaleDateString("ru-RU")}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.readTime}</span>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <article className="container mx-auto px-4 md:px-8 max-w-3xl prose-container">
          {/* Blog post image */}
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-56 md:h-72 object-cover rounded-xl shadow-md mb-8"
          />

          {/* Author card */}
          <div className="flex items-center gap-4 mb-10 pb-8 border-b border-border">
            <img src={arthurMain} alt="Артур Голубев" className="w-14 h-14 rounded-full object-cover object-top shadow-md" />
            <div>
              <p className="font-semibold text-foreground text-sm">Артур Голубев</p>
              <p className="text-xs text-muted-foreground">Основатель Golubev Consulting</p>
            </div>
          </div>

          {renderContent(post.content)}

          {/* Contact Form CTA */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="bg-card border border-border rounded-xl p-6 md:p-8 text-center">
              <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-2">Контакты</p>
              <h3 className="text-2xl font-bold text-foreground mb-2">Обсудим ваш проект</h3>
              <p className="text-muted-foreground text-sm mb-5">
                Хотите обсудить эту тему применительно к вашему бизнесу? Оставьте заявку — мы свяжемся с вами в течение рабочего дня.
              </p>
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all"
                onClick={() => setFormOpen(true)}
              >
                Оставить заявку
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-foreground mb-6">Читайте также</h3>
              <div className="grid gap-4">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    to={`/blog/${related.slug}`}
                    className="group flex gap-4 p-4 rounded-xl border border-border bg-card hover:border-accent/30 hover:shadow-sm transition-all"
                  >
                    <img
                      src={related.image}
                      alt={related.title}
                      className="w-20 h-20 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-xs text-accent font-medium">{related.category}</span>
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 mt-0.5">
                        {related.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{related.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </section>
    </Layout>
  );
};

export default BlogPost;
