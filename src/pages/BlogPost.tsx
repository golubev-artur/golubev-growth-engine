import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { getBlogPostBySlug } from "@/data/blog";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import arthurMain from "@/assets/arthur-main.jpg";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(slug || "");

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!post) return <Navigate to="/blog" replace />;

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
          {/* Author card */}
          <div className="flex items-center gap-4 mb-10 pb-8 border-b border-border">
            <img src={arthurMain} alt="Артур Голубев" className="w-14 h-14 rounded-full object-cover object-top shadow-md" />
            <div>
              <p className="font-semibold text-foreground text-sm">Артур Голубев</p>
              <p className="text-xs text-muted-foreground">Основатель Golubev Consulting</p>
            </div>
          </div>

          {renderContent(post.content)}

          <div className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground mb-4">Хотите обсудить эту тему применительно к вашему бизнесу?</p>
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
            >
              Оставить заявку на консультацию <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </article>
      </section>
    </Layout>
  );
};

export default BlogPost;
