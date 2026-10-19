"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, MapPin, GitCompare, Users, FileText, Heart,
  TreePine, BookOpen, GraduationCap, Megaphone, Database
} from "lucide-react";

function useCountUp(end, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * end));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.unobserve(el);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return { count, ref };
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealDiv({ children, className = "", delay = 0, style }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${delay ? `reveal-delay-${delay}` : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

export default function Home() {
  const [zip, setZip] = useState("");
  const router = useRouter();

  const tools = useCountUp(9);
  const sources = useCountUp(5);
  const zips = useCountUp(41000);
  const open = useCountUp(100);

  const handleSearch = (e) => {
    e.preventDefault();
    const cleaned = zip.trim();
    if (/^\d{5}$/.test(cleaned)) {
      router.push(`/lookup?zip=${cleaned}`);
    }
  };

  const features = [
    { icon: <MapPin size={20} />, title: "Climate Lookup", desc: "Real-time AQI, temperature, risk scores, 10-year trends, EJScreen data, and historical redlining for any US ZIP code.", tag: "Research", href: "/lookup" },
    { icon: <GitCompare size={20} />, title: "Compare Areas", desc: "Side-by-side environmental comparison of two ZIP codes with differential analysis and pre-loaded disparity examples.", tag: "Advocacy", href: "/compare" },
    { icon: <Users size={20} />, title: "Community Evidence Board", desc: "Citizen-submitted observations paired with real-time EPA/NOAA data. Includes upvoting and exportable advocacy packets.", tag: "Organizing", href: "/community" },
    { icon: <FileText size={20} />, title: "Impact Report", desc: "Generate downloadable PDFs comparing green space metrics against nearby areas with executive summaries for funders.", tag: "Grants", href: "/impact" },
    { icon: <Heart size={20} />, title: "Health Cost Calculator", desc: "Estimate annual health costs from air quality and heat exposure per 1,000 residents using EPA and CDC methodology.", tag: "Policy", href: "/health-cost" },
    { icon: <TreePine size={20} />, title: "Tree ROI Calculator", desc: "Calculate CO2 absorption, costs, and payback periods for tree initiatives with grant-ready language.", tag: "Planning", href: "/tree-calculator" },
    { icon: <BookOpen size={20} />, title: "Reference Library", desc: "Glossary and articles on AQI, PM2.5, urban heat islands, environmental justice, and green infrastructure.", tag: "Education", href: "/learn" },
    { icon: <GraduationCap size={20} />, title: "Classroom Toolkit", desc: "NGSS-aligned lesson plans for grades 6-12 using live data. Students compare their own neighborhoods in real time.", tag: "K-12", href: "/classroom" },
    { icon: <Megaphone size={20} />, title: "Take Action", desc: "Representative lookup, pre-written advocacy emails with local data, and shareable social media templates.", tag: "Civic", href: "/action" },
  ];

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Climate Lens</h1>
          <p className="hero-subtitle">
            An open-source research tool that aggregates environmental data from the EPA, NOAA, and
            FEMA into actionable formats for community organizations, educators, and advocates.
          </p>
          <form onSubmit={handleSearch} className="hero-search">
            <input
              className="input"
              placeholder="Enter ZIP code"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
              maxLength={5}
            />
            <button type="submit" className="btn btn-gold btn-large" style={{ flexShrink: 0 }}>
              <Search size={16} /> Explore
            </button>
          </form>
          <div className="hero-badges">
            <span className="hero-badge">Free &amp; open source</span>
            <span className="hero-badge">No account required</span>
            <span className="hero-badge">Real-time data</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div className="stats-bar">
          <div className="stat-item" ref={tools.ref}>
            <div className="stat-number">{tools.count}</div>
            <div className="stat-label">Free Tools</div>
          </div>
          <div className="stat-item" ref={sources.ref}>
            <div className="stat-number">{sources.count}+</div>
            <div className="stat-label">Data Sources</div>
          </div>
          <div className="stat-item" ref={zips.ref}>
            <div className="stat-number">{zips.count.toLocaleString()}+</div>
            <div className="stat-label">ZIP Codes</div>
          </div>
          <div className="stat-item" ref={open.ref}>
            <div className="stat-number">{open.count}%</div>
            <div className="stat-label">Open Source</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container" style={{ paddingBottom: 40 }}>
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <h2 style={{ fontSize: "0.78em", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--gray-400)", margin: 0 }}>Available Tools</h2>
          <div className="divider" style={{ flex: 1, maxWidth: 200 }}></div>
        </div>

        <div className="grid-3" style={{ marginTop: 16 }}>
          {features.map((f, i) => (
            <RevealDiv key={f.title} delay={i % 3}>
              <Link href={f.href} style={{ textDecoration: "none", display: "block" }}>
                <div className="feature-card" style={{ height: "100%" }}>
                  <div className="feature-card-icon" style={{ background: "rgba(95,168,211,0.12)", color: "var(--ocean)" }}>
                    {f.icon}
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <span className="feature-card-tag">{f.tag}</span>
                </div>
              </Link>
            </RevealDiv>
          ))}
        </div>
      </div>

      {/* Data sources */}
      <RevealDiv className="container" style={{ paddingBottom: 40 }}>
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <h2 style={{ fontSize: "0.78em", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--gray-400)", margin: 0 }}>Powered By</h2>
          <div className="divider" style={{ flex: 1, maxWidth: 200 }}></div>
        </div>
        <div className="trust-bar" style={{ justifyContent: "flex-start", padding: "16px 0" }}>
          <span className="trust-item"><Database size={13} /> EPA AirNow</span>
          <span className="trust-item"><Database size={13} /> EPA EJScreen</span>
          <span className="trust-item"><Database size={13} /> NOAA/ECMWF</span>
          <span className="trust-item"><Database size={13} /> FEMA NRI</span>
          <span className="trust-item"><Database size={13} /> Mapping Inequality</span>
        </div>
      </RevealDiv>

      {/* Methodology */}
      <RevealDiv className="container" style={{ paddingBottom: 40 }}>
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <h2 style={{ fontSize: "0.78em", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--gray-400)", margin: 0 }}>Methodology</h2>
          <div className="divider" style={{ flex: 1, maxWidth: 200 }}></div>
        </div>
        <div style={{ fontSize: "0.9rem", color: "var(--gray-500)", lineHeight: 1.8 }}>
          <p style={{ marginBottom: 12 }}>
            Climate Lens retrieves data from public APIs in real time. No data is pre-cached or
            modeled. The Climate Vulnerability Score is a composite index (0-100) weighted as follows:
            air quality (30%), heat risk (25%), flood risk (20%), wind risk (12.5%), and an estimated
            environmental justice baseline (12.5%). Higher scores indicate greater vulnerability.
          </p>
          <p>
            This tool supplements established environmental assessment tools such as{" "}
            <a href="https://www.epa.gov/ejscreen" target="_blank" rel="noopener noreferrer">EPA EJScreen</a>,
            the <a href="https://climatevulnerabilityindex.org/" target="_blank" rel="noopener noreferrer">U.S. Climate Vulnerability Index</a>,
            and the <a href="https://screeningtool.geoplatform.gov/" target="_blank" rel="noopener noreferrer">CEJST</a>.
            Its contribution is translating the same underlying data into output formats
            that existing tools do not provide.
          </p>
        </div>
      </RevealDiv>

      {/* CTA */}
      <RevealDiv className="container" style={{ paddingBottom: 48 }}>
        <div className="cta-section">
          <h2>Ready to use climate data for good?</h2>
          <p>
            Free, open source, and built for organizations making a difference.
            No account required — just enter a ZIP code.
          </p>
          <div className="cta-buttons">
            <Link href="/lookup" className="btn btn-gold btn-large">
              <Search size={16} /> Start Exploring
            </Link>
            <Link href="/about" className="btn btn-ghost btn-large">
              Learn More →
            </Link>
          </div>
        </div>
      </RevealDiv>
    </div>
  );
}
