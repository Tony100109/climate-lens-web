"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, MapPin, GitCompare, Users, FileText, Heart,
  TreePine, BookOpen, GraduationCap, Megaphone, Shield,
  Database, Zap, ArrowRight, CheckCircle2
} from "lucide-react";

export default function Home() {
  const [zip, setZip] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const cleaned = zip.trim();
    if (/^\d{5}$/.test(cleaned)) {
      router.push(`/lookup?zip=${cleaned}`);
    }
  };

  const features = [
    {
      icon: <MapPin size={22} />,
      color: "#166534",
      bg: "#dcfce7",
      title: "Climate Lookup",
      desc: "Real-time AQI, temperature, risk scores, 10-year trends, EJScreen data, and historical redlining for any US ZIP code.",
      tag: "Research",
      href: "/lookup",
    },
    {
      icon: <GitCompare size={22} />,
      color: "#2563eb",
      bg: "#dbeafe",
      title: "Compare Areas",
      desc: "Side-by-side environmental comparison of two ZIP codes with differential analysis and pre-loaded disparity examples.",
      tag: "Advocacy",
      href: "/compare",
    },
    {
      icon: <Users size={22} />,
      color: "#0d9488",
      bg: "#ccfbf1",
      title: "Community Evidence Board",
      desc: "Citizen-submitted observations paired with real-time EPA/NOAA data. Includes upvoting and exportable advocacy packets.",
      tag: "Organizing",
      href: "/community",
    },
    {
      icon: <FileText size={22} />,
      color: "#7c3aed",
      bg: "#ede9fe",
      title: "Impact Report",
      desc: "Generate downloadable PDFs comparing green space metrics against nearby areas with executive summaries for funders.",
      tag: "Grants",
      href: "/impact",
    },
    {
      icon: <Heart size={22} />,
      color: "#dc2626",
      bg: "#fef2f2",
      title: "Health Cost Calculator",
      desc: "Estimate annual health costs from air quality and heat exposure per 1,000 residents using EPA and CDC methodology.",
      tag: "Policy",
      href: "/health-cost",
    },
    {
      icon: <TreePine size={22} />,
      color: "#16a34a",
      bg: "#dcfce7",
      title: "Tree ROI Calculator",
      desc: "Calculate CO2 absorption, costs, and payback periods for tree initiatives with grant-ready language.",
      tag: "Planning",
      href: "/tree-calculator",
    },
    {
      icon: <BookOpen size={22} />,
      color: "#ea580c",
      bg: "#fff7ed",
      title: "Reference Library",
      desc: "Glossary and articles on AQI, PM2.5, urban heat islands, environmental justice, and green infrastructure.",
      tag: "Education",
      href: "/learn",
    },
    {
      icon: <GraduationCap size={22} />,
      color: "#0369a1",
      bg: "#e0f2fe",
      title: "Classroom Toolkit",
      desc: "NGSS-aligned lesson plans for grades 6-12 using live data. Students compare their own neighborhoods in real time.",
      tag: "K-12",
      href: "/classroom",
    },
    {
      icon: <Megaphone size={22} />,
      color: "#9333ea",
      bg: "#fae8ff",
      title: "Take Action",
      desc: "Representative lookup, pre-written advocacy emails with local data, and shareable social media templates.",
      tag: "Civic",
      href: "/action",
    },
  ];

  const users = [
    {
      icon: <TreePine size={22} />,
      color: "#16a34a",
      bg: "#dcfce7",
      title: "Community Gardens & Conservatories",
      desc: "Generate impact reports and grant documentation without dedicated data staff.",
    },
    {
      icon: <Megaphone size={22} />,
      color: "#2563eb",
      bg: "#dbeafe",
      title: "Environmental Nonprofits",
      desc: "Access source-cited, locally specific data for city council meetings, media outreach, and organizing.",
    },
    {
      icon: <GraduationCap size={22} />,
      color: "#ea580c",
      bg: "#fff7ed",
      title: "Educators",
      desc: "Free, no-prep activities using real-time data aligned to NGSS standards.",
    },
    {
      icon: <Users size={22} />,
      color: "#7c3aed",
      bg: "#ede9fe",
      title: "Community Residents",
      desc: "Document environmental conditions and build evidence for neighborhood policy change.",
    },
  ];

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="section-label" style={{ color: "var(--primary-500)", marginBottom: 12 }}>
            Open-Source Environmental Research
          </p>
          <h1>Turn climate data into<br />community action</h1>
          <p className="hero-subtitle">
            Climate Lens aggregates real-time data from the EPA, NOAA, and FEMA into
            grant reports, impact assessments, classroom activities, and advocacy materials —
            so your organization can focus on what matters.
          </p>
          <form onSubmit={handleSearch} className="hero-search">
            <input
              className="input"
              placeholder="Enter ZIP code"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
              maxLength={5}
            />
            <button type="submit" className="btn btn-white btn-large" style={{ gap: 6, flexShrink: 0 }}>
              <Search size={18} /> Explore
            </button>
          </form>
          <div className="hero-badges">
            <span className="hero-badge"><CheckCircle2 size={16} /> Free & open source</span>
            <span className="hero-badge"><CheckCircle2 size={16} /> No account required</span>
            <span className="hero-badge"><CheckCircle2 size={16} /> Real-time government data</span>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="stats-bar">
        <div className="stats-bar-inner">
          <div className="stat-item">
            <div className="stat-number">9</div>
            <div className="stat-label">Free Research Tools</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5+</div>
            <div className="stat-label">Government Data Sources</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">41,000+</div>
            <div className="stat-label">US ZIP Codes Covered</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Free & Open Source</div>
          </div>
        </div>
      </section>

      {/* Data sources trust bar */}
      <section style={{ padding: "24px 0", background: "var(--bg-section-alt)" }}>
        <div className="trust-bar" style={{ maxWidth: "var(--max-width)", margin: "0 auto", background: "transparent" }}>
          <span style={{ fontSize: "0.82rem", color: "var(--text-caption)", fontWeight: 500 }}>POWERED BY</span>
          <span className="trust-item"><Database size={14} /> EPA AirNow</span>
          <span className="trust-item"><Database size={14} /> EPA EJScreen</span>
          <span className="trust-item"><Database size={14} /> NOAA/ECMWF</span>
          <span className="trust-item"><Database size={14} /> FEMA NRI</span>
          <span className="trust-item"><Database size={14} /> Mapping Inequality</span>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          <div className="section-header">
            <span className="section-label">Tools</span>
            <h2>Everything your organization needs</h2>
            <p>
              Nine purpose-built tools that transform raw government data into
              the formats nonprofits, educators, and advocates actually use.
            </p>
          </div>

          <div className="grid-3">
            {features.map((f) => (
              <Link key={f.title} href={f.href} style={{ textDecoration: "none" }}>
                <div className="feature-card" style={{ height: "100%" }}>
                  <div className="feature-card-icon" style={{ background: f.bg, color: f.color }}>
                    {f.icon}
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <span className="feature-card-tag">{f.tag}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{ padding: "72px 24px", background: "var(--bg-section-alt)" }}>
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          <div className="section-header">
            <span className="section-label">Built For</span>
            <h2>Designed for organizations making a difference</h2>
            <p>
              Whether you're writing grants, teaching students, or advocating at city hall —
              Climate Lens gives you the data you need in the format you need it.
            </p>
          </div>

          <div className="grid-2">
            {users.map((u) => (
              <div key={u.title} className="user-card">
                <div className="user-card-icon" style={{ background: u.bg, color: u.color }}>
                  {u.icon}
                </div>
                <div>
                  <h3>{u.title}</h3>
                  <p>{u.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="section-header">
            <span className="section-label">How It Works</span>
            <h2>From ZIP code to actionable insight</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="step-row">
              <span className="step-number">1</span>
              <div>
                <strong>Enter a ZIP code</strong>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Climate Lens converts your ZIP to coordinates and queries multiple government APIs in real time.
                </p>
              </div>
            </div>
            <div className="step-row">
              <span className="step-number">2</span>
              <div>
                <strong>Get a complete environmental profile</strong>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  Air quality, temperature trends, flood and wind risk, EJScreen data, and historical redlining — all in one view.
                </p>
              </div>
            </div>
            <div className="step-row">
              <span className="step-number">3</span>
              <div>
                <strong>Export in the format you need</strong>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  PDF reports for funders, lesson plans for classrooms, comparison data for advocacy, or emails for elected officials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology (collapsed for cleanliness but still accessible) */}
      <section style={{ padding: "48px 24px", background: "var(--bg-section-alt)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="section-header" style={{ marginBottom: 24 }}>
            <span className="section-label">Methodology</span>
            <h2>Transparent & reproducible</h2>
            <p>
              All data comes from public APIs with no caching or modeling.
              Every number is traceable to its government source.
            </p>
          </div>

          <div className="card">
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 12 }}>Climate Vulnerability Score (0-100)</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 16 }}>
              A composite index where higher scores indicate greater vulnerability:
            </p>
            <div className="metric-row">
              <span className="metric-label">Air Quality</span>
              <span className="metric-value">30%</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Heat Risk</span>
              <span className="metric-value">25%</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Flood Risk</span>
              <span className="metric-value">20%</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Wind Risk</span>
              <span className="metric-value">12.5%</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Environmental Justice Baseline</span>
              <span className="metric-value">12.5%</span>
            </div>
            <p style={{ color: "var(--text-dim)", fontSize: "0.82rem", marginTop: 16, lineHeight: 1.7 }}>
              Temperature trends use 10 years of NOAA/ECMWF ERA5 reanalysis data.
              EJScreen data from EPA. Redlining grades from the University of Richmond
              Mapping Inequality project.
            </p>
          </div>

          <div className="insight-banner" style={{ marginTop: 16 }}>
            Climate Lens supplements tools like{" "}
            <a href="https://www.epa.gov/ejscreen" target="_blank" rel="noopener noreferrer">EPA EJScreen</a>,{" "}
            <a href="https://climatevulnerabilityindex.org/" target="_blank" rel="noopener noreferrer">U.S. Climate Vulnerability Index</a>, and{" "}
            <a href="https://screeningtool.geoplatform.gov/" target="_blank" rel="noopener noreferrer">CEJST</a> —
            translating the same data into output formats (PDF reports, lesson plans, advocacy templates) those tools don't provide.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to use climate data for good?</h2>
        <p>
          Climate Lens is free, open source, and requires no account.
          Start exploring your community's environmental data today.
        </p>
        <div className="cta-buttons">
          <Link href="/lookup" className="btn btn-white btn-large">
            <Search size={18} /> Start Exploring
          </Link>
          <Link href="/about" className="btn btn-ghost btn-large">
            Learn More <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
