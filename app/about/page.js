"use client";
import Link from "next/link";
import {
  Leaf, Github, Mail, Database, Shield, Users, Heart,
  ArrowRight, CheckCircle2, Globe, BookOpen, GraduationCap
} from "lucide-react";

export default function AboutPage() {
  const dataSources = [
    { name: "EPA AirNow", desc: "Real-time air quality index and pollutant data", type: "Air Quality" },
    { name: "EPA EJScreen", desc: "Environmental justice screening indicators and demographics", type: "Environmental Justice" },
    { name: "NOAA/ECMWF via Open-Meteo", desc: "Current weather, forecasts, and 10-year historical archives", type: "Weather & Climate" },
    { name: "Open-Meteo Air Quality API", desc: "Real-time PM2.5, PM10, NO2, and Ozone measurements", type: "Air Quality" },
    { name: "FEMA National Risk Index", desc: "Flood, wind, and natural hazard risk assessments", type: "Risk" },
    { name: "Mapping Inequality, UofR", desc: "1930s HOLC redlining maps digitized by University of Richmond", type: "Historical" },
  ];

  const values = [
    {
      icon: <Shield size={22} />,
      title: "Transparent",
      desc: "All data comes from public government APIs. Every number is traceable. The code is open source.",
    },
    {
      icon: <Users size={22} />,
      title: "Accessible",
      desc: "No account, no paywall, no ads. Built so anyone — regardless of technical skill — can use real environmental data.",
    },
    {
      icon: <Heart size={22} />,
      title: "Actionable",
      desc: "Data alone doesn't create change. Climate Lens packages data into the formats organizations actually use.",
    },
  ];

  return (
    <div className="page">
      {/* Hero area */}
      <section style={{ background: "var(--bg-section-alt)", padding: "64px 24px 56px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <span className="section-label">About</span>
          <h1 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2.4rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: 16
          }}>
            The last mile between<br />
            <span style={{ color: "var(--primary)" }}>government data</span> and{" "}
            <span style={{ color: "var(--primary)" }}>community action</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: 1.8, maxWidth: 600 }}>
            Climate Lens started with a simple frustration: the U.S. government collects
            incredible environmental data — but the people who need it most can't access it
            in a useful format.
          </p>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: "56px 24px" }}>
        <div className="container-content" style={{ padding: 0, maxWidth: 700, margin: "0 auto" }}>
          <div style={{ color: "var(--text-muted)", lineHeight: 1.9, fontSize: "1rem" }}>
            <p style={{ marginBottom: 20 }}>
              A botanical garden director applying for a grant shouldn't need to navigate
              three different federal databases to prove her green space improves local air quality.
              A teacher planning an environmental justice lesson shouldn't need a data science
              background to show students that some neighborhoods breathe worse air than others.
              A resident attending a city council meeting shouldn't need to write a research paper
              to argue that their block needs more trees.
            </p>

            <p style={{ marginBottom: 20 }}>
              So I built Climate Lens. It pulls real-time data from the same public APIs the
              government uses — EPA AirNow, EJScreen, NOAA weather data, the Mapping Inequality
              redlining archive — and packages it into formats people actually need: grant reports,
              classroom activities, neighborhood comparisons, advocacy emails, and community
              evidence documentation.
            </p>

            <p style={{ marginBottom: 20 }}>
              This isn't a replacement for tools like EJScreen or the Climate Vulnerability Index.
              Those tools are more comprehensive and more precise. Climate Lens is the <strong style={{ color: "var(--text)" }}>last mile</strong> —
              the step between "the data exists" and "I can use it right now."
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "56px 24px", background: "var(--bg-section-alt)" }}>
        <div style={{ maxWidth: "var(--max-width)", margin: "0 auto" }}>
          <div className="section-header">
            <span className="section-label">Principles</span>
            <h2>What we believe</h2>
          </div>
          <div className="grid-3">
            {values.map((v) => (
              <div key={v.title} className="card" style={{ textAlign: "center", padding: 32 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: "var(--primary-100)", color: "var(--primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px"
                }}>
                  {v.icon}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 8 }}>{v.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "56px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="section-header">
            <span className="section-label">Under the Hood</span>
            <h2>How it works</h2>
            <p>Every tool pulls data from free, public APIs in real time.</p>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <CheckCircle2 size={18} style={{ color: "var(--accent-green)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.95rem" }}>All data fetched in real time — nothing pre-cached or modeled</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <CheckCircle2 size={18} style={{ color: "var(--accent-green)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.95rem" }}>No user accounts, paywalls, or advertising</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <CheckCircle2 size={18} style={{ color: "var(--accent-green)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.95rem" }}>Only community reports are stored (submitted voluntarily)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <CheckCircle2 size={18} style={{ color: "var(--accent-green)", flexShrink: 0 }} />
                <span style={{ fontSize: "0.95rem" }}>Fully open source — view, fork, or contribute on GitHub</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data sources */}
      <section style={{ padding: "56px 24px", background: "var(--bg-section-alt)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="section-header">
            <span className="section-label">Data Sources</span>
            <h2>Government-grade data</h2>
            <p>Climate Lens integrates data from trusted federal and academic sources.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {dataSources.map((ds) => (
              <div key={ds.name} className="card" style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <h4 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: 2 }}>{ds.name}</h4>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{ds.desc}</p>
                  </div>
                  <span className="tag tag-green">{ds.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For nonprofits */}
      <section style={{ padding: "56px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="section-header">
            <span className="section-label">For Organizations</span>
            <h2>Use Climate Lens for your nonprofit</h2>
            <p>
              Climate Lens is free for any organization to use. Here's how nonprofits
              are already putting it to work.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="card">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "#dcfce7", color: "#166534",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 4 }}>Grant Writing</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                    Use the Impact Report tool to generate PDF reports with environmental metrics,
                    executive summaries, and funder-ready narratives. The Tree ROI Calculator
                    produces grant-ready language with computed values.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "#dbeafe", color: "#2563eb",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Globe size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 4 }}>Community Advocacy</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                    Compare neighborhoods side-by-side to demonstrate environmental disparities.
                    Use the Community Evidence Board to collect and validate citizen observations
                    with official data.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "#fff7ed", color: "#ea580c",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 4 }}>Education Programs</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                    Ready-to-use lesson plans aligned to NGSS standards. Students explore real
                    environmental data from their own neighborhoods — no prep required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open source + Contact */}
      <section style={{ padding: "56px 24px", background: "var(--bg-section-alt)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="grid-2" style={{ gap: 24 }}>
            <div className="card" style={{ padding: 32 }}>
              <Github size={28} style={{ color: "var(--text)", marginBottom: 12 }} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 8 }}>Open Source</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 16 }}>
                Climate Lens is fully open source. View the code, suggest improvements,
                or fork it for your own community.
              </p>
              <a href="https://github.com/Tony100109/climate-lens-web" target="_blank" rel="noopener noreferrer"
                className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
                <Github size={16} /> View on GitHub
              </a>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <Mail size={28} style={{ color: "var(--primary)", marginBottom: 12 }} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 8 }}>Get in Touch</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 16 }}>
                Using Climate Lens for your organization? Have feedback or want to
                collaborate? I'd love to hear from you.
              </p>
              <a href="mailto:Tony.ScienceHumanitarian@outlook.com"
                className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                <Mail size={16} /> Contact Me
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Start using Climate Lens today</h2>
        <p>
          Free, open source, and built for organizations making a difference.
          No account required — just enter a ZIP code.
        </p>
        <div className="cta-buttons">
          <Link href="/lookup" className="btn btn-white btn-large">
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
