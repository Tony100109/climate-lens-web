"use client";
import Link from "next/link";
import { Github, Mail, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const dataSources = [
    { name: "EPA AirNow", desc: "Real-time air quality index and pollutant data" },
    { name: "EPA EJScreen", desc: "Environmental justice screening indicators and demographics" },
    { name: "NOAA/ECMWF via Open-Meteo", desc: "Current weather, forecasts, and 10-year historical archives" },
    { name: "FEMA National Risk Index", desc: "Flood, wind, and natural hazard risk assessments" },
    { name: "Mapping Inequality, UofR", desc: "1930s HOLC redlining maps digitized by University of Richmond" },
    { name: "Zippopotam.us", desc: "ZIP code to coordinates geocoding" },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div className="hero">
        <div className="hero-content" style={{ paddingTop: 56, paddingBottom: 48 }}>
          <h1 style={{ fontSize: "2.8em" }}>About Climate Lens</h1>
          <p className="hero-subtitle" style={{ maxWidth: 560 }}>
            The last mile between government data and community action.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 48 }}>

        {/* Story */}
        <div style={{ maxWidth: 640, color: "var(--gray-500)", lineHeight: 1.9, fontSize: "0.95rem" }}>
          <p style={{ marginBottom: 20 }}>
            Climate Lens started with a simple frustration: the U.S. government collects
            incredible environmental data through the EPA, NOAA, and FEMA — but the people
            who need it most can't access it in a useful format.
          </p>
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
          <p style={{ marginBottom: 32 }}>
            This isn't a replacement for tools like EJScreen or the Climate Vulnerability Index.
            Those tools are more comprehensive and more precise. Climate Lens is the{" "}
            <strong style={{ color: "var(--navy)" }}>last mile</strong> —
            the step between "the data exists" and "I can use it right now."
          </p>
        </div>

        {/* How it works */}
        <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <h2 style={{ fontSize: "0.78em", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--gray-400)", margin: 0 }}>How It Works</h2>
          <div className="divider" style={{ flex: 1, maxWidth: 200 }}></div>
        </div>
        <p style={{ color: "var(--gray-500)", fontSize: "0.92rem", lineHeight: 1.75, marginBottom: 20, maxWidth: 640 }}>
          Every tool on this site pulls data from free, public APIs in real time. When you
          search a ZIP code, Climate Lens fetches current air quality, weather conditions,
          historical temperature trends, and environmental justice indicators. Nothing is
          stored except community reports (submitted voluntarily by users). The site is
          open source and free to use — no accounts, no paywalls, no ads.
        </p>

        {/* Data sources */}
        <div style={{ marginBottom: 12, marginTop: 36, display: "flex", alignItems: "center", gap: 12 }}>
          <h2 style={{ fontSize: "0.78em", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--gray-400)", margin: 0 }}>Data Sources</h2>
          <div className="divider" style={{ flex: 1, maxWidth: 200 }}></div>
        </div>

        <div className="card" style={{ marginBottom: 32, maxWidth: 640 }}>
          {dataSources.map((ds) => (
            <div className="metric-row" key={ds.name}>
              <span className="metric-label" style={{ fontWeight: 600, color: "var(--navy)" }}>{ds.name}</span>
              <span style={{ color: "var(--gray-400)", fontSize: "0.85rem" }}>{ds.desc}</span>
            </div>
          ))}
        </div>

        {/* Open source + Contact */}
        <div className="grid-2" style={{ gap: 16, maxWidth: 640, marginBottom: 36 }}>
          <div className="card" style={{ padding: 28 }}>
            <Github size={24} style={{ color: "var(--navy)", marginBottom: 10 }} />
            <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: 6 }}>Open Source</h3>
            <p style={{ color: "var(--gray-500)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: 14 }}>
              View the code, suggest improvements, or fork it for your own community.
            </p>
            <a href="https://github.com/Tony100109/climate-lens-web" target="_blank" rel="noopener noreferrer"
              className="btn btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "10px 20px" }}>
              <Github size={14} /> View on GitHub
            </a>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <Mail size={24} style={{ color: "var(--gold)", marginBottom: 10 }} />
            <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: 6 }}>Get in Touch</h3>
            <p style={{ color: "var(--gray-500)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: 14 }}>
              Using Climate Lens for your organization? Have feedback? I'd love to hear from you.
            </p>
            <a href="mailto:Tony.ScienceHumanitarian@outlook.com"
              className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px 20px" }}>
              <Mail size={14} /> Contact Me
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section">
          <h2>Start using Climate Lens today</h2>
          <p>Free, open source, and built for organizations making a difference.</p>
          <div className="cta-buttons">
            <Link href="/lookup" className="btn btn-gold btn-large">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
