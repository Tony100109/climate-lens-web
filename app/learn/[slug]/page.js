"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ARTICLES, ICON_MAP } from "../page";

export default function ArticlePage() {
  const { slug } = useParams();
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return <div className="page"><div className="container"><h1>Article not found</h1></div></div>;

  const Icon = ICON_MAP[article.icon];

  return (
    <div className="page">
      <div className="container">
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <Link href="/learn" style={{ color: "var(--primary)", fontSize: "0.9rem" }}>&larr; Back to Learn</Link>
        </div>
        <div className="page-header">
          <div style={{ fontSize: "3rem", marginBottom: 8 }}>{Icon ? <Icon size={48} /> : null}</div>
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
          <Link href="/learn" className="btn btn-secondary">&larr; More Articles</Link>
        </div>
      </div>
    </div>
  );
}
