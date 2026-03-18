import Link from "next/link";
import { ARTICLES } from "../page";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return <div className="page"><div className="container"><h1>Article not found</h1></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <Link href="/learn" style={{ color: "var(--primary)", fontSize: "0.9rem" }}>← Back to Learn</Link>
        </div>
        <div className="page-header">
          <div style={{ fontSize: "3rem", marginBottom: 8 }}>{article.icon}</div>
          <h1>{article.title}</h1>
        </div>
        <div className="article">
          {article.content.map((block, i) => {
            if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
            if (block.type === "h3") return <h3 key={i}>{block.text}</h3>;
            return <p key={i}>{block.text}</p>;
          })}
        </div>
        <div style={{ marginTop: 32 }}>
          <Link href="/learn" className="btn btn-secondary">← More Articles</Link>
        </div>
      </div>
    </div>
  );
}
